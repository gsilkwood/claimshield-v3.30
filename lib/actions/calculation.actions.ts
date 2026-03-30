'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { appraisals, comparableVehicles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { calculateComparableAdjustments } from '@/lib/calculations/adjustments'
import { calculateDiminishedValue } from '@/lib/calculations/dv-calculator'

export async function runAppraisalCalculations(appraisalId: string) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkId)
  })
  if (!user) throw new Error('User not found')

  const appraisal = await db.query.appraisals.findFirst({
    where: (appraisals, { eq, and }) => and(
      eq(appraisals.id, appraisalId),
      eq(appraisals.userId, user.id)
    )
  })
  if (!appraisal) throw new Error('Appraisal not found')

  const comps = await db.query.comparableVehicles.findMany({
    where: (comps, { eq }) => eq(comps.appraisalId, appraisalId)
  })

  const subjectVehicle = appraisal.subjectVehicle as any
  const repairCost = (appraisal.accidentDetails as any)?.totalRepairCost || 0

  // 1. Calculate adjustments for each comparable
  const updatedComps = await Promise.all(comps.map(async (comp) => {
    const breakdown = calculateComparableAdjustments(
      {
        year: subjectVehicle.year,
        make: subjectVehicle.make,
        model: subjectVehicle.model,
        mileageAtAccident: subjectVehicle.mileage,
        preAccidentCondition: subjectVehicle.conditionGrade || 3,
        optionalEquipment: subjectVehicle.optionalEquipment || []
      },
      {
        year: comp.year,
        mileage: comp.mileage,
        listingPrice: Number(comp.listingPrice),
        optionalEquipment: (comp as any).optionalEquipment || []
      }
    )

    await db.update(comparableVehicles)
      .set({
        adjustments: breakdown,
        adjustedValue: breakdown.adjustedValue.toString()
      })
      .where(eq(comparableVehicles.id, comp.id))

    return { ...comp, adjustedValue: breakdown.adjustedValue, includedInCalculation: comp.includedInCalculation }
  }))

  // 2. Run DV Calculation
  const cleanComps = updatedComps.filter(c => c.compType === 'pre_accident')
  const accidentComps = updatedComps.filter(c => c.compType === 'post_accident')

  const result = calculateDiminishedValue(
    cleanComps.map(c => ({ adjustedValue: Number(c.adjustedValue), includedInCalculation: c.includedInCalculation })),
    accidentComps.map(c => ({ adjustedValue: Number(c.adjustedValue), includedInCalculation: c.includedInCalculation })),
    repairCost
  )

  // 3. Save results to appraisal
  await db.update(appraisals)
    .set({
      valuationResults: result,
      updatedAt: new Date()
    })
    .where(eq(appraisals.id, appraisalId))

  return result
}

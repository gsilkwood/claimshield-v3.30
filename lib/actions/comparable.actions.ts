'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { appraisals, comparableVehicles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { searchComparableVehicles } from '@/lib/scraping/comparable-search'

export async function triggerComparableSearch(appraisalId: string, type: 'pre_accident' | 'post_accident') {
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

  const subject = appraisal.subjectVehicle as any
  if (!subject) throw new Error('Subject vehicle details missing')

  // Trigger search
  const results = await searchComparableVehicles({
    make: subject.make,
    model: subject.model,
    year: subject.year,
    trim: subject.trim,
    mileage: subject.mileage,
    state: (appraisal.ownerInfo as any)?.address?.state || 'GA',
    accidentHistoryRequired: type === 'post_accident'
  }, appraisalId)

  return results
}

export async function getComparables(appraisalId: string) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkId)
  })
  if (!user) throw new Error('User not found')

  const comps = await db.query.comparableVehicles.findMany({
    where: (comps, { eq }) => eq(comps.appraisalId, appraisalId)
  })

  return comps
}

export async function toggleComparableInclusion(compId: string, included: boolean) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  await db.update(comparableVehicles)
    .set({ includedInCalculation: included })
    .where(eq(comparableVehicles.id, compId))
}

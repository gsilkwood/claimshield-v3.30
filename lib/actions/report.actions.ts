'use server'

import { auth } from '@clerk/nextjs/server'
import { generateAppraisalReport, generateDemandLetter } from '@/lib/pdf/generator'
import { sendReportReadyNotification } from '@/lib/actions/notification.actions'
import { db } from '@/lib/db'
import { appraisals } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function triggerReportGeneration(appraisalId: string) {
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

  if (!appraisal.isPaid) {
    // In a real app, we'd check Stripe status here.
    // For now, we'll allow generation if we're in dev mode or if the user is gsilkwood@gmail.com
    // But per directive, we should wire checkout later. 
    // For testing, we'll assume it's paid or handle it gracefully.
  }

  // 1. Generate Report
  const reportUrl = await generateAppraisalReport(appraisalId)

  // 2. Generate Demand Letter
  await generateDemandLetter(appraisalId)

  // 3. Send Notifications (Async)
  sendReportReadyNotification(appraisalId).catch(err => {
    console.error('Notification delivery failed:', err)
  })

  return reportUrl
}

export async function getReportUrl(appraisalId: string) {
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

  return appraisal.reportPdfUrl
}

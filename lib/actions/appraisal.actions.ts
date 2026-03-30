'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { appraisals } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function saveAppraisalDraft(id: string, data: any): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, error: 'Unauthorized' }

    // Find user by clerkId
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, userId)
    })
    
    if (!user) return { success: false, error: 'User not found' }

    // Verify ownership
    const existing = await db.query.appraisals.findFirst({
      where: (appraisals, { eq, and }) => and(
        eq(appraisals.id, id),
        eq(appraisals.userId, user.id)
      )
    })

    if (!existing) return { success: false, error: 'Appraisal not found or unauthorized' }

    const [updated] = await db.update(appraisals)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(appraisals.id, id))
      .returning()

    return { success: true, data: updated }
  } catch (error) {
    console.error('Failed to save draft:', error)
    return { success: false, error: 'Failed to save draft' }
  }
}

export async function createAppraisalDraft(): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, error: 'Unauthorized' }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, userId)
    })
    
    if (!user) return { success: false, error: 'User not found' }

    const [appraisal] = await db.insert(appraisals)
      .values({
        userId: user.id,
        status: 'draft',
      })
      .returning({ id: appraisals.id })

    return { success: true, data: { id: appraisal.id } }
  } catch (error) {
    console.error('Failed to create draft:', error)
    return { success: false, error: 'Failed to create draft' }
  }
}

export async function getAppraisal(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, userId)
  })
  
  if (!user) throw new Error('User not found')

  const appraisal = await db.query.appraisals.findFirst({
    where: (appraisals, { eq, and }) => and(
      eq(appraisals.id, id),
      eq(appraisals.userId, user.id)
    )
  })
  
  return appraisal
}

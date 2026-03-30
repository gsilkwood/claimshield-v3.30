import { put } from '@vercel/blob'
import { auth } from '@clerk/nextjs/server'
import { extractRepairEstimate } from '@/lib/ai/document-extraction'
import { db } from '@/lib/db'
import { appraisals } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const fileType = formData.get('type') as string // 'repair_estimate' | 'photo' | 'insurance_card'
  const appraisalId = formData.get('appraisalId') as string

  if (!file || !appraisalId) {
    return Response.json({ error: 'Missing file or appraisalId' }, { status: 400 })
  }

  // 1. Upload to Vercel Blob immediately
  const blob = await put(`uploads/${clerkId}/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  // 2. If repair estimate, trigger async Gemini extraction
  if (fileType === 'repair_estimate') {
    // We update the appraisal with the URL first
    await db.update(appraisals)
      .set({ repairEstimateUrl: blob.url })
      .where(eq(appraisals.id, appraisalId))

    // Trigger extraction asynchronously (don't await it for the response)
    // In a real production app, you might use a background job queue (like Upstash QStash or Inngest)
    // For this environment, we'll start it and let it run.
    extractAndSave(blob.url, appraisalId).catch(console.error)
  } else if (fileType === 'photo') {
    // Handle photos - append to damagePhotos array
    const appraisal = await db.query.appraisals.findFirst({
      where: (appraisals, { eq }) => eq(appraisals.id, appraisalId)
    })
    if (appraisal) {
      const currentPhotos = (appraisal.damagePhotos as string[]) || []
      await db.update(appraisals)
        .set({ damagePhotos: [...currentPhotos, blob.url] })
        .where(eq(appraisals.id, appraisalId))
    }
  }

  return Response.json({ url: blob.url })
}

async function extractAndSave(url: string, appraisalId: string) {
  try {
    const data = await extractRepairEstimate(url)
    
    // Map extracted data to AccidentDetails shape
    const accidentDetails = {
      totalRepairCost: data.totalRepairCost,
      bodyLaborHours: data.laborHours.body,
      frameLaborHours: data.laborHours.frame,
      refinishLaborHours: data.laborHours.refinish,
      mechanicalLaborHours: data.laborHours.mechanical,
      totalLaborHours: data.laborHours.total,
      structuralDamage: data.damageIndicators.structuralDamage,
      frameDamage: data.damageIndicators.frameDamage,
      framePullingRequired: data.damageIndicators.framePullingRequired,
      airbagDeployment: data.damageIndicators.airbagDeployment,
      alignmentRequired: data.damageIndicators.alignmentRequired,
      panelsReplaced: data.itemizedRepairs.map(item => ({
        panelName: item.description,
        panelType: item.partType as any,
        action: item.action === 'replace' ? 'replaced' : 'repaired'
      })),
      repairFacility: data.repairFacility.name
    }

    await db.update(appraisals)
      .set({ 
        extractedRepairData: data,
        accidentDetails: accidentDetails,
        updatedAt: new Date()
      })
      .where(eq(appraisals.id, appraisalId))
  } catch (error) {
    console.error('Extraction failed for appraisal', appraisalId, error)
  }
}

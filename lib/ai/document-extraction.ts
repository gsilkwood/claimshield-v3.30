import { ai, MODELS } from './client'
import { repairEstimateOutputSchema } from '@/lib/validators/appraisal.schema'
import { REPAIR_ESTIMATE_EXTRACTION_PROMPT } from './prompts/repair-estimate.prompt'

export interface ExtractedRepairData {
  totalRepairCost: number
  laborHours: {
    body: number
    frame: number
    refinish: number
    mechanical: number
    total: number
  }
  itemizedRepairs: Array<{
    description: string
    partType: 'structural' | 'cosmetic' | 'mechanical'
    action: 'repair' | 'replace'
    laborHours: number
    partsCost: number
    laborCost: number
    totalCost: number
  }>
  damageIndicators: {
    structuralDamage: boolean
    frameDamage: boolean
    framePullingRequired: boolean
    airbagDeployment: boolean
    alignmentRequired: boolean
  }
  repairFacility: {
    name: string | null
    address: string | null
  }
  confidence: number  // 0–1
}

function detectMimeType(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf': return 'application/pdf'
    case 'png': return 'image/png'
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'heic': return 'image/heic'
    default: return 'application/pdf'
  }
}

export async function extractRepairEstimate(fileUrl: string): Promise<ExtractedRepairData> {
  const fileBuffer = await fetch(fileUrl).then(r => r.arrayBuffer())
  const base64 = Buffer.from(fileBuffer).toString('base64')
  const mimeType = detectMimeType(fileUrl)

  const response = await ai.models.generateContent({
    model: MODELS.FAST,
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64 } },
        { text: REPAIR_ESTIMATE_EXTRACTION_PROMPT }
      ]
    }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT' as any,
        properties: {
          totalRepairCost: { type: 'NUMBER' as any },
          laborHours: {
            type: 'OBJECT' as any,
            properties: {
              body: { type: 'NUMBER' as any },
              frame: { type: 'NUMBER' as any },
              refinish: { type: 'NUMBER' as any },
              mechanical: { type: 'NUMBER' as any },
              total: { type: 'NUMBER' as any },
            }
          },
          itemizedRepairs: {
            type: 'ARRAY' as any,
            items: {
              type: 'OBJECT' as any,
              properties: {
                description: { type: 'STRING' as any },
                partType: { type: 'STRING' as any, enum: ['structural', 'cosmetic', 'mechanical'] },
                action: { type: 'STRING' as any, enum: ['repair', 'replace'] },
                laborHours: { type: 'NUMBER' as any },
                partsCost: { type: 'NUMBER' as any },
                laborCost: { type: 'NUMBER' as any },
                totalCost: { type: 'NUMBER' as any },
              }
            }
          },
          damageIndicators: {
            type: 'OBJECT' as any,
            properties: {
              structuralDamage: { type: 'BOOLEAN' as any },
              frameDamage: { type: 'BOOLEAN' as any },
              framePullingRequired: { type: 'BOOLEAN' as any },
              airbagDeployment: { type: 'BOOLEAN' as any },
              alignmentRequired: { type: 'BOOLEAN' as any },
            }
          },
          repairFacility: {
            type: 'OBJECT' as any,
            properties: {
              name: { type: 'STRING' as any, nullable: true },
              address: { type: 'STRING' as any, nullable: true },
            }
          },
          confidence: { type: 'NUMBER' as any },
        }
      }
    }
  })

  return JSON.parse(response.text ?? '{}') as ExtractedRepairData
}

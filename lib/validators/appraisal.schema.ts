import { z } from 'zod'
import { vehicleOwnerSchema, subjectVehicleSchema } from './vehicle.schema'

export const insuranceInfoSchema = z.object({
  insuranceCompany: z.string().min(1, 'Insurance company is required'),
  claimNumber: z.string().min(1, 'Claim number is required'),
  adjusterName: z.string().optional(),
  adjusterEmail: z.string().email().optional().or(z.literal('')),
  adjusterPhone: z.string().optional(),
  dateOfLoss: z.string().min(1, 'Date of loss is required'),
})

export const accidentDetailsSchema = z.object({
  pointOfImpact: z.string().min(1, 'Point of impact is required'),
  totalRepairCost: z.number().min(0),
  bodyLaborHours: z.number().min(0).default(0),
  frameLaborHours: z.number().min(0).default(0),
  refinishLaborHours: z.number().min(0).default(0),
  mechanicalLaborHours: z.number().min(0).default(0),
  totalLaborHours: z.number().min(0),
  structuralDamage: z.boolean().default(false),
  frameDamage: z.boolean().default(false),
  framePullingRequired: z.boolean().default(false),
  airbagDeployment: z.boolean().default(false),
  alignmentRequired: z.boolean().default(false),
  panelsReplaced: z.array(z.object({
    panelName: z.string(),
    panelType: z.enum(['structural', 'cosmetic', 'mechanical', 'bolt-on']),
    action: z.enum(['replaced', 'repaired']),
  })).default([]),
  repairFacility: z.string().optional(),
})

export const appraiserInfoSchema = z.object({
  isProfessionalAppraiser: z.boolean().default(false),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  licenseNumber: z.string().optional(),
  appraiserSignatureUrl: z.string().url().optional().or(z.literal('')),
})

export const repairEstimateOutputSchema = z.object({
  totalRepairCost: z.number(),
  laborHours: z.object({
    body: z.number(),
    frame: z.number(),
    refinish: z.number(),
    mechanical: z.number(),
    total: z.number(),
  }),
  itemizedRepairs: z.array(z.object({
    description: z.string(),
    partType: z.enum(['structural', 'cosmetic', 'mechanical']),
    action: z.enum(['repair', 'replace']),
    laborHours: z.number(),
    partsCost: z.number(),
    laborCost: z.number(),
    totalCost: z.number(),
  })),
  damageIndicators: z.object({
    structuralDamage: z.boolean(),
    frameDamage: z.boolean(),
    framePullingRequired: z.boolean(),
    airbagDeployment: z.boolean(),
    alignmentRequired: z.boolean(),
  }),
  repairFacility: z.object({
    name: z.string().nullable(),
    address: z.string().nullable(),
  }),
  confidence: z.number(),
})

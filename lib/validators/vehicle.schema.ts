import { z } from 'zod'

export const vehicleOwnerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2).optional(),
    zipCode: z.string().optional(),
  }).optional(),
})

export const subjectVehicleSchema = z.object({
  vin: z.string().length(17, 'VIN must be exactly 17 characters'),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  trim: z.string().optional(),
  mileageAtAccident: z.number().int().min(0, 'Mileage must be positive'),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  preAccidentCondition: z.number().int().min(1).max(5),
  optionalEquipment: z.array(z.string()).default([]),
  priorAccidents: z.boolean().default(false),
})

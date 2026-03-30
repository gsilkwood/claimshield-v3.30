import { CALC_CONSTANTS, CONDITION_MULTIPLIERS } from '@/lib/constants'

export interface SubjectVehicle {
  year: number
  make: string
  model: string
  mileageAtAccident: number
  preAccidentCondition: 1 | 2 | 3 | 4 | 5
  optionalEquipment: Array<{ name: string; msrp: number }>
}

export interface ComparableVehicle {
  year: number
  mileage: number
  listingPrice: number
  optionalEquipment: Array<{ name: string; msrp: number }>
}

export interface AdjustmentBreakdown {
  listingPrice: number
  mileageAdjustment: number
  equipmentAdjustment: number
  yearAdjustment: number
  conditionMultiplier: number
  subtotalBeforeCondition: number
  adjustedValue: number
}

export function calculateComparableAdjustments(
  subject: SubjectVehicle,
  comp: ComparableVehicle
): AdjustmentBreakdown {
  // 1. MILEAGE ADJUSTMENT: $0.12 per mile delta
  // Formula: (comp_mileage - subject_mileage) × $0.12
  // Positive if comp has MORE miles (comp worth less -> needs upward adj to match lower-mile subject)
  const mileageDelta = comp.mileage - subject.mileageAtAccident
  const mileageAdj = mileageDelta * CALC_CONSTANTS.MILEAGE_ADJUSTMENT_PER_MILE

  // 2. EQUIPMENT ADJUSTMENT: 80% of factory MSRP per item
  // Subject has item, comp lacks it -> add to comp (comp is missing that value)
  // Comp has item, subject lacks it -> subtract from comp (comp has extra value)
  let equipmentAdj = 0
  
  // Items subject has but comp lacks
  subject.optionalEquipment.forEach(sItem => {
    if (!comp.optionalEquipment.find(cItem => cItem.name === sItem.name)) {
      equipmentAdj += sItem.msrp * CALC_CONSTANTS.EQUIPMENT_ADJUSTMENT_PERCENT
    }
  })
  
  // Items comp has but subject lacks
  comp.optionalEquipment.forEach(cItem => {
    if (!subject.optionalEquipment.find(sItem => sItem.name === cItem.name)) {
      equipmentAdj -= cItem.msrp * CALC_CONSTANTS.EQUIPMENT_ADJUSTMENT_PERCENT
    }
  })

  // 3. YEAR ADJUSTMENT: 7% per year × comp listing price
  // Formula: (subject_year - comp_year) × 0.07 × comp.listingPrice
  const yearDelta = subject.year - comp.year
  const yearAdj = yearDelta * CALC_CONSTANTS.DEPRECIATION_RATE_PER_YEAR * comp.listingPrice

  // 4. CONDITION MULTIPLIER: applied LAST to the full post-adjustment subtotal
  const conditionMultiplier = CONDITION_MULTIPLIERS[subject.preAccidentCondition]

  // SUBTOTAL (before condition multiplier)
  const subtotal = comp.listingPrice + mileageAdj + equipmentAdj + yearAdj

  // FINAL ADJUSTED VALUE (clamped to 0)
  const adjustedValue = Math.max(0, Math.round(subtotal * conditionMultiplier * 100) / 100)

  return {
    listingPrice: comp.listingPrice,
    mileageAdjustment: Math.round(mileageAdj * 100) / 100,
    equipmentAdjustment: Math.round(equipmentAdj * 100) / 100,
    yearAdjustment: Math.round(yearAdj * 100) / 100,
    conditionMultiplier,
    subtotalBeforeCondition: Math.round(subtotal * 100) / 100,
    adjustedValue,
  }
}

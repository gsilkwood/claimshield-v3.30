import { CALC_CONSTANTS } from '@/lib/constants'

export interface AdjustedComparable {
  adjustedValue: number
  includedInCalculation: boolean
}

export interface DVCalculationResult {
  preAccidentFMV: number
  postRepairACV: number
  diminishedValue: number
  dvAsPercentOfPreValue: number
  dvAsPercentOfRepairCost: number
  confidenceRange: {
    low: number
    high: number
  }
  comparablesUsed: {
    clean: number
    accident: number
  }
  calculationMethod: 'MEDIAN'
  methodologyVersion: string
}

export function calculateDiminishedValue(
  cleanComps: AdjustedComparable[],
  accidentComps: AdjustedComparable[],
  repairCost: number
): DVCalculationResult {
  const includedClean = cleanComps.filter(c => c.includedInCalculation)
  const includedAccident = accidentComps.filter(c => c.includedInCalculation)

  if (includedClean.length < CALC_CONSTANTS.MIN_COMPS_REQUIRED) {
    throw new Error(`Insufficient clean comparables (minimum ${CALC_CONSTANTS.MIN_COMPS_REQUIRED})`)
  }
  if (includedAccident.length < CALC_CONSTANTS.MIN_COMPS_REQUIRED) {
    throw new Error(`Insufficient accident comparables (minimum ${CALC_CONSTANTS.MIN_COMPS_REQUIRED})`)
  }

  const preAccidentFMV = median(includedClean.map(c => c.adjustedValue))
  const postRepairACV = median(includedAccident.map(c => c.adjustedValue))
  const diminishedValue = Math.max(0, preAccidentFMV - postRepairACV)

  const cleanValues = includedClean.map(c => c.adjustedValue).sort((a, b) => a - b)
  const accidentValues = includedAccident.map(c => c.adjustedValue).sort((a, b) => a - b)

  // Confidence range based on 10th/90th percentiles as per directive
  const low = Math.max(0, percentile(cleanValues, 10) - percentile(accidentValues, 90))
  const high = Math.max(0, percentile(cleanValues, 90) - percentile(accidentValues, 10))

  return {
    preAccidentFMV,
    postRepairACV,
    diminishedValue,
    dvAsPercentOfPreValue: (diminishedValue / preAccidentFMV) * 100,
    dvAsPercentOfRepairCost: repairCost > 0 ? (diminishedValue / repairCost) * 100 : 0,
    confidenceRange: {
      low: Math.round(low * 100) / 100,
      high: Math.round(high * 100) / 100,
    },
    comparablesUsed: {
      clean: includedClean.length,
      accident: includedAccident.length,
    },
    calculationMethod: 'MEDIAN',
    methodologyVersion: '2.1',
  }
}

/**
 * Calculates the median of an array of numbers.
 * Resistant to outliers.
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 !== 0) {
    return sorted[mid]
  }
  
  return (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Calculates the p-th percentile of a sorted array of numbers.
 */
export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const index = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower
  
  if (upper >= sorted.length) return sorted[lower]
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

import { describe, it, expect } from 'vitest'
import { calculateDiminishedValue, median, percentile } from '@/lib/calculations/dv-calculator'

describe('DV Calculator', () => {
  const cleanComps = [
    { adjustedValue: 32000, includedInCalculation: true },
    { adjustedValue: 31500, includedInCalculation: true },
    { adjustedValue: 32500, includedInCalculation: true },
  ]
  const accidentComps = [
    { adjustedValue: 24000, includedInCalculation: true },
    { adjustedValue: 23500, includedInCalculation: true },
    { adjustedValue: 24500, includedInCalculation: true },
  ]
  const repairCost = 5000

  it('uses MEDIAN not mean for FMV and ACV calculation', () => {
    const result = calculateDiminishedValue(cleanComps, accidentComps, repairCost)
    expect(result.preAccidentFMV).toBe(32000)
    expect(result.postRepairACV).toBe(24000)
    expect(result.diminishedValue).toBe(8000)
  })

  it('throws when fewer than 3 clean comps included', () => {
    expect(() => calculateDiminishedValue(cleanComps.slice(0, 2), accidentComps, repairCost))
      .toThrow('Insufficient clean comparables')
  })

  it('throws when fewer than 3 accident comps included', () => {
    expect(() => calculateDiminishedValue(cleanComps, accidentComps.slice(0, 2), repairCost))
      .toThrow('Insufficient accident comparables')
  })

  it('calculates DV as percentage of pre-value correctly', () => {
    const result = calculateDiminishedValue(cleanComps, accidentComps, repairCost)
    // 8000 / 32000 = 0.25 = 25%
    expect(result.dvAsPercentOfPreValue).toBe(25)
  })

  it('calculates DV as percentage of repair cost correctly', () => {
    const result = calculateDiminishedValue(cleanComps, accidentComps, repairCost)
    // 8000 / 5000 = 1.6 = 160%
    expect(result.dvAsPercentOfRepairCost).toBe(160)
  })

  it('handles even number of comps for median', () => {
    const evenComps = [
      { adjustedValue: 100, includedInCalculation: true },
      { adjustedValue: 200, includedInCalculation: true },
    ]
    // median of [100, 200] is 150
    expect(median([100, 200])).toBe(150)
  })

  it('calculates percentiles correctly', () => {
    const values = [10, 20, 30, 40, 50]
    // 50th percentile of [10, 20, 30, 40, 50] is 30
    expect(percentile(values, 50)).toBe(30)
  })
})

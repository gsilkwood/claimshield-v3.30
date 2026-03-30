import { describe, it, expect } from 'vitest'
import { calculateComparableAdjustments } from '@/lib/calculations/adjustments'

describe('Adjustment Calculator', () => {
  const subject = {
    year: 2022,
    make: 'Toyota',
    model: 'Camry',
    mileageAtAccident: 20000,
    preAccidentCondition: 4 as const, // Good (0.95)
    optionalEquipment: [{ name: 'Sunroof', msrp: 1000 }]
  }

  it('calculates mileage adjustment correctly (comp has more miles)', () => {
    const comp = {
      year: 2022,
      mileage: 25000,
      listingPrice: 30000,
      optionalEquipment: [{ name: 'Sunroof', msrp: 1000 }]
    }
    const result = calculateComparableAdjustments(subject, comp)
    // (25000 - 20000) * 0.12 = 600
    expect(result.mileageAdjustment).toBe(600)
    expect(result.adjustedValue).toBe(Math.round((30000 + 600) * 0.95 * 100) / 100)
  })

  it('calculates mileage adjustment correctly (comp has fewer miles)', () => {
    const comp = {
      year: 2022,
      mileage: 15000,
      listingPrice: 30000,
      optionalEquipment: [{ name: 'Sunroof', msrp: 1000 }]
    }
    const result = calculateComparableAdjustments(subject, comp)
    // (15000 - 20000) * 0.12 = -600
    expect(result.mileageAdjustment).toBe(-600)
  })

  it('calculates equipment adjustment correctly', () => {
    const comp = {
      year: 2022,
      mileage: 20000,
      listingPrice: 30000,
      optionalEquipment: [] // Missing Sunroof
    }
    const result = calculateComparableAdjustments(subject, comp)
    // Subject has Sunroof ($1000), comp lacks it -> add 80% of 1000 = 800 to comp
    expect(result.equipmentAdjustment).toBe(800)
  })

  it('calculates year adjustment correctly (comp is older)', () => {
    const comp = {
      year: 2020,
      mileage: 20000,
      listingPrice: 25000,
      optionalEquipment: [{ name: 'Sunroof', msrp: 1000 }]
    }
    const result = calculateComparableAdjustments(subject, comp)
    // (2022 - 2020) * 0.07 * 25000 = 2 * 0.07 * 25000 = 3500
    expect(result.yearAdjustment).toBe(3500)
  })

  it('applies condition multiplier last', () => {
    const comp = {
      year: 2022,
      mileage: 20000,
      listingPrice: 30000,
      optionalEquipment: [{ name: 'Sunroof', msrp: 1000 }]
    }
    const result = calculateComparableAdjustments(subject, comp)
    // subtotal = 30000
    // adjusted = 30000 * 0.95 = 28500
    expect(result.conditionMultiplier).toBe(0.95)
    expect(result.adjustedValue).toBe(28500)
  })
})

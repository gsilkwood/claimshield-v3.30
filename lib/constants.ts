// lib/constants.ts

export const PRICING = {
  INDIVIDUAL_REPORT:        129_00,   // $129.00 — pay-per-report
  SUBSCRIPTION_INDIVIDUAL:   29_00,   // $29/month  — 3 reports/month
  SUBSCRIPTION_PROFESSIONAL: 79_00,   // $79/month  — 10 reports/month
  SUBSCRIPTION_ATTORNEY:    149_00,   // $149/month — 25 reports/month
  SUBSCRIPTION_BODY_SHOP:   199_00,   // $199/month — unlimited reports
} as const

export const CALC_CONSTANTS = {
  MILEAGE_ADJUSTMENT_PER_MILE:    0.12,   // $0.12 per mile delta
  EQUIPMENT_ADJUSTMENT_PERCENT:   0.80,   // 80% of factory MSRP
  DEPRECIATION_RATE_PER_YEAR:     0.07,   // 7% per year
  COMPARABLE_RADIUS_MILES:         100,   // Default search radius
  COMPARABLE_MILEAGE_WINDOW:    10_000,   // ±10,000 miles
  MIN_COMPS_REQUIRED:                3,   // Minimum per category
  TARGET_COMPS:                      5,   // Target per category
  COMP_CACHE_TTL_HOURS:             24,   // Cache comparable searches
  VALUATION_METHOD: 'MEDIAN' as const,    // NEVER use mean
} as const

export const CONDITION_MULTIPLIERS: Record<1|2|3|4|5, number> = {
  5: 1.00,   // Excellent
  4: 0.95,   // Good
  3: 0.85,   // Average
  2: 0.70,   // Below Average
  1: 0.50,   // Rough
} as const

export const SEVERITY_THRESHOLDS = {
  LEVEL_1: { maxLaborHours: 8,  hasStructural: false, hasAirbag: false },
  LEVEL_2: { maxLaborHours: 20, hasStructural: false, hasAirbag: false },
  LEVEL_3: { maxLaborHours: 40, hasStructural: true,  hasAirbag: false },
  LEVEL_4: { maxLaborHours: 60, hasStructural: true,  hasAirbag: false },
  LEVEL_5: { minLaborHours: 60, hasStructural: true,  hasAirbag: true  },
} as const

export const GA_LEGAL_CITATIONS = {
  FIRST_PARTY_STATUTE:    'O.C.G.A. § 33-4-6',
  THIRD_PARTY_STATUTE:    'O.C.G.A. § 33-4-7',
  LANDMARK_FIRST_PARTY:  'State Farm Mut. Auto Ins. Co. v. Mabry, 274 Ga. 498 (2001)',
  LANDMARK_THIRD_PARTY:  'Myers v. Thornton, 480 S.E.2d 334 (1997)',
  METHOD_CITATION:        'Canal Insurance Co. v. Tullis, 237 Ga. App. 515, 516-17 (1999)',
  DOI_DIRECTIVE:          'Georgia DOI Directive (December 2008)',
  BAD_FAITH_PENALTY:      'Up to 50% of liability or $5,000 plus attorney fees',
  DISCREDITED_NOTE:       '17c formula NOT endorsed by Georgia DOI — use comparable sales method',
} as const

export const MODELS = {
  FAST: 'gemini-2.5-flash',
  PRO:  'gemini-2.5-pro',
} as const

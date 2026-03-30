import { db } from '@/lib/db'
import { comparableVehicles } from '@/lib/db/schema'
import { eq, and, gte, sql } from 'drizzle-orm'
import { apifyClient } from './apify-client'
import { CALC_CONSTANTS } from '@/lib/constants'

export interface ComparableSearchParams {
  make: string
  model: string
  year: number
  trim?: string
  mileage: number
  state: string
  accidentHistoryRequired: boolean
}

export async function searchComparableVehicles(params: ComparableSearchParams, appraisalId: string) {
  // 1. Check cache (24 hours)
  const cacheThreshold = new Date(Date.now() - CALC_CONSTANTS.COMP_CACHE_TTL_HOURS * 60 * 60 * 1000)
  
  // For simplicity in this environment, we'll look for comps matching make/model/year in the same state
  // that were added to ANY appraisal recently. 
  // In a more robust system, we'd have a dedicated `cached_listings` table.
  const cached = await db.query.comparableVehicles.findMany({
    where: (comps, { and, eq, gte }) => and(
      eq(comps.make, params.make),
      eq(comps.model, params.model),
      eq(comps.year, params.year),
      eq(comps.locationState, params.state),
      eq(comps.accidentHistory, params.accidentHistoryRequired ? 'accident_reported' : 'no_accidents'),
      gte(comps.createdAt, cacheThreshold)
    ),
    limit: 10
  })

  if (cached.length >= CALC_CONSTANTS.MIN_COMPS_REQUIRED) {
    // Clone cached results for this specific appraisal
    const newComps = cached.map(c => ({
      ...c,
      id: undefined, // Let DB generate new ID
      appraisalId,
      source: 'auto_search' as const,
      createdAt: new Date()
    }))
    
    await db.insert(comparableVehicles).values(newComps as any)
    return cached
  }

  // 2. If not enough in cache, call Apify
  // NOTE: In this environment, we'll mock the Apify response to avoid actual API costs/keys
  // but the structure remains the same.
  const results = await callApifyScraper(params)
  
  // 3. Normalize and Save to DB
  const normalized = results.map(res => ({
    appraisalId,
    compType: params.accidentHistoryRequired ? 'post_accident' : 'pre_accident' as any,
    source: 'auto_search' as const,
    vin: res.vin,
    year: res.year,
    make: res.make,
    model: res.model,
    trim: res.trim,
    mileage: res.mileage,
    accidentHistory: params.accidentHistoryRequired ? 'accident_reported' : 'no_accidents' as any,
    listingUrl: res.url,
    listingPrice: res.price.toString(),
    dealerName: res.dealer,
    locationCity: res.city,
    locationState: res.state,
    distanceMiles: res.distance,
    includedInCalculation: true,
  }))

  if (normalized.length > 0) {
    await db.insert(comparableVehicles).values(normalized)
  }

  return normalized
}

async function callApifyScraper(params: ComparableSearchParams) {
  // This is where the actual Apify actor call would go.
  // For now, we return mock data that satisfies the min requirements.
  
  const mockResults = []
  const count = 5
  const basePrice = params.year * 15 // Very rough mock price logic
  
  for (let i = 0; i < count; i++) {
    mockResults.push({
      vin: `MOCKVIN${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      year: params.year,
      make: params.make,
      model: params.model,
      trim: params.trim || 'Base',
      mileage: params.mileage + (Math.random() * 10000 - 5000),
      price: basePrice + (Math.random() * 2000 - 1000) - (params.accidentHistoryRequired ? 5000 : 0),
      url: `https://cars.com/mock-listing-${i}`,
      dealer: `Mock Dealer ${i}`,
      city: 'Atlanta',
      state: params.state,
      distance: Math.floor(Math.random() * 50)
    })
  }
  
  return mockResults
}

import {
  pgTable, uuid, text, varchar, integer, decimal, boolean,
  timestamp, date, jsonb, pgEnum
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'

export const appraisalStatusEnum = pgEnum('appraisal_status',
  ['draft', 'complete', 'sent', 'settled', 'denied'])
export const compTypeEnum = pgEnum('comp_type', ['pre_accident', 'post_accident'])
export const compSourceEnum = pgEnum('comp_source', ['auto_search', 'manual_entry'])
export const accidentHistoryEnum = pgEnum('accident_history',
  ['no_accidents', 'accident_reported'])
export const partnerTypeEnum = pgEnum('partner_type', ['body_shop', 'attorney', 'appraiser'])
export const claimStatusEnum = pgEnum('claim_status',
  ['submitted', 'under_review', 'negotiating', 'settled', 'denied'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  smsOptIn: boolean('sms_opt_in').default(false),
  address: jsonb('address'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free'),
  subscriptionId: varchar('subscription_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const partners = pgTable('partners', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  type: partnerTypeEnum('type').notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  referralCode: varchar('referral_code', { length: 50 }).unique(),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 4 }).default('0.20'),
  totalReferrals: integer('total_referrals').default(0),
  totalEarningsUsd: decimal('total_earnings_usd', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const appraisals = pgTable('appraisals', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: appraisalStatusEnum('status').default('draft').notNull(),
  claimNumber: varchar('claim_number', { length: 100 }),
  accidentDate: date('accident_date'),
  ownerInfo: jsonb('owner_info'),
  insuranceInfo: jsonb('insurance_info'),
  subjectVehicle: jsonb('subject_vehicle'),
  accidentDetails: jsonb('accident_details'),
  extractedRepairData: jsonb('extracted_repair_data'),
  valuationResults: jsonb('valuation_results'),
  severityAnalysis: jsonb('severity_analysis'),
  marketStigmaAnalysis: jsonb('market_stigma_analysis'),
  appraiserInfo: jsonb('appraiser_info'),
  repairEstimateUrl: text('repair_estimate_url'),
  insuranceCardUrl: text('insurance_card_url'),
  registrationUrl: text('registration_url'),
  damagePhotos: jsonb('damage_photos').$type<string[]>().default([]),
  repairPhotos: jsonb('repair_photos').$type<string[]>().default([]),
  reportPdfUrl: text('report_pdf_url'),
  demandLetterUrl: text('demand_letter_url'),
  reportGeneratedAt: timestamp('report_generated_at'),
  paymentIntentId: varchar('payment_intent_id', { length: 255 }),
  isPaid: boolean('is_paid').default(false).notNull(),
  partnerId: uuid('partner_id').references(() => partners.id),
  referralCode: varchar('referral_code', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const comparableVehicles = pgTable('comparable_vehicles', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  appraisalId: uuid('appraisal_id').references(() => appraisals.id,
    { onDelete: 'cascade' }).notNull(),
  compType: compTypeEnum('comp_type').notNull(),
  source: compSourceEnum('source').default('auto_search').notNull(),
  vin: varchar('vin', { length: 17 }),
  year: integer('year').notNull(),
  make: varchar('make', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  trim: varchar('trim', { length: 100 }),
  mileage: integer('mileage').notNull(),
  accidentHistory: accidentHistoryEnum('accident_history').notNull(),
  listingUrl: text('listing_url'),
  listingPrice: decimal('listing_price', { precision: 10, scale: 2 }).notNull(),
  dealerName: varchar('dealer_name', { length: 255 }),
  locationCity: varchar('location_city', { length: 100 }),
  locationState: varchar('location_state', { length: 2 }),
  distanceMiles: integer('distance_miles'),
  adjustments: jsonb('adjustments'),
  adjustedValue: decimal('adjusted_value', { precision: 10, scale: 2 }),
  includedInCalculation: boolean('included_in_calculation').default(true).notNull(),
  listingDate: date('listing_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const settlements = pgTable('settlements', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  appraisalId: uuid('appraisal_id').references(() => appraisals.id).notNull(),
  settlementAmountUsd: decimal('settlement_amount_usd', { precision: 10, scale: 2 }),
  settlementDate: date('settlement_date'),
  claimStatus: claimStatusEnum('claim_status').notNull(),
  insuranceCompany: varchar('insurance_company', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  appraisalId: uuid('appraisal_id').references(() => appraisals.id, { onDelete: 'set null' }),
  type: varchar('type', { length: 50 }).notNull(), // 'email' | 'sms'
  event: varchar('event', { length: 50 }).notNull(), // 'report_ready' | 'welcome' | etc.
  recipient: varchar('recipient', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending' | 'sent' | 'failed'
  providerMessageId: varchar('provider_message_id', { length: 255 }),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// --- RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
  appraisals: many(appraisals),
  notifications: many(notifications),
}))

export const partnersRelations = relations(partners, ({ many }) => ({
  appraisals: many(appraisals),
}))

export const appraisalsRelations = relations(appraisals, ({ one, many }) => ({
  user: one(users, {
    fields: [appraisals.userId],
    references: [users.id],
  }),
  partner: one(partners, {
    fields: [appraisals.partnerId],
    references: [partners.id],
  }),
  comparableVehicles: many(comparableVehicles),
  settlements: many(settlements),
  notifications: many(notifications),
}))

export const comparableVehiclesRelations = relations(comparableVehicles, ({ one }) => ({
  appraisal: one(appraisals, {
    fields: [comparableVehicles.appraisalId],
    references: [appraisals.id],
  }),
}))

export const settlementsRelations = relations(settlements, ({ one }) => ({
  appraisal: one(appraisals, {
    fields: [settlements.appraisalId],
    references: [appraisals.id],
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  appraisal: one(appraisals, {
    fields: [notifications.appraisalId],
    references: [appraisals.id],
  }),
}))

# ClaimShield DV - Master Task List (Resumption)

This file tracks the status of all project requirements and identifies next steps.

## Status Legend
- ⬜ **Not Started**
- 🏗️ **In Progress / Stubbed**
- ✅ **Completed**

---

## 1. Project Infrastructure
- ✅ Next.js 15+ App Router Setup
- ✅ Clerk Authentication & User Management
- ✅ Neon PostgreSQL & Drizzle ORM (UUIDv7)
- ✅ Tailwind CSS 4+ Implementation
- ✅ Basic Routing & Layout Structure

## 2. Appraisal Wizard (The Guided Process)
- ✅ **Step 1: Document Upload (AI Extraction)**
- 🏗️ **Step 2: Vehicle Details** (Form is a stub)
- 🏗️ **Step 3: Accident Details** (Form is a stub)
- ✅ **Step 4: Pre-Accident Comparables** (Integrated with scraper)
- ✅ **Step 5: Post-Accident Comparables** (Integrated with scraper)
- ✅ **Step 6: Review & Calculate** (Logic complete)
- 🏗️ **Step 7: Appraiser Info** (Form is a stub)
- 🏗️ **Step 8: Generate Report** (Assembly is partial)

## 3. Core Engine & Logic
- ✅ **DV Calculation Engine**: Median Comparable Sales method.
- ✅ **AI Extraction**: Gemini-powered repair estimate parser.
- ✅ **Scraping**: Apify integration (Logical implementation complete, currently mocked for safety).
- ⬜ **VIN Decoder**: Missing service to hydrate vehicle data from VIN.
- ✅ **Notification System**: Resend (Email) + Twilio (SMS) with logging.

## 4. Reports & Deliverables
- ✅ **Demand Letter**: Contextual tone (Partner/Individual) + GA legal citations.
- 🏗️ **Full Appraisal Report**: 15-25 page PDF (Basic shell exists, needs expansion for TOC, Summary, Methodology, USPAP).
- ✅ **Charts**: Valuation visualization integrated into PDF.

## 5. Payments & Business Logic
- ⬜ **Stripe Integration**: Pay-per-report checkout and webhooks.
- ⬜ **Partner Portal**: Dashboard for referral tracking and commissions.
- ⬜ **Settings & Profiles**: User profile management.

---

## Next Immediate Steps (Priority Order)

1. **Implement VIN Decoder**: Build `/lib/vin` to allow users to fetch vehicle details immediately.
2. **Flash Out Wizard Forms**: Replace stubs in Step 2, 3, and 7 with functional React Hook Forms.
3. **Stripe Checkout**: Enable the paid hurdle (Task 6) so reports can be locked behind a payment.
4. **Appraisal Report Expansion**: Extend the PDF generator to include the 15+ page requirement for USPAP compliance.
5. **Partner Portal Alpha**: Create the referral dashboard for body shops and attorneys.

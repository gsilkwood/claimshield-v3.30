CREATE TYPE "public"."accident_history" AS ENUM('no_accidents', 'accident_reported');--> statement-breakpoint
CREATE TYPE "public"."appraisal_status" AS ENUM('draft', 'complete', 'sent', 'settled', 'denied');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('submitted', 'under_review', 'negotiating', 'settled', 'denied');--> statement-breakpoint
CREATE TYPE "public"."comp_source" AS ENUM('auto_search', 'manual_entry');--> statement-breakpoint
CREATE TYPE "public"."comp_type" AS ENUM('pre_accident', 'post_accident');--> statement-breakpoint
CREATE TYPE "public"."partner_type" AS ENUM('body_shop', 'attorney', 'appraiser');--> statement-breakpoint
CREATE TABLE "appraisals" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "appraisal_status" DEFAULT 'draft' NOT NULL,
	"claim_number" varchar(100),
	"accident_date" date,
	"owner_info" jsonb,
	"insurance_info" jsonb,
	"subject_vehicle" jsonb,
	"accident_details" jsonb,
	"extracted_repair_data" jsonb,
	"valuation_results" jsonb,
	"severity_analysis" jsonb,
	"market_stigma_analysis" jsonb,
	"appraiser_info" jsonb,
	"repair_estimate_url" text,
	"insurance_card_url" text,
	"registration_url" text,
	"damage_photos" jsonb DEFAULT '[]'::jsonb,
	"repair_photos" jsonb DEFAULT '[]'::jsonb,
	"report_pdf_url" text,
	"demand_letter_url" text,
	"report_generated_at" timestamp,
	"payment_intent_id" varchar(255),
	"is_paid" boolean DEFAULT false NOT NULL,
	"partner_id" uuid,
	"referral_code" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comparable_vehicles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"appraisal_id" uuid NOT NULL,
	"comp_type" "comp_type" NOT NULL,
	"source" "comp_source" DEFAULT 'auto_search' NOT NULL,
	"vin" varchar(17),
	"year" integer NOT NULL,
	"make" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"trim" varchar(100),
	"mileage" integer NOT NULL,
	"accident_history" "accident_history" NOT NULL,
	"listing_url" text,
	"listing_price" numeric(10, 2) NOT NULL,
	"dealer_name" varchar(255),
	"location_city" varchar(100),
	"location_state" varchar(2),
	"distance_miles" integer,
	"adjustments" jsonb,
	"adjusted_value" numeric(10, 2),
	"included_in_calculation" boolean DEFAULT true NOT NULL,
	"listing_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "partner_type" NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"referral_code" varchar(50),
	"commission_rate" numeric(5, 4) DEFAULT '0.20',
	"total_referrals" integer DEFAULT 0,
	"total_earnings_usd" numeric(10, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partners_email_unique" UNIQUE("email"),
	CONSTRAINT "partners_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "settlements" (
	"id" uuid PRIMARY KEY NOT NULL,
	"appraisal_id" uuid NOT NULL,
	"settlement_amount_usd" numeric(10, 2),
	"settlement_date" date,
	"claim_status" "claim_status" NOT NULL,
	"insurance_company" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"phone" varchar(50),
	"sms_opt_in" boolean DEFAULT false,
	"address" jsonb,
	"stripe_customer_id" varchar(255),
	"subscription_tier" varchar(50) DEFAULT 'free',
	"subscription_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appraisals" ADD CONSTRAINT "appraisals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appraisals" ADD CONSTRAINT "appraisals_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparable_vehicles" ADD CONSTRAINT "comparable_vehicles_appraisal_id_appraisals_id_fk" FOREIGN KEY ("appraisal_id") REFERENCES "public"."appraisals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_appraisal_id_appraisals_id_fk" FOREIGN KEY ("appraisal_id") REFERENCES "public"."appraisals"("id") ON DELETE no action ON UPDATE no action;
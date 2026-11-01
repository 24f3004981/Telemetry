# 05 — Database Schema & Drizzle ORM Definitions

## 1. Schema Overview
Persistent backing store is **Tiger Data PostgreSQL** (PostgreSQL 16+ compatible).
Primary tables:
1. `users`: Sales reps, SEs, enterprise champions.
2. `workspaces`: Tenant/team boundary.
3. `deal_rooms`: Deal workspace container, lifecycle stage, status.
4. `company_profiles`: Extracted structured client attributes.
5. `assumptions`: Key financial levers & provenance tags for each run.
6. `generated_cases`: Deterministic calculation snapshots (versioned).
7. `memo_versions`: Narrative executive approval memos generated per case.
8. `briefing_scripts`: 60-second scripts and generated ElevenLabs audio links.
9. `audit_events`: Tamper-evident ledger of edits and regenerations.

## 2. PostgreSQL DDL
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'sales_rep',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE deal_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  current_stage TEXT NOT NULL DEFAULT 'intake',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  region TEXT NOT NULL,
  data_residency_requirement TEXT NOT NULL,
  data_volume_tb NUMERIC NOT NULL,
  current_platform TEXT NOT NULL,
  current_annual_spend_usd NUMERIC,
  preferred_deployment TEXT NOT NULL,
  primary_workloads TEXT[] NOT NULL DEFAULT '{}',
  compliance_needs TEXT[] NOT NULL DEFAULT '{}',
  data_user_count INTEGER,
  compute_intensity TEXT NOT NULL DEFAULT 'medium',
  raw_transcript TEXT,
  extraction_confidence NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assumptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE generated_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  recommended_deployment TEXT NOT NULL,
  sovereignty_score INTEGER NOT NULL,
  sovereignty_rationale TEXT NOT NULL,
  year_one_cost NUMERIC NOT NULL,
  year_two_cost NUMERIC NOT NULL,
  year_three_cost NUMERIC NOT NULL,
  three_year_total_cost NUMERIC NOT NULL,
  estimated_current_three_year_cost NUMERIC,
  projected_savings NUMERIC,
  payback_months NUMERIC,
  confidence_level TEXT NOT NULL,
  model_output JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE memo_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_case_id UUID NOT NULL REFERENCES generated_cases(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  executive_summary TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  financial_summary TEXT NOT NULL,
  sovereignty_position TEXT NOT NULL,
  risks_and_unknowns JSONB NOT NULL DEFAULT '[]',
  next_steps JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE briefing_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_case_id UUID NOT NULL REFERENCES generated_cases(id) ON DELETE CASCADE,
  script_text TEXT NOT NULL,
  estimated_duration_seconds INTEGER NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_room_id UUID REFERENCES deal_rooms(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES users(id),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deal_rooms_workspace ON deal_rooms(workspace_id);
CREATE INDEX idx_company_profiles_deal_room ON company_profiles(deal_room_id);
CREATE INDEX idx_generated_cases_deal_room ON generated_cases(deal_room_id);
CREATE INDEX idx_memo_versions_case ON memo_versions(generated_case_id);
CREATE INDEX idx_briefing_scripts_case ON briefing_scripts(generated_case_id);
```

## 3. Drizzle ORM Schema Snippet (`src/lib/db/schema.ts`)
```typescript
import { pgTable, uuid, text, numeric, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const dealRooms = pgTable("deal_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  currentStage: text("current_stage").notNull().default("intake"),
  createdBy: uuid("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const companyProfiles = pgTable("company_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealRoomId: uuid("deal_room_id").references(() => dealRooms.id, { onDelete: "cascade" }).notNull(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  region: text("region").notNull(),
  dataResidencyRequirement: text("data_residency_requirement").notNull(),
  dataVolumeTb: numeric("data_volume_tb").notNull(),
  currentPlatform: text("current_platform").notNull(),
  currentAnnualSpendUsd: numeric("current_annual_spend_usd"),
  preferredDeployment: text("preferred_deployment").notNull(),
  primaryWorkloads: text("primary_workloads").array().notNull(),
  complianceNeeds: text("compliance_needs").array().notNull(),
  dataUserCount: integer("data_user_count"),
  computeIntensity: text("compute_intensity").notNull().default("medium"),
  rawTranscript: text("raw_transcript"),
  extractionConfidence: numeric("extraction_confidence").notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

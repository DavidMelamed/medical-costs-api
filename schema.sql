-- Medical Cost Database Schema for Cloudflare D1 (SQLite)
-- Based on CMS Medicare PFS, CDC WISQARS, and NHTSA data

DROP TABLE IF EXISTS injury_procedure_mappings;
DROP TABLE IF EXISTS injury_crash_severity_map;
DROP TABLE IF EXISTS medical_cost_geographic;
DROP TABLE IF EXISTS injury_cost_aggregates;
DROP TABLE IF EXISTS injury_categories;
DROP TABLE IF EXISTS medical_procedures;

-- ============================================================================
-- Medical Procedures (CPT/HCPCS codes with Medicare rates)
-- ============================================================================
CREATE TABLE medical_procedures (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  code TEXT NOT NULL,
  code_type TEXT NOT NULL DEFAULT 'CPT' CHECK (code_type IN ('CPT', 'HCPCS', 'ICD10_PCS', 'DRG')),
  description TEXT NOT NULL,
  category TEXT,
  body_system TEXT,

  -- RVUs (Relative Value Units)
  work_rvu REAL,
  facility_pe_rvu REAL,
  non_fac_pe_rvu REAL,
  malpractice_rvu REAL,
  total_rvu REAL,

  -- National payment amounts
  national_facility_rate REAL,
  national_non_fac_rate REAL,
  conversion_factor REAL,

  -- Outpatient/ASC
  hospital_outpatient_cost REAL,
  hospital_outpatient_copay REAL,
  asc_cost REAL,
  asc_copay REAL,

  effective_year INTEGER NOT NULL DEFAULT 2026,
  source_dataset TEXT NOT NULL DEFAULT 'SEED',
  last_updated TEXT NOT NULL DEFAULT (datetime('now')),

  UNIQUE(code, code_type, effective_year)
);

CREATE INDEX idx_proc_code ON medical_procedures(code);
CREATE INDEX idx_proc_category ON medical_procedures(category);
CREATE INDEX idx_proc_body_system ON medical_procedures(body_system);

-- ============================================================================
-- Geographic Cost Adjustments (GPCI-based)
-- ============================================================================
CREATE TABLE medical_cost_geographic (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  procedure_id TEXT NOT NULL REFERENCES medical_procedures(id) ON DELETE CASCADE,

  state_code TEXT NOT NULL,
  locality TEXT,
  mac_number TEXT,
  county_fips TEXT,
  msa TEXT,

  work_gpci REAL,
  pe_gpci REAL,
  malpractice_gpci REAL,

  facility_rate REAL,
  non_facility_rate REAL,

  commercial_multiplier REAL DEFAULT 1.5,
  estimated_commercial_low REAL,
  estimated_commercial_high REAL,
  workers_comp_rate REAL,

  effective_year INTEGER NOT NULL DEFAULT 2026,

  UNIQUE(procedure_id, state_code, locality, effective_year)
);

CREATE INDEX idx_geo_state ON medical_cost_geographic(state_code);
CREATE INDEX idx_geo_proc ON medical_cost_geographic(procedure_id);

-- ============================================================================
-- Injury Categories
-- ============================================================================
CREATE TABLE injury_categories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  body_region TEXT,

  icd10_code_start TEXT,
  icd10_code_end TEXT,
  icd10_codes TEXT, -- JSON array

  crash_relevance TEXT NOT NULL DEFAULT 'GENERAL'
    CHECK (crash_relevance IN ('MOTOR_VEHICLE', 'TOXIC_EXPOSURE', 'WORKPLACE', 'GENERAL', 'PEDESTRIAN', 'BICYCLE')),
  common_causes TEXT, -- JSON array

  mild_cost_low REAL,
  mild_cost_high REAL,
  moderate_cost_low REAL,
  moderate_cost_high REAL,
  severe_cost_low REAL,
  severe_cost_high REAL,
  lifetime_cost_low REAL,
  lifetime_cost_high REAL,

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_injury_relevance ON injury_categories(crash_relevance);
CREATE INDEX idx_injury_body_region ON injury_categories(body_region);

-- ============================================================================
-- Injury → Procedure Mappings
-- ============================================================================
CREATE TABLE injury_procedure_mappings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  injury_id TEXT NOT NULL REFERENCES injury_categories(id) ON DELETE CASCADE,
  procedure_id TEXT NOT NULL REFERENCES medical_procedures(id) ON DELETE CASCADE,

  phase TEXT NOT NULL DEFAULT 'ACUTE'
    CHECK (phase IN ('EMERGENCY', 'ACUTE', 'SURGICAL', 'REHABILITATION', 'CHRONIC', 'LIFETIME')),
  is_common INTEGER NOT NULL DEFAULT 1,
  typical_qty INTEGER NOT NULL DEFAULT 1,
  frequency TEXT,
  notes TEXT,

  UNIQUE(injury_id, procedure_id, phase)
);

-- ============================================================================
-- Injury ↔ Crash Severity Likelihood
-- ============================================================================
CREATE TABLE injury_crash_severity_map (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  injury_id TEXT NOT NULL REFERENCES injury_categories(id) ON DELETE CASCADE,
  crash_severity TEXT NOT NULL
    CHECK (crash_severity IN ('FATAL', 'SERIOUS_INJURY', 'MINOR_INJURY', 'POSSIBLE_INJURY', 'PROPERTY_DAMAGE_ONLY')),
  likelihood REAL NOT NULL,

  UNIQUE(injury_id, crash_severity)
);

-- ============================================================================
-- Aggregate Cost Data (WISQARS, NHTSA)
-- ============================================================================
CREATE TABLE injury_cost_aggregates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  source TEXT NOT NULL,
  year INTEGER NOT NULL,

  mechanism TEXT NOT NULL,
  intent TEXT NOT NULL DEFAULT 'Unintentional',
  outcome TEXT NOT NULL,
  age_group TEXT,
  gender TEXT,
  state_code TEXT,

  medical_cost_avg REAL,
  medical_cost_total REAL,
  work_loss_cost_avg REAL,
  work_loss_cost_total REAL,
  quality_life_cost REAL,
  combined_cost_avg REAL,
  combined_cost_total REAL,
  number_of_cases INTEGER,

  UNIQUE(source, year, mechanism, intent, outcome, age_group, gender, state_code)
);

CREATE INDEX idx_agg_mechanism ON injury_cost_aggregates(mechanism);
CREATE INDEX idx_agg_state ON injury_cost_aggregates(state_code);

-- ============================================================================
-- Knowledge Graph: Entity Relationships
-- ============================================================================
CREATE TABLE IF NOT EXISTS entity_relationships (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,  -- 'procedure', 'condition', 'body_system', 'drug', 'category'
  source_id TEXT NOT NULL,
  relationship TEXT NOT NULL,  -- 'treats', 'diagnosed_by', 'same_category', 'same_body_system', 'commonly_paired', 'alternative_to'
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  weight REAL DEFAULT 1.0,  -- relevance strength 0-1
  UNIQUE(source_type, source_id, relationship, target_type, target_id)
);
CREATE INDEX IF NOT EXISTS idx_er_source ON entity_relationships(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_er_target ON entity_relationships(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_er_rel ON entity_relationships(relationship);

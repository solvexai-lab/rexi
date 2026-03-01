-- Health Insurance Analyses table
-- Separate from motor insurance_analyses — never share data between domains

CREATE TABLE IF NOT EXISTS health_insurance_analyses (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at              TIMESTAMPTZ DEFAULT NOW(),

  -- Document classification
  document_type           TEXT NOT NULL CHECK (document_type IN ('policy', 'certificate', 'brochure')),

  -- Policy identifiers
  insurer_name            TEXT NOT NULL,
  product_name            TEXT,
  policy_number           TEXT,
  coverage_type           TEXT CHECK (coverage_type IN ('individual', 'floater', 'senior_citizen', 'group')),

  -- Core financials
  sum_insured             BIGINT,          -- ₹
  premium                 BIGINT,          -- ₹/year

  -- Policy dates
  policy_start            DATE,
  policy_end              DATE,

  -- Room rent limits
  room_rent_limit         INTEGER,         -- ₹/day; NULL = no cap
  room_rent_limit_type    TEXT CHECK (room_rent_limit_type IN ('fixed', 'percentage', 'none')),
  room_rent_percent       REAL,            -- e.g. 1.0 = "1% of SI per day"
  icu_limit               INTEGER,         -- ₹/day; NULL = no cap

  -- Cost-sharing
  co_pay                  INTEGER DEFAULT 0,        -- %
  deductible              INTEGER DEFAULT 0,        -- ₹

  -- Policy benefits
  cumulative_bonus        BOOLEAN DEFAULT FALSE,
  restoration_benefit     BOOLEAN DEFAULT FALSE,
  network_hospitals       INTEGER,
  claim_settlement_ratio  REAL,            -- %

  -- JSONB structured data
  waiting_periods         JSONB,           -- HealthWaitingPeriods
  sub_limits              JSONB,           -- HealthSubLimits
  coverages               JSONB,           -- HealthCoverage
  scenarios               JSONB,           -- HealthClaimScenario[]
  risk_flags              JSONB,           -- HealthRiskFlag[]
  extracted_conditions    JSONB,           -- { covered: string[], excluded: string[] }

  -- Extraction metadata
  extraction_confidence   REAL DEFAULT 0.8 CHECK (extraction_confidence >= 0 AND extraction_confidence <= 1),

  -- Full OCR text — CRITICAL for Rexi chat RAG (100k chars sent to Gemini)
  raw_text                TEXT,

  CONSTRAINT valid_co_pay CHECK (co_pay >= 0 AND co_pay <= 100)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_health_analyses_created  ON health_insurance_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_analyses_insurer  ON health_insurance_analyses(insurer_name);
CREATE INDEX IF NOT EXISTS idx_health_analyses_type     ON health_insurance_analyses(document_type);

-- Row Level Security
ALTER TABLE health_insurance_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "health_public_select"
  ON health_insurance_analyses FOR SELECT
  USING (true);

CREATE POLICY "health_service_insert"
  ON health_insurance_analyses FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "health_service_update"
  ON health_insurance_analyses FOR UPDATE
  USING (auth.role() = 'service_role');

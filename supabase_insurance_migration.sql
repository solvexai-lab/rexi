-- Insurance Analyses Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS insurance_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Document Classification
  document_type TEXT NOT NULL CHECK (document_type IN ('policy', 'quotation', 'brochure')),
  
  -- Vehicle Data (for policy/quotation)
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_registration TEXT,
  vehicle_year INTEGER,
  
  -- Financial Data
  idv TEXT,  -- Stored as TEXT to avoid precision issues
  premium TEXT,
  policy_number TEXT,
  quotation_id TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,  -- Policy expiry date
  valid_until TIMESTAMP WITH TIME ZONE,  -- Quotation validity date
  insurer_name TEXT NOT NULL,
  
  -- Structured Data (JSONB for flexibility)
  coverages JSONB,  -- { hasZeroDepreciation: true, ... }
  scenarios JSONB,  -- Array of ClaimScenario objects
  risk_flags JSONB,  -- Array of RiskFlag objects
  brochure_features JSONB,  -- For brochure documents
  extracted_perils JSONB,  -- { covered: [...], exclusions: [...] }
  
  -- Metadata
  extraction_confidence REAL DEFAULT 0.85,
  raw_text TEXT  -- Optional: full PDF text for debugging
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_insurance_analyses_created_at ON insurance_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_insurance_analyses_type ON insurance_analyses(document_type);

-- Enable Row Level Security (optional - for multi-user)
ALTER TABLE insurance_analyses ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone with link can view)
CREATE POLICY "Public read access" ON insurance_analyses
  FOR SELECT USING (true);

-- Insert policy (service role only)
CREATE POLICY "Service role insert" ON insurance_analyses
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

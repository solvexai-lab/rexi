-- Create insurance_analyses table
CREATE TABLE IF NOT EXISTS insurance_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL CHECK (document_type IN ('policy', 'quotation', 'brochure')),
  
  -- Vehicle Info (NULL for brochures)
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_registration TEXT,
  vehicle_year INTEGER,
  
  -- Financial Data (NULL for brochures)
  idv NUMERIC(10, 2),
  premium NUMERIC(10, 2),
  
  -- Document Identifiers
  policy_number TEXT,
  quotation_id TEXT,
  insurer_name TEXT NOT NULL,
  
  -- Structured Data (JSONB for flexibility)
  coverages JSONB,
  scenarios JSONB,
  risk_flags JSONB,
  brochure_features JSONB,
  
  -- Metadata
  raw_text TEXT,
  extraction_confidence NUMERIC(3, 2),  -- 0.00 to 1.00
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT valid_confidence CHECK (extraction_confidence >= 0 AND extraction_confidence <= 1)
);

CREATE INDEX IF NOT EXISTS idx_insurance_analyses_type ON insurance_analyses(document_type);
CREATE INDEX IF NOT EXISTS idx_insurance_analyses_vehicle ON insurance_analyses(vehicle_registration);
CREATE INDEX IF NOT EXISTS idx_insurance_analyses_created ON insurance_analyses(created_at DESC);

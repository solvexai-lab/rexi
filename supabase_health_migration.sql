-- Health Insurance Analyses Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.health_insurance_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Basic Policy Info
    document_type TEXT NOT NULL CHECK (document_type IN ('policy', 'certificate', 'brochure')),
    insurer_name TEXT NOT NULL,
    product_name TEXT,
    policy_number TEXT,
    coverage_type TEXT, -- 'individual', 'family_floater', etc.
    
    -- Financials
    sum_insured NUMERIC,
    premium NUMERIC,
    policy_start DATE,
    policy_end DATE,
    
    -- Room Rent & ICU
    room_rent_limit NUMERIC,
    room_rent_limit_type TEXT DEFAULT 'none', -- 'none', 'percent', 'absolute', 'private_suite', etc.
    room_rent_percent NUMERIC, -- If type is 'percent'
    icu_limit NUMERIC,
    
    -- Cost Sharing
    co_pay NUMERIC DEFAULT 0,
    deductible NUMERIC DEFAULT 0,
    
    -- Other Metrics
    network_hospitals INTEGER,
    claim_settlement_ratio NUMERIC,
    cumulative_bonus BOOLEAN DEFAULT false,
    restoration_benefit BOOLEAN DEFAULT false,
    
    -- Complex Data (JSONB)
    waiting_periods JSONB, -- { initialDays: number, pedMonths: number, ... }
    sub_limits JSONB, -- { cataract: number, ... }
    coverages JSONB, -- { covered: string[], excluded: string[] } or similar
    
    -- Results from Analysis
    scenarios JSONB, -- Array of HealthClaimScenario
    risk_flags JSONB, -- Array of HealthRiskFlag
    extracted_conditions JSONB, -- Final refined conditions
    
    -- Metadata
    extraction_confidence NUMERIC DEFAULT 0.8,
    raw_text TEXT -- Full OCR text for AI context
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_health_analyses_created_at ON public.health_insurance_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_analyses_insurer ON public.health_insurance_analyses(insurer_name);

-- RLS (Row Level Security)
ALTER TABLE public.health_insurance_analyses ENABLE ROW LEVEL SECURITY;

-- Allow public read access (sharing results via ID)
CREATE POLICY "Allow public read access to health analyses" 
ON public.health_insurance_analyses FOR SELECT 
USING (true);

-- Allow service role to insert/update
CREATE POLICY "Allow service role full access to health analyses"
ON public.health_insurance_analyses 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Migration: Create leads table for email capture
-- Date: 2026-02-24

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    source_context TEXT, -- e.g. 'motor-insurance', 'job-offer', 'home-page'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security) - allow anyone to insert a lead
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to leads" 
ON public.leads FOR INSERT 
WITH CHECK (true);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);

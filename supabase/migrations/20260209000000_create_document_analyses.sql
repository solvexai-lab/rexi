-- Create document_analyses table for unified Rexi Chat context
CREATE TABLE IF NOT EXISTS document_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_hash TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('analyze', 'offers')),
  document_type TEXT NOT NULL,  -- 'policy', 'quotation', 'brochure', 'unknown'
  file_name TEXT,
  raw_text TEXT,
  analysis_result JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_document_analyses_hash ON document_analyses(document_hash);
CREATE INDEX IF NOT EXISTS idx_document_analyses_source ON document_analyses(source);
CREATE INDEX IF NOT EXISTS idx_document_analyses_created ON document_analyses(created_at DESC);

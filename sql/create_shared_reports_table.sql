-- Create shared_reports table for storing shareable report links
-- Run this in Supabase SQL Editor, then refresh the schema cache

-- Drop table if it exists (for clean recreation)
DROP TABLE IF EXISTS shared_reports CASCADE;

CREATE TABLE shared_reports (
  id TEXT PRIMARY KEY,
  report_type TEXT NOT NULL CHECK (report_type IN ('contract', 'offer')),
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_by_ip TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_shared_reports_expires_at ON shared_reports(expires_at);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_shared_reports_created_at ON shared_reports(created_at);

-- Enable Row Level Security
ALTER TABLE shared_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read non-expired reports
CREATE POLICY "Anyone can view non-expired reports" ON shared_reports
  FOR SELECT
  USING (expires_at > NOW());

-- Policy: Anyone can insert reports (for anonymous sharing)
CREATE POLICY "Anyone can create shared reports" ON shared_reports
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow updating view_count
CREATE POLICY "Anyone can update view count" ON shared_reports
  FOR UPDATE
  USING (expires_at > NOW())
  WITH CHECK (true);

-- Function to clean up expired reports (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_shared_reports()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM shared_reports WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to clean up expired reports daily
-- Note: Requires pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('cleanup-expired-reports', '0 3 * * *', 'SELECT cleanup_expired_shared_reports()');

-- IMPORTANT: After running this SQL, you need to refresh the schema cache.
-- In Supabase Dashboard: Go to Settings > API > Click "Reload" next to "Schema cache"
-- Or run this command to notify PostgREST to reload:
NOTIFY pgrst, 'reload schema';

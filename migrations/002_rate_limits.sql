-- Migration: Add distributed rate limiting table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS rate_limits (
    client_ip TEXT PRIMARY KEY,
    request_count INTEGER NOT NULL DEFAULT 0,
    window_start BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start 
ON rate_limits(window_start);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_rate_limits_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rate_limits_updated_at
BEFORE UPDATE ON rate_limits
FOR EACH ROW
EXECUTE FUNCTION update_rate_limits_timestamp();

-- Enable Row Level Security (optional, for additional protection)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to manage all records
CREATE POLICY "Service role can manage rate limits"
ON rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMENT ON TABLE rate_limits IS 'Distributed rate limiting for API endpoints';
COMMENT ON COLUMN rate_limits.client_ip IS 'Client IP address (hashed in production)';
COMMENT ON COLUMN rate_limits.request_count IS 'Number of requests in current window';
COMMENT ON COLUMN rate_limits.window_start IS 'Unix timestamp (ms) when the current window started';

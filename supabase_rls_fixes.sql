-- REXI DATABASE SECURITY FIXES
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO RESOLVE LINTER ERRORS

-- 1. Enable RLS on all tables in the public schema
ALTER TABLE public.legal_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisdiction_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_analyses ENABLE ROW LEVEL SECURITY;

-- 2. Create basic default policies for public/anon access where needed
-- Since the app heavily uses the Service Role Key for backend operations
-- (which bypasses RLS), these policies ensure the basic read protections
-- are in place if the anon key is used, while restricting writes.

-- Note: If you expect users to insert data from the frontend using the Anon key,
-- you will need to add more specific INSERT/UPDATE policies here. Currently,
-- most writes seem to go through Next.js server actions (Service Role).

-- Grant public read access to purely static/informational tables:
CREATE POLICY "Allow public read access on patterns" 
ON public.patterns FOR SELECT USING (true);

CREATE POLICY "Allow public read access on laws" 
ON public.laws FOR SELECT USING (true);

CREATE POLICY "Allow public read access on jurisdictions" 
ON public.jurisdictions FOR SELECT USING (true);

CREATE POLICY "Allow public read access on compliance_rules" 
ON public.compliance_rules FOR SELECT USING (true);

CREATE POLICY "Allow public read access on regulatory_authorities" 
ON public.regulatory_authorities FOR SELECT USING (true);

CREATE POLICY "Allow public read access on legal_patterns" 
ON public.legal_patterns FOR SELECT USING (true);

CREATE POLICY "Allow public read access on contract_patterns" 
ON public.contract_patterns FOR SELECT USING (true);

CREATE POLICY "Allow public read access on community_patterns" 
ON public.community_patterns FOR SELECT USING (true);

-- For user-specific data, restrict access to the authenticated user ID:
-- (Assuming your tables use a foreign key like 'user_id' linked to auth.users)
-- If some of these tables do not have user_id, you can skip applying the policy and
-- just let the implicit "deny all" take over for Anon users.

-- Example implementation for user-specific data (uncomment and adjust if they have user_id):
/*
CREATE POLICY "Users can read their own profiles" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read their own analysis history" 
ON public.analysis_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own document analyses" 
ON public.document_analyses FOR SELECT USING (auth.uid() = user_id);
*/

-- The Service Role key (used in backend actions) automatically bypasses these RLS policies.
-- By running this script, you eliminate the "RLS Disabled in Public" linter warnings.

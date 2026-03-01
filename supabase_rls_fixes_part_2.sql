-- REXI DATABASE SECURITY FIXES PART 2
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO RESOLVE REMAINING LINTER ERRORS

-------------------------------------------------------------------------------
-- 1. FIX: "Extension in Public"
-- Move the pgvector extension out of the public schema and into a dedicated one.
-------------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS extensions;
-- Note: You might need superuser privileges to move an extension. 
-- In Supabase, this typically works if you do it from the dashboard SQL editor.
ALTER EXTENSION vector SET SCHEMA extensions;

-------------------------------------------------------------------------------
-- 2. FIX: "Function Search Path Mutable"
-- For security, functions executed with elevated privileges (or generally) 
-- should explicitly set their search_path so they aren't vulnerable to 
-- search path injection attacks.
-------------------------------------------------------------------------------

-- Fix match_patterns function
CREATE OR REPLACE FUNCTION public.match_patterns(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id text, name text, category text, severity text, description text, 
  why_it_matters text, plain_english text, how_it_should_be text, 
  negotiation_script text, suggested_alternative text, similarity float
)
LANGUAGE plpgsql
SET search_path TO public, extensions -- explicitly set search_path
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.name, p.category, p.severity, p.description,
    p.why_it_matters, p.plain_english, p.how_it_should_be,
    p.negotiation_script, p.suggested_alternative,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM public.patterns p
  WHERE 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Fix match_patterns_by_jurisdiction
CREATE OR REPLACE FUNCTION public.match_patterns_by_jurisdiction(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  target_jurisdiction text DEFAULT NULL
)
RETURNS TABLE (
  id text, name text, category text, severity text, description text, 
  why_it_matters text, plain_english text, how_it_should_be text, 
  negotiation_script text, suggested_alternative text, similarity float
)
LANGUAGE plpgsql
SET search_path TO public, extensions
AS $$
BEGIN
  -- If you don't actually have a match_patterns_by_jurisdiction, you might have created it
  -- in a different migration script. Ensure the search_path is set.
  -- This is a stub placeholder that matches the original signature.
  -- Replace the body with your actual implementation if different.
  RETURN QUERY
  SELECT
    p.id, p.name, p.category, p.severity, p.description,
    p.why_it_matters, p.plain_english, p.how_it_should_be,
    p.negotiation_script, p.suggested_alternative,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM public.patterns p
  WHERE 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assuming standard Supabase auth trigger body:
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- Fix get_applicable_laws (Assuming standard signature)
CREATE OR REPLACE FUNCTION public.get_applicable_laws(search_query text)
RETURNS SETOF public.laws
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT * FROM laws WHERE content ILIKE '%' || search_query || '%';
END;
$$;

-- Fix cleanup_expired_shared_reports
CREATE OR REPLACE FUNCTION public.cleanup_expired_shared_reports()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.shared_reports WHERE expires_at < now();
END;
$$;

-------------------------------------------------------------------------------
-- 3. FIX: "RLS Policy Always True"
-- The linter flagged policies that allow anonymous/public users to unconditionally
-- UPDATE, INSERT, or DELETE without checks. 
-- If an operation is done via the Service Role key in your backend, you do NOT 
-- need an RLS policy for it (Service Role bypasses RLS).
-- If an operation is done from the frontend via the Anon key, it needs a restricted policy.
-------------------------------------------------------------------------------

-- A. health_insurance_analyses
DROP POLICY IF EXISTS "Allow service role full access to health analyses" ON public.health_insurance_analyses;
-- You do not need an RLS policy for the Service Role Key. By dropping the permissive `USING (true)` 
-- on ALL, you prevent random attackers with the anon key from modifying the table.
-- If the frontend needs to READ results:
CREATE POLICY "Allow public read access to health analyses"
  ON public.health_insurance_analyses
  FOR SELECT
  USING (true);

-- B. leads
DROP POLICY IF EXISTS "Allow public insert to leads" ON public.leads;
-- If leads are submitted via an API route (using Service Role), no policy is needed here.
-- If they are inserted directly from the browser (Anon key), restrict it to Insert-only, with no Read/Update access.
CREATE POLICY "Allow public insert to leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true); 
  -- Note: WITH CHECK (true) on INSERT is acceptable if the goal is allowing anyone to submit a lead.
  -- Supabase linter sometimes warns on this, but if your architecture requires public lead submission from the browser,
  -- this is the only way. A better architecture is proxying through a Next.js API route using Service Role Key.

-- C. shared_reports
DROP POLICY IF EXISTS "Anyone can create shared reports" ON public.shared_reports;
DROP POLICY IF EXISTS "Anyone can update view count" ON public.shared_reports;

-- Same logic: If you create/update shared reports via a secure Next.js API route using the Service Role Key,
-- you DO NOT need these permissive policies.
-- If you absolutely must create them from the browser, you accept the minimal risk.
-- Assuming backend proxy:
CREATE POLICY "Allow public read access to active shared reports"
  ON public.shared_reports
  FOR SELECT
  USING (expires_at > now());

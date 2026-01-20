-- REXI PRODUCTION DATABASE SETUP SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the patterns table
CREATE TABLE IF NOT EXISTS patterns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT,
    why_it_matters TEXT,
    plain_english TEXT,
    how_it_should_be TEXT,
    negotiation_script TEXT,
    suggested_alternative TEXT,
    embedding vector(768)
);

-- 3. Create the vector search function
CREATE OR REPLACE FUNCTION match_patterns (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id text,
  name text,
  category text,
  severity text,
  description text,
  why_it_matters text,
  plain_english text,
  how_it_should_be text,
  negotiation_script text,
  suggested_alternative text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    patterns.id,
    patterns.name,
    patterns.category,
    patterns.severity,
    patterns.description,
    patterns.why_it_matters,
    patterns.plain_english,
    patterns.how_it_should_be,
    patterns.negotiation_script,
    patterns.suggested_alternative,
    1 - (patterns.embedding <=> query_embedding) AS similarity
  FROM patterns
  WHERE 1 - (patterns.embedding <=> query_embedding) > match_threshold
  ORDER BY patterns.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 4. Insert Patterns (Part 1)
INSERT INTO patterns (id, name, category, severity, description, why_it_matters, plain_english, how_it_should_be, negotiation_script, suggested_alternative, embedding)
VALUES 
('automatic-renewal-with-price-escalation', 'Automatic Renewal with Price Escalation', 'termination', 'high', 'Agreement automatically renews for successive terms (often annual) unless written notice is provided 60-90 days prior to renewal date, with provisions allowing price increases of up to 15-25% upon renewal at provider''s sole discretion.', 'Locks you into long-term commitments with unpredictable cost increases. Missing the narrow cancellation window commits you to another full term at potentially higher rates. Common in insurance policies, SaaS agreements, and service contracts.', 'Your contract keeps renewing automatically every year unless you cancel within a specific window (usually 60-90 days before it ends). The other party can raise prices each time it renews, and you might not notice until you''re locked in for another year.', 'Contract should renew on an opt-in basis requiring affirmative consent, with price increases capped at a specific percentage (e.g., 5% annually) or tied to an index like CPI, and allowing termination with 30 days notice.', 'We''d like to modify the renewal terms to require mutual written agreement for each renewal period, with any price increases limited to [X%] annually and tied to documented cost changes. We also need the flexibility to terminate with 30 days notice rather than being locked into the narrow cancellation window.', 'This Agreement shall renew only upon written consent of both parties. Either party may terminate this Agreement with thirty (30) days written notice. Any price increases upon renewal shall not exceed the lesser of (i) five percent (5%) or (ii) the percentage increase in the Consumer Price Index for the preceding twelve months, and must be communicated in writing at least sixty (60) days prior to the renewal date.', '[0.054817095,-0.011746029,-0.04702522,0.018047906,-0.0235581,0.025516067,-0.018474873,-0.027257966,0.01716062,-0.020646082,-0.0040194183,0.047683407,0.011956912,-0.010050473,0.0214]'),
('unilateral-contract-modification-rights', 'Unilateral Contract Modification Rights', 'other', 'high', 'Provider reserves the right to modify, amend, or change the terms and conditions of the agreement at any time, at its sole discretion, with changes becoming effective immediately upon posting to website or with minimal notice (e.g., 10-15 days).', 'Allows the other party to fundamentally change the deal after you''ve signed, including pricing, service levels, liability caps, and dispute resolution terms. You have no recourse except to terminate, often forfeiting deposits or facing penalties. Extremely common in insurance policies, financial services, and software licensing.', 'They can change any part of the contract whenever they want, and you''re automatically bound by the new terms unless you cancel (which might cost you money or leave you scrambling for alternatives).', 'Material changes to terms should require your written consent or provide a reasonable termination right without penalty. Non-material changes should require 60 days notice with clear disclosure of what changed.', 'We need protection against unilateral changes to material terms like pricing, service levels, and liability provisions. Can we add language that requires our written consent for material changes, or at minimum, allows us to terminate without penalty within 60 days of any such change?', 'Provider may not modify material terms of this Agreement (including pricing, service levels, liability limitations, or dispute resolution) without Client''s prior written consent. For non-material modifications, Provider shall provide Client with sixty (60) days advance written notice. Client may terminate this Agreement without penalty within thirty (30) days of receiving notice of any modification by providing written notice to Provider.', '[0.03033961,-0.008407154,-0.035024114,-0.004492035,-0.035356548,0.004888966,-0.0024183772,0.007658555,0.025152808,0.012250196,-0.009578436,0.06327521,0.0]'),
('mandatory-binding-arbitration-with-class-action-waiver', 'Mandatory Binding Arbitration with Class Action Waiver', 'other', 'critical', 'All disputes must be resolved through binding individual arbitration, with an explicit waiver of the right to participate in class action lawsuits, often specifying a particular arbitration forum and requiring each party to bear their own costs regardless of outcome.', 'Eliminates your right to sue in court and prevents joining with other affected parties in class actions. In disputes involving small amounts, the cost of arbitration may exceed your claim, effectively denying you any remedy. Arbitration decisions are final with very limited appeal rights. Prevalent in financial services, insurance, healthcare, and consumer contracts.', 'If there''s a dispute, you can''t go to court or join with other customers to sue together. You have to use a private arbitration process that''s expensive, final, and heavily favors companies with experience in that system. For small claims, the cost makes it impossible to pursue.', 'Preserve the right to court litigation for disputes exceeding a certain threshold (e.g., $50,000), allow class actions for systemic issues, and ensure the company pays all arbitration costs if they exceed small claims court filing fees.', 'The arbitration clause as written eliminates practical remedies for many disputes. We''d like to preserve the right to court litigation for claims over $50,000, maintain the ability to participate in class actions for systemic issues, and ensure your company covers arbitration costs that exceed normal court filing fees.', 'For disputes not exceeding $50,000, parties agree to binding arbitration under [neutral rules]. For disputes exceeding $50,000, either party may elect litigation in courts of competent jurisdiction. This arbitration provision does not preclude participation in class action proceedings for claims involving systemic breaches affecting multiple parties.', '[0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1]'),
('unlimited-indemnification-obligation', 'Unlimited Indemnification Obligation', 'indemnity', 'critical', 'Client agrees to indemnify, defend, and hold harmless Provider, its affiliates, officers, directors, and employees from any and all claims, damages, losses, liabilities, and expenses (including attorneys'' fees) arising from or related to Client''s use of services, breach of agreement, or violation of any law, with no cap on liability.', 'Creates unlimited financial exposure for actions that may be partially or wholly the provider''s fault. You could be responsible for defending the provider in lawsuits and paying their legal fees even when they''re negligent. Common in service agreements, software licenses, and vendor contracts.', 'You''re promising to pay for any lawsuits or claims against them that are even remotely related to your use of their service, even if they caused the problem. There''s no limit to how much you might have to pay, including their lawyer fees.', 'Indemnification should be mutual, capped at a reasonable amount (e.g., total fees paid or policy limits), and exclude claims arising from the provider''s negligence, breach, or defective services.', 'The current indemnification provision creates unlimited liability for our company, even in situations where your negligence may be a contributing factor. We need mutual indemnification obligations, a cap tied to the agreement value or our insurance limits, and clear exclusions for claims arising from your breach or negligence.', 'Each party shall indemnify the other from claims arising solely from the indemnifying party''s (i) breach of this Agreement, (ii) negligence or willful misconduct, or (iii) violation of applicable law. Client''s indemnification obligation shall not exceed the total fees paid under this Agreement in the twelve months preceding the claim. This indemnification does not apply to claims arising from Provider''s negligent provision of services or defective products.', '[0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2]')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity,
  description = EXCLUDED.description,
  why_it_matters = EXCLUDED.why_it_matters,
  plain_english = EXCLUDED.plain_english,
  how_it_should_be = EXCLUDED.how_it_should_be,
  negotiation_script = EXCLUDED.negotiation_script,
  suggested_alternative = EXCLUDED.suggested_alternative,
  embedding = EXCLUDED.embedding;

-- (Note: Full pattern data is available in insert_patterns.sql and insert_more_patterns.sql)
-- Please run those files after this setup if you want to populate the complete database.

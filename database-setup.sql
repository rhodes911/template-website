-- Ellie Edwards Marketing - Complete Database Setup
-- Execute this complete script in Supabase SQL Editor
-- This replaces all other SQL files and creates everything needed

-- ============================================================================
-- STEP 1: Clean Start - Drop existing table if it has issues
-- ============================================================================
DROP TABLE IF EXISTS leads CASCADE;
DROP VIEW IF EXISTS lead_stats CASCADE;

-- ============================================================================
-- STEP 2: Create Main Leads Table
-- ============================================================================
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,
  phone TEXT,
  company TEXT,
  source TEXT DEFAULT 'website_contact_form',
  status TEXT DEFAULT 'new',
  services_interested JSONB DEFAULT '[]'::jsonb,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: Create Indexes for Performance
-- ============================================================================
CREATE UNIQUE INDEX leads_email_idx ON leads(email);
CREATE INDEX leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX leads_status_idx ON leads(status);
CREATE INDEX leads_source_idx ON leads(source);
CREATE INDEX leads_services_gin_idx ON leads USING GIN (services_interested);

-- ============================================================================
-- STEP 4: Set Up Row Level Security (RLS) - WORKING VERSION
-- ============================================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies (no complex roles)
CREATE POLICY "allow_anon_insert" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "allow_authenticated_insert" ON leads
  FOR INSERT  
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "allow_anon_select" ON leads
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "allow_authenticated_select" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_service_all" ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STEP 5: Create Auto-Update Trigger for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 6: Create Analytics View
-- ============================================================================
CREATE VIEW lead_stats AS
SELECT 
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as leads_this_week,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as leads_today,
  COUNT(*) FILTER (WHERE status = 'new') as new_leads,
  COUNT(*) FILTER (WHERE status = 'contacted') as contacted_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as converted_leads,
  source,
  COUNT(*) as source_count
FROM leads
GROUP BY source
ORDER BY source_count DESC;

-- ============================================================================
-- STEP 7: Test the Setup
-- ============================================================================

-- Insert test records to verify everything works
INSERT INTO leads (name, email, message, source) 
VALUES ('Database Setup Test', 'setup-test@ellieedwardsmarketing.com', 'Initial database configuration test', 'setup_verification')
ON CONFLICT (email) DO NOTHING;

INSERT INTO leads (name, email, message, source) 
VALUES ('RLS Policy Test', 'rls-test@ellieedwardsmarketing.com', 'Testing Row Level Security policies', 'rls_test')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- STEP 8: Verification & Status Report
-- ============================================================================

-- Check that everything was created successfully
SELECT 
  'leads' as table_name,
  'Table created successfully' as status,
  COUNT(*) as test_records
FROM leads

UNION ALL

SELECT 
  'lead_stats' as table_name,
  'View created successfully' as status,
  COUNT(*)::integer as total_leads
FROM lead_stats;

-- Final success message
SELECT 
  '🎉 DATABASE SETUP COMPLETE! 🎉' as status,
  'Your contact form at localhost:3000/contact is ready to use!' as next_step,
  'Check Table Editor > leads to see captured leads' as admin_tip;

-- Show table structure for reference
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND table_schema = 'public'
ORDER BY ordinal_position;

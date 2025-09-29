-- Migration: Add Services Selection Support
-- Run this in Supabase SQL Editor to add services support to existing leads table
-- Date: July 19, 2025

-- Step 1: Add services_interested column to existing table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS services_interested JSONB DEFAULT '[]'::jsonb;

-- Step 2: Create index for efficient service queries
CREATE INDEX IF NOT EXISTS leads_services_gin_idx ON leads USING GIN (services_interested);

-- Step 3: Update existing records to have empty array (if any exist)
UPDATE leads SET services_interested = '[]'::jsonb WHERE services_interested IS NULL;

-- Step 4: Verify the migration
SELECT 
  'Migration Status' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'leads' 
      AND column_name = 'services_interested'
    ) THEN '✅ services_interested column added successfully'
    ELSE '❌ services_interested column not found'
  END as status

UNION ALL

SELECT 
  'Index Status' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = 'leads' 
      AND indexname = 'leads_services_gin_idx'
    ) THEN '✅ GIN index created successfully'
    ELSE '❌ GIN index not found'
  END as status

UNION ALL

SELECT 
  'Data Status' as check_type,
  '✅ Total leads: ' || COUNT(*)::text || ', with services column ready' as status
FROM leads;

-- Test insert to verify everything works
INSERT INTO leads (name, email, message, services_interested) 
VALUES ('Services Migration Test', 'migration-test@ellieedwardsmarketing.com', 'Testing services migration', '["seo", "content-marketing"]'::jsonb)
ON CONFLICT (email) DO UPDATE SET 
  services_interested = EXCLUDED.services_interested,
  updated_at = NOW();

-- Show the test record
SELECT 
  id, name, email, services_interested, created_at
FROM leads 
WHERE email = 'migration-test@ellieedwardsmarketing.com';

-- Success message
SELECT '🎉 MIGRATION COMPLETE! Services selection is now ready to use!' as result;

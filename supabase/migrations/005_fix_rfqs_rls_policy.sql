-- Fix RLS policy for rfqs table to allow public inserts
-- This fixes the "new row violates row-level security policy" error

-- Drop existing insert policies
DROP POLICY IF EXISTS "Allow public to insert RFQs" ON rfqs;
DROP POLICY IF EXISTS "Allow anon to insert RFQs" ON rfqs;

-- Create policy that allows both anon and public roles to insert
-- This ensures anonymous users (form submissions) can insert RFQs
CREATE POLICY "Allow public to insert RFQs"
  ON rfqs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Also explicitly allow anon role (for Supabase anon key)
CREATE POLICY "Allow anon to insert RFQs"
  ON rfqs
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure SELECT policy exists for public (to verify inserts)
CREATE POLICY IF NOT EXISTS "Allow public to view own RFQs"
  ON rfqs
  FOR SELECT
  TO public
  USING (true);


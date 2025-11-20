-- Add SELECT policies for RFQs table to allow dashboard access
-- This fixes the issue where dashboard couldn't display RFQ statistics

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to view RFQs" ON rfqs;
DROP POLICY IF EXISTS "Allow anon to view RFQs" ON rfqs;

-- Create policy to allow public role to view RFQs (for dashboard)
CREATE POLICY "Allow public to view RFQs"
  ON rfqs
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow anon role to view RFQs (for dashboard)
CREATE POLICY "Allow anon to view RFQs"
  ON rfqs
  FOR SELECT
  TO anon
  USING (true);

-- Note: Authenticated users already have SELECT permission via
-- "Allow authenticated to view RFQs" policy


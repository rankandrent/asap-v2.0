-- Create RFQs table
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  
  -- Part Information
  part_number TEXT,
  part_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  target_price DECIMAL(10, 2),
  
  -- Additional Details
  message TEXT,
  urgency TEXT NOT NULL DEFAULT 'standard' CHECK (urgency IN ('standard', 'urgent', 'critical')),
  
  -- Tracking Information
  source_page TEXT NOT NULL,
  source_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  
  -- Metadata
  ip_address TEXT,
  country TEXT,
  session_id TEXT,
  
  -- Indexes for common queries
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_rfqs_created_at ON rfqs(created_at DESC);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfqs_source_page ON rfqs(source_page);
CREATE INDEX idx_rfqs_email ON rfqs(email);
CREATE INDEX idx_rfqs_part_number ON rfqs(part_number);

-- Enable Row Level Security
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert RFQs
CREATE POLICY "Allow public to insert RFQs"
  ON rfqs
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to view all RFQs
CREATE POLICY "Allow authenticated to view RFQs"
  ON rfqs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update RFQs
CREATE POLICY "Allow authenticated to update RFQs"
  ON rfqs
  FOR UPDATE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_rfqs_updated_at
  BEFORE UPDATE ON rfqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for RFQ analytics
CREATE OR REPLACE VIEW rfq_analytics AS
SELECT
  COUNT(*) as total_rfqs,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as rfqs_today,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as rfqs_this_week,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as rfqs_this_month,
  COUNT(*) FILTER (WHERE status = 'won') as rfqs_won,
  COUNT(*) FILTER (WHERE status = 'lost') as rfqs_lost,
  AVG(quantity) as average_quantity,
  AVG(target_price) as average_target_price
FROM rfqs;

-- Create a function to get RFQs by date range
CREATE OR REPLACE FUNCTION get_rfqs_by_date(
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  date DATE,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(created_at) as date,
    COUNT(*) as count
  FROM rfqs
  WHERE DATE(created_at) BETWEEN start_date AND end_date
  GROUP BY DATE(created_at)
  ORDER BY DATE(created_at);
END;
$$ LANGUAGE plpgsql;


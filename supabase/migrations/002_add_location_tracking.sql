-- Add location tracking fields to RFQs table
-- Run this migration in Supabase SQL Editor

ALTER TABLE public.rfqs
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS is_usa BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 6),
ADD COLUMN IF NOT EXISTS isp TEXT;

-- Create index on location fields for better query performance
CREATE INDEX IF NOT EXISTS idx_rfqs_country ON public.rfqs (country);
CREATE INDEX IF NOT EXISTS idx_rfqs_country_code ON public.rfqs (country_code);
CREATE INDEX IF NOT EXISTS idx_rfqs_is_usa ON public.rfqs (is_usa);
CREATE INDEX IF NOT EXISTS idx_rfqs_city ON public.rfqs (city);

-- Add comment for documentation
COMMENT ON COLUMN public.rfqs.city IS 'User city from IP geolocation';
COMMENT ON COLUMN public.rfqs.state IS 'User state/region from IP geolocation';
COMMENT ON COLUMN public.rfqs.country_code IS 'Two-letter country code (ISO 3166-1 alpha-2)';
COMMENT ON COLUMN public.rfqs.is_usa IS 'Flag indicating if user is from USA';
COMMENT ON COLUMN public.rfqs.timezone IS 'User timezone';
COMMENT ON COLUMN public.rfqs.latitude IS 'Geographic latitude';
COMMENT ON COLUMN public.rfqs.longitude IS 'Geographic longitude';
COMMENT ON COLUMN public.rfqs.isp IS 'Internet Service Provider';


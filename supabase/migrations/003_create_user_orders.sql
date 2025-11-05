-- Create Orders table for tracking customer orders
-- This integrates with Supabase Auth (auth.users)

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- User Information (links to Supabase Auth)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_email TEXT, -- For guest checkouts (non-registered users)
  
  -- Customer Details
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,
  
  -- Order Details
  order_number TEXT UNIQUE NOT NULL, -- e.g., ORD-2024-00001
  status TEXT DEFAULT 'pending' NOT NULL 
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  
  -- Items (stored as JSONB array)
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example structure:
  -- [
  --   {
  --     "part_number": "ABC-123",
  --     "description": "Brass Standoff",
  --     "quantity": 100,
  --     "unit_price": 2.50,
  --     "total": 250.00
  --   }
  -- ]
  
  -- Pricing
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax NUMERIC(12, 2) DEFAULT 0,
  shipping NUMERIC(12, 2) DEFAULT 0,
  discount NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  
  -- Shipping Information
  shipping_address JSONB,
  -- {
  --   "street": "123 Main St",
  --   "city": "New York",
  --   "state": "NY",
  --   "zip": "10001",
  --   "country": "USA"
  -- }
  
  billing_address JSONB,
  
  -- Tracking
  tracking_number TEXT,
  carrier TEXT,
  estimated_delivery DATE,
  
  -- Payment
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,
  
  -- Location tracking (from RFQ)
  ip_address TEXT,
  country TEXT,
  is_usa BOOLEAN DEFAULT false
);

-- Order Status History
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) -- Admin who updated status
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON public.orders (guest_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (customer_email);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history (order_id);

-- Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Policies for orders table

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.jwt() ->> 'email' = guest_email
);

-- Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guest users can create orders (no auth required)
CREATE POLICY "Anyone can create guest orders" ON public.orders
FOR INSERT WITH CHECK (user_id IS NULL AND guest_email IS NOT NULL);

-- Admins can view all orders (role-based)
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Order status history policies
CREATE POLICY "Users can view own order history" ON public.order_status_history
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE public.orders.id = order_status_history.order_id
    AND (public.orders.user_id = auth.uid() OR public.orders.guest_email = auth.jwt() ->> 'email')
  )
);

CREATE POLICY "Admins can insert order history" ON public.order_status_history
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_suffix TEXT;
  count_suffix TEXT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YYYY');
  
  SELECT LPAD((COUNT(*) + 1)::TEXT, 5, '0') INTO count_suffix
  FROM public.orders
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  new_number := 'ORD-' || year_suffix || '-' || count_suffix;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE public.orders IS 'Customer orders with tracking and status';
COMMENT ON TABLE public.order_status_history IS 'History of order status changes';
COMMENT ON COLUMN public.orders.user_id IS 'Links to auth.users for registered customers';
COMMENT ON COLUMN public.orders.guest_email IS 'Email for guest checkouts (no account)';
COMMENT ON COLUMN public.orders.items IS 'JSONB array of order items';
COMMENT ON COLUMN public.orders.status IS 'Order status: pending, confirmed, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN public.orders.payment_status IS 'Payment status: pending, paid, failed, refunded';


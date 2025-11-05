export interface OrderItem {
  part_number: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  created_at: string
  updated_at: string
  
  // User info
  user_id?: string
  guest_email?: string
  
  // Customer details
  customer_name: string
  customer_email: string
  customer_phone?: string
  customer_company?: string
  
  // Order details
  order_number: string
  status: OrderStatus
  items: OrderItem[]
  
  // Pricing
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  
  // Addresses
  shipping_address?: Address
  billing_address?: Address
  
  // Tracking
  tracking_number?: string
  carrier?: string
  estimated_delivery?: string
  
  // Payment
  payment_method?: string
  payment_status: PaymentStatus
  payment_date?: string
  
  // Notes
  customer_notes?: string
  internal_notes?: string
  
  // Location
  ip_address?: string
  country?: string
  is_usa?: boolean
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  status: OrderStatus
  notes?: string
  created_at: string
  created_by?: string
}

export interface OrderSummary {
  total_orders: number
  pending_orders: number
  shipped_orders: number
  delivered_orders: number
  total_spent: number
  recent_orders: Order[]
}


export interface RFQ {
  id: string
  created_at: string
  
  // Contact Information
  name: string
  email: string
  phone?: string
  company?: string
  
  // Part Information
  part_number?: string
  part_description?: string
  quantity: number
  target_price?: number
  
  // Additional Details
  message?: string
  urgency: 'standard' | 'urgent' | 'critical'
  
  // Tracking Information
  source_page: string
  source_url: string
  referrer?: string
  user_agent?: string
  
  // Status
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
  
  // Metadata
  ip_address?: string
  country?: string
  session_id?: string
}

export interface RFQFormData {
  name: string
  email: string
  phone?: string
  company?: string
  part_number?: string
  part_description?: string
  quantity: number
  target_price?: number
  message?: string
  urgency: 'standard' | 'urgent' | 'critical'
}

export interface RFQAnalytics {
  total_rfqs: number
  rfqs_today: number
  rfqs_this_week: number
  rfqs_this_month: number
  by_status: Record<string, number>
  by_page: Record<string, number>
  by_date: Array<{ date: string; count: number }>
  conversion_rate: number
  average_quantity: number
  top_parts: Array<{ part: string; count: number }>
}


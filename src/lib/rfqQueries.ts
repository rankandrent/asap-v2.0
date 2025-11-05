import { supabase } from './supabase'
import type { RFQ, RFQFormData, RFQAnalytics } from '../types/rfq'

export const submitRFQ = async (
  data: RFQFormData,
  trackingData: {
    sourcePage: string
    sourceUrl: string
    referrer?: string
    userAgent?: string
  }
): Promise<{ data: RFQ | null; error: any }> => {
  const rfqData = {
    ...data,
    source_page: trackingData.sourcePage,
    source_url: trackingData.sourceUrl,
    referrer: trackingData.referrer,
    user_agent: trackingData.userAgent,
    status: 'new' as const,
  }

  const { data: insertedData, error } = await supabase
    .from('rfqs')
    .insert([rfqData])
    .select()
    .single()

  return { data: insertedData, error }
}

export const getRFQs = async (filters?: {
  status?: string
  startDate?: string
  endDate?: string
  limit?: number
}): Promise<{ data: RFQ[] | null; error: any }> => {
  let query = supabase
    .from('rfqs')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  return { data, error }
}

export const updateRFQStatus = async (
  id: string,
  status: RFQ['status']
): Promise<{ data: RFQ | null; error: any }> => {
  const { data, error } = await supabase
    .from('rfqs')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export const getRFQAnalytics = async (): Promise<{
  data: RFQAnalytics | null
  error: any
}> => {
  try {
    // Get all RFQs for analytics
    const { data: rfqs, error } = await supabase
      .from('rfqs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return { data: null, error }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Calculate analytics
    const analytics: RFQAnalytics = {
      total_rfqs: rfqs?.length || 0,
      rfqs_today: rfqs?.filter(r => new Date(r.created_at) >= today).length || 0,
      rfqs_this_week: rfqs?.filter(r => new Date(r.created_at) >= weekAgo).length || 0,
      rfqs_this_month: rfqs?.filter(r => new Date(r.created_at) >= monthAgo).length || 0,
      
      by_status: rfqs?.reduce((acc, rfq) => {
        acc[rfq.status] = (acc[rfq.status] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {},
      
      by_page: rfqs?.reduce((acc, rfq) => {
        acc[rfq.source_page] = (acc[rfq.source_page] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {},
      
      by_date: Object.entries(
        rfqs?.reduce((acc, rfq) => {
          const date = new Date(rfq.created_at).toISOString().split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}
      )
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30), // Last 30 days
      
      conversion_rate: rfqs?.length
        ? ((rfqs?.filter(r => r.status === 'won').length || 0) / rfqs.length) * 100
        : 0,
      
      average_quantity: rfqs?.length
        ? rfqs.reduce((sum, r) => sum + (r.quantity || 0), 0) / rfqs.length
        : 0,
      
      top_parts: Object.entries(
        rfqs?.reduce((acc, rfq) => {
          if (rfq.part_number) {
            acc[rfq.part_number] = (acc[rfq.part_number] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>) || {}
      )
        .map(([part, count]) => ({ part, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10), // Top 10
    }

    return { data: analytics, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getRFQsByPage = async (): Promise<{
  data: Array<{ page: string; count: number }> | null
  error: any
}> => {
  const { data, error } = await supabase
    .from('rfqs')
    .select('source_page')

  if (error) return { data: null, error }

  const pageCount = data?.reduce((acc, rfq) => {
    acc[rfq.source_page] = (acc[rfq.source_page] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const result = Object.entries(pageCount)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)

  return { data: result, error: null }
}


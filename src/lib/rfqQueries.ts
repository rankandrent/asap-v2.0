import { supabase } from './supabase'
import type { RFQ, RFQFormData, RFQAnalytics } from '../types/rfq'
import { getUserLocation, getBrowserInfo } from './locationTracking'

export const submitRFQ = async (
  data: RFQFormData,
  trackingData: {
    sourcePage: string
    sourceUrl: string
    referrer?: string
    userAgent?: string
  }
): Promise<{ data: RFQ | null; error: any }> => {
  // Get user location data
  const locationData = await getUserLocation()
  const browserInfo = getBrowserInfo()

  const rfqData = {
    ...data,
    source_page: trackingData.sourcePage,
    source_url: trackingData.sourceUrl,
    referrer: trackingData.referrer,
    user_agent: trackingData.userAgent || browserInfo.userAgent,
    status: 'new' as const,
    // Location tracking fields
    ip_address: locationData?.ip,
    city: locationData?.city,
    state: locationData?.state,
    country: locationData?.country,
    country_code: locationData?.countryCode,
    is_usa: locationData?.isUSA,
    timezone: locationData?.timezone || browserInfo.timezone,
    latitude: locationData?.latitude,
    longitude: locationData?.longitude,
    isp: locationData?.isp,
    session_id: undefined, // Optional field, can be set later if needed
  }

  // Use database function directly to bypass RLS issues
  // This function uses SECURITY DEFINER and works reliably
  let insertedData: RFQ | null = null
  let error: any = null

  console.log('Submitting RFQ via database function...', rfqData)

  const { data: functionData, error: functionError } = await supabase
    .rpc('insert_rfq', {
      p_name: rfqData.name,
      p_email: rfqData.email,
      p_source_page: rfqData.source_page,
      p_source_url: rfqData.source_url,
      p_phone: rfqData.phone || null,
      p_company: rfqData.company || null,
      p_part_number: rfqData.part_number || null,
      p_part_description: rfqData.part_description || null,
      p_quantity: rfqData.quantity || 1,
      p_target_price: rfqData.target_price || null,
      p_message: rfqData.message || null,
      p_urgency: rfqData.urgency || 'standard',
      p_referrer: rfqData.referrer || null,
      p_user_agent: rfqData.user_agent || null,
      p_ip_address: rfqData.ip_address || null,
      p_country: rfqData.country || null,
      p_session_id: rfqData.session_id || null
    })

  console.log('Function response:', { functionData, functionError })

  if (functionError) {
    error = functionError
    console.error('Database function error:', functionError)
  } else if (functionData) {
    // Supabase RPC wraps the result in an object with function name as key
    // Format: [{insert_rfq: {...actual data...}}] or {insert_rfq: {...actual data...}}
    let resultData: any = null
    
    if (Array.isArray(functionData) && functionData.length > 0) {
      // Array format: [{insert_rfq: {...}}]
      resultData = functionData[0]?.insert_rfq || functionData[0]
    } else if (functionData && typeof functionData === 'object') {
      // Object format: {insert_rfq: {...}}
      resultData = functionData.insert_rfq || functionData
    }
    
    if (resultData && resultData.id) {
      insertedData = resultData as RFQ
      console.log('RFQ inserted successfully:', insertedData)
    } else {
      error = new Error('Database function returned unexpected format')
      console.error('Function returned unexpected data:', functionData)
    }
  } else {
    error = new Error('Database function returned no data')
    console.error('Function returned no data')
  }

  // Send email notification after successful RFQ submission
  if (!error && insertedData) {
    try {
      // Call Netlify function to send email
      const siteUrl = import.meta.env.VITE_SITE_URL || 'https://asap-amatom.com'
      const emailResponse = await fetch(`${siteUrl}/.netlify/functions/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'rfq',
          rfqData: insertedData,
          trackingData: {
            sourcePage: trackingData.sourcePage,
            sourceUrl: trackingData.sourceUrl,
            referrer: trackingData.referrer,
            country: locationData?.country,
            city: locationData?.city,
            state: locationData?.state,
          },
        }),
      })

      if (!emailResponse.ok) {
        console.warn('Email notification failed, but RFQ was saved:', await emailResponse.text())
      }
    } catch (emailError) {
      // Don't fail the RFQ submission if email fails
      console.warn('Email notification error (RFQ still saved):', emailError)
    }
  }

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
        .map(([date, count]) => ({ date, count: Number(count) }))
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
        .map(([part, count]) => ({ part, count: Number(count) }))
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

export const getExitIntentEmails = async (limit: number = 50): Promise<{
  data: Array<{ id: string; name: string; email: string; phone?: string; created_at: string; source_url?: string }> | null
  error: any
}> => {
  const { data, error } = await supabase
    .from('rfqs')
    .select('id, name, email, phone, created_at, source_url')
    .eq('source_page', 'Exit Intent Popup')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return { data: null, error }

  return { data, error: null }
}


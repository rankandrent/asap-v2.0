import { supabase } from './supabase'
import type { Order, OrderSummary, OrderStatus } from '../types/order'

/**
 * Get all orders for the current user
 */
export const getUserOrders = async (): Promise<{ data: Order[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Get order summary for dashboard
 */
export const getOrderSummary = async (): Promise<{ data: OrderSummary | null; error: any }> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return { data: null, error }

    if (!orders) return { data: null, error: null }

    const summary: OrderSummary = {
      total_orders: orders.length,
      pending_orders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing').length,
      shipped_orders: orders.filter(o => o.status === 'shipped').length,
      delivered_orders: orders.filter(o => o.status === 'delivered').length,
      total_spent: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      recent_orders: orders.slice(0, 5),
    }

    return { data: summary, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Get single order by ID
 */
export const getOrderById = async (orderId: string): Promise<{ data: Order | null; error: any }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  return { data, error }
}

/**
 * Get order by order number
 */
export const getOrderByNumber = async (orderNumber: string): Promise<{ data: Order | null; error: any }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single()

  return { data, error }
}

/**
 * Get order status history
 */
export const getOrderHistory = async (orderId: string) => {
  const { data, error } = await supabase
    .from('order_status_history')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })

  return { data, error }
}

/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<{ error: any }> => {
  try {
    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (updateError) return { error: updateError }

    // Add to status history
    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status,
        notes,
      })

    return { error: historyError }
  } catch (error) {
    return { error }
  }
}

/**
 * Get orders by status
 */
export const getOrdersByStatus = async (status: OrderStatus): Promise<{ data: Order[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Search orders by customer email or order number
 */
export const searchOrders = async (query: string): Promise<{ data: Order[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .or(`customer_email.ilike.%${query}%,order_number.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20)

  return { data, error }
}


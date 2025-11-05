import { supabase } from './supabase'
import type { Order, OrderStatusHistory, OrderSummary } from '../types/order'

/**
 * Get all orders for a specific user
 */
export const getUserOrders = async (userId: string): Promise<{ data: Order[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Get guest orders by email
 */
export const getGuestOrders = async (email: string): Promise<{ data: Order[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('guest_email', email)
    .order('created_at', { ascending: false })

  return { data, error }
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
 * Get order status history
 */
export const getOrderStatusHistory = async (
  orderId: string
): Promise<{ data: OrderStatusHistory[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('order_status_history')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })

  return { data, error }
}

/**
 * Get order summary/statistics for user dashboard
 */
export const getOrderSummary = async (userId: string): Promise<{ data: OrderSummary | null; error: any }> => {
  try {
    // Get all user orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    if (!orders || orders.length === 0) {
      return {
        data: {
          total_orders: 0,
          pending_orders: 0,
          shipped_orders: 0,
          delivered_orders: 0,
          total_spent: 0,
          recent_orders: [],
        },
        error: null,
      }
    }

    // Calculate statistics
    const summary: OrderSummary = {
      total_orders: orders.length,
      pending_orders: orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length,
      shipped_orders: orders.filter((o) => o.status === 'shipped').length,
      delivered_orders: orders.filter((o) => o.status === 'delivered').length,
      total_spent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      recent_orders: orders.slice(0, 5), // Last 5 orders
    }

    return { data: summary, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Create a new order
 */
export const createOrder = async (orderData: Partial<Order>): Promise<{ data: Order | null; error: any }> => {
  const { data, error } = await supabase.from('orders').insert([orderData]).select().single()

  return { data, error }
}

/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  notes?: string
): Promise<{ error: any }> => {
  const { error: orderError } = await supabase.from('orders').update({ status }).eq('id', orderId)

  if (orderError) return { error: orderError }

  // Add to status history
  const { error: historyError } = await supabase.from('order_status_history').insert([
    {
      order_id: orderId,
      status,
      notes: notes || `Order status updated to ${status}`,
    },
  ])

  return { error: historyError }
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


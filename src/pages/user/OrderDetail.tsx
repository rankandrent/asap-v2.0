import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById, getOrderStatusHistory } from '../../lib/orderQueries'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Truck, ArrowLeft, Loader2 } from 'lucide-react'
import type { Order, OrderStatusHistory } from '../../types/order'
import SEO from '../../components/common/SEO'

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [history, setHistory] = useState<OrderStatusHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    if (!orderId) return

    setLoading(true)
    const { data: orderData } = await getOrderById(orderId)
    const { data: historyData } = await getOrderStatusHistory(orderId)

    if (orderData) setOrder(orderData)
    if (historyData) setHistory(historyData)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link to="/dashboard/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`Order #${order.order_number} - ASAP-Amatom.com`}
        description={`Track your order #${order.order_number}`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/dashboard/orders">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge className="text-lg px-4 py-2">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.part_number}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">${item.unit_price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.map((h, idx) => (
                    <div key={h.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          idx === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}>
                          {idx === 0 ? '✓' : '○'}
                        </div>
                        {idx < history.length - 1 && <div className="w-px h-full bg-gray-300" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium capitalize">{h.status}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(h.created_at).toLocaleString()}
                        </p>
                        {h.notes && <p className="text-sm text-gray-600 mt-1">{h.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tracking */}
            {order.tracking_number && (
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4" />
                      <span className="font-medium">{order.carrier}</span>
                    </div>
                    <p className="text-sm text-gray-600">Tracking: {order.tracking_number}</p>
                    <Button size="sm" className="w-full mt-2">
                      Track Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p>{order.shipping_address.street}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}


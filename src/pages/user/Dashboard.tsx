import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, TruckIcon, CheckCircle, Clock, DollarSign, ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../contexts/AuthContext'
import { getOrderSummary } from '../../lib/orderQueries'
import type { OrderSummary } from '../../types/order'
import SEO from '../../components/common/SEO'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSummary()
  }, [])

  const loadSummary = async () => {
    const { data } = await getOrderSummary()
    setSummary(data)
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      processing: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
      shipped: { color: 'bg-indigo-100 text-indigo-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    }
    const variant = variants[status] || variants.pending
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Customer'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <>
      <SEO
        title="My Dashboard | ASAPAmatom.com"
        description="View your orders, track shipments, and manage your account."
        canonical="https://www.asapamatom.com/dashboard"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-gray-600">Here's what's happening with your orders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {summary?.total_orders || 0}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {summary?.pending_orders || 0}
                    </p>
                  </div>
                  <div className="rounded-full bg-yellow-100 p-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Shipped</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">
                      {summary?.shipped_orders || 0}
                    </p>
                  </div>
                  <div className="rounded-full bg-indigo-100 p-3">
                    <TruckIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      ${summary?.total_spent.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Recent Orders</CardTitle>
                <Link to="/dashboard/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {summary?.recent_orders && summary.recent_orders.length > 0 ? (
                <div className="space-y-4">
                  {summary.recent_orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{order.order_number}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {item.quantity}x {item.part_number}
                            </span>
                            <span className="font-medium text-gray-900">
                              ${item.total.toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="font-semibold text-gray-900">
                          Total: ${order.total.toFixed(2)}
                        </span>
                        <Link to={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start shopping to see your orders here
                  </p>
                  <Link to="/categories">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link to="/dashboard/orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Order History</h3>
                  <p className="text-sm text-gray-600">View all your past orders</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/profile">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Profile Settings</h3>
                  <p className="text-sm text-gray-600">Manage your account details</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/categories">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Browse Products</h3>
                  <p className="text-sm text-gray-600">Explore our catalog</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}


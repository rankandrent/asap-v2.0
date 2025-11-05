import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getOrderSummary } from '../../lib/orderQueries'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  DollarSign,
  Eye,
  RefreshCcw,
  Loader2,
  ShoppingCart,
} from 'lucide-react'
import type { OrderSummary, Order } from '../../types/order'
import SEO from '../../components/common/SEO'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [user])

  const loadDashboard = async () => {
    if (!user) return

    setLoading(true)
    const { data } = await getOrderSummary(user.id)
    if (data) {
      setSummary(data)
    }
    setLoading(false)
  }

  const getStatusBadge = (status: Order['status']) => {
    const variants: Record<string, { color: string; icon: any }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { color: 'bg-purple-100 text-purple-800', icon: Package },
      shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: Clock },
    }

    const variant = variants[status] || variants.pending
    const Icon = variant.icon

    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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

  return (
    <>
      <SEO
        title="My Dashboard - ASAPAmatom.com"
        description="View your order history, track shipments, and manage your account."
        canonical="https://www.asapamatom.com/dashboard"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.full_name || 'Customer'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's an overview of your account</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{summary?.total_orders || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{summary?.pending_orders || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900">{summary?.shipped_orders || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${summary?.total_spent?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/dashboard/orders">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {summary?.recent_orders && summary.recent_orders.length > 0 ? (
              <div className="space-y-4">
                {summary.recent_orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.order_number}</h3>
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

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">
                        {order.items.length} item(s)
                      </p>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-700">
                            • {item.quantity}x {item.part_number}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            + {order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${order.total.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/dashboard/orders/${order.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {order.status === 'delivered' && (
                          <Button size="sm" variant="outline">
                            <RefreshCcw className="h-4 w-4 mr-1" />
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start browsing our catalog to place your first order
                </p>
                <Link to="/categories">
                  <Button>
                    Browse Parts
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/dashboard/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Package className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Order History</h3>
                <p className="text-sm text-gray-600">View all your orders</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Profile Settings</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/categories">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <ShoppingCart className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Browse Parts</h3>
                <p className="text-sm text-gray-600">Find what you need</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  )
}


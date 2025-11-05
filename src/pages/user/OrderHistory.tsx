import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { getUserOrders, searchOrders } from '../../lib/orderQueries'
import type { Order } from '../../types/order'
import SEO from '../../components/common/SEO'

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const loadOrders = async () => {
    const { data } = await getUserOrders()
    if (data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item =>
          item.part_number.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    setFilteredOrders(filtered)
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
        title="Order History | ASAPAmatom.com"
        description="View all your orders and track shipments."
        canonical="https://www.asapamatom.com/dashboard/orders"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
            <p className="text-gray-600">View and track all your orders</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by order number or part number..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>
                  Showing {filteredOrders.length} of {orders.length} orders
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Order #{order.order_number}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium text-gray-900">
                              {item.quantity}x {item.part_number}
                            </span>
                            {item.description && (
                              <span className="text-gray-500 ml-2">- {item.description}</span>
                            )}
                          </div>
                          <span className="text-gray-900">${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>

                    {/* Tracking Info */}
                    {order.tracking_number && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-900">
                          <span className="font-medium">Tracking:</span>{' '}
                          {order.tracking_number}
                          {order.carrier && ` (${order.carrier})`}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-sm text-gray-600">Total: </span>
                        <span className="text-xl font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                      <Link to={`/dashboard/orders/${order.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Start shopping to see your orders here'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Link to="/categories">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Browse Products
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}


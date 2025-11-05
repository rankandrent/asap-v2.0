import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getUserOrders } from '../../lib/orderQueries'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Eye, Loader2, Package } from 'lucide-react'
import type { Order } from '../../types/order'
import SEO from '../../components/common/SEO'

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [user])

  const loadOrders = async () => {
    if (!user) return

    setLoading(true)
    const { data } = await getUserOrders(user.id)
    if (data) {
      setOrders(data)
    }
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

  return (
    <>
      <SEO
        title="Order History - ASAPAmatom.com"
        description="View all your past orders and track shipments"
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
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
                    <Badge>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">{order.items.length} item(s)</p>
                    {order.items.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-700">
                        • {item.quantity}x {item.part_number}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500">+ {order.items.length - 2} more</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-lg font-bold">${order.total.toLocaleString()}</p>
                    </div>
                    <Link to={`/dashboard/orders/${order.id}`}>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">Start browsing to place your first order</p>
              <Link to="/categories">
                <Button>Browse Parts</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}


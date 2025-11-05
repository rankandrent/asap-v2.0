import { useEffect, useState } from 'react'
import { getRFQs, getRFQAnalytics, updateRFQStatus, getRFQsByPage } from '../../lib/rfqQueries'
import type { RFQ, RFQAnalytics } from '../../types/rfq'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

export default function RFQManager() {
  const [rfqs, setRFQs] = useState<RFQ[]>([])
  const [analytics, setAnalytics] = useState<RFQAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'quoted' | 'won' | 'lost'>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')

  useEffect(() => {
    loadData()
  }, [filter, dateRange])

  const loadData = async () => {
    setLoading(true)
    try {
      // Get RFQs
      const filterParams: any = {}
      if (filter !== 'all') {
        filterParams.status = filter
      }

      if (dateRange === 'today') {
        filterParams.startDate = new Date().toISOString().split('T')[0]
      } else if (dateRange === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        filterParams.startDate = weekAgo.toISOString().split('T')[0]
      } else if (dateRange === 'month') {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        filterParams.startDate = monthAgo.toISOString().split('T')[0]
      }

      const { data: rfqData } = await getRFQs(filterParams)
      const { data: analyticsData } = await getRFQAnalytics()

      setRFQs(rfqData || [])
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading RFQ data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: RFQ['status']) => {
    try {
      await updateRFQStatus(id, status)
      loadData() // Reload data
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      quoted: 'bg-purple-500',
      won: 'bg-green-500',
      lost: 'bg-red-500',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      standard: 'default',
      urgent: 'secondary',
      critical: 'destructive',
    }
    return variants[urgency as keyof typeof variants] || 'default'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading RFQ data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RFQ Manager</h1>
          <p className="text-gray-600 mt-1">Track and manage all quote requests</p>
        </div>
        <Button onClick={loadData}>🔄 Refresh</Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total RFQs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{analytics.total_rfqs}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{analytics.rfqs_today}</div>
              <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{analytics.rfqs_this_week}</div>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {analytics.conversion_rate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Won / Total</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Breakdown */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(analytics.by_status).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                  <span className="font-medium capitalize">{status}:</span>
                  <span className="font-bold text-lg">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RFQs by Page Source */}
      {analytics && analytics.by_page && Object.keys(analytics.by_page).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📄 RFQs by Source Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.by_page)
                .sort((a, b) => b[1] - a[1])
                .map(([page, count]) => (
                  <div key={page} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{page}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(count / analytics.total_rfqs) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold text-sm w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Parts Requested */}
      {analytics && analytics.top_parts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🔧 Top 10 Most Requested Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.top_parts.map((item, index) => (
                <div key={item.part} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-mono text-sm font-medium">{item.part}</span>
                  </div>
                  <Badge variant="secondary">{item.count} requests</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Status:</label>
          <div className="flex gap-2">
            {(['all', 'new', 'contacted', 'quoted', 'won', 'lost'] as const).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range:</label>
          <div className="flex gap-2">
            {(['today', 'week', 'month', 'all'] as const).map((range) => (
              <Button
                key={range}
                size="sm"
                variant={dateRange === range ? 'default' : 'outline'}
                onClick={() => setDateRange(range)}
              >
                {range === 'today' ? 'Today' : range === 'week' ? '7 Days' : range === 'month' ? '30 Days' : 'All Time'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* RFQs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent RFQs ({rfqs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rfqs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg font-medium">No RFQs found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Part Number</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Urgency</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Source</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(rfq.created_at).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(rfq.created_at).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{rfq.name}</div>
                        <div className="text-xs text-gray-500">{rfq.email}</div>
                        {rfq.company && (
                          <div className="text-xs text-gray-400">{rfq.company}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {rfq.part_number || 'N/A'}
                        </code>
                      </td>
                      <td className="px-4 py-3 font-medium">{rfq.quantity}</td>
                      <td className="px-4 py-3">
                        <Badge variant={getUrgencyBadge(rfq.urgency) as any}>
                          {rfq.urgency}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {rfq.source_page}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={rfq.status}
                          onChange={(e) => handleStatusChange(rfq.id, e.target.value as RFQ['status'])}
                          className={`px-2 py-1 rounded text-white text-xs font-medium ${getStatusColor(rfq.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Open email client
                            window.location.href = `mailto:${rfq.email}?subject=Re: RFQ for ${rfq.part_number}`
                          }}
                        >
                          📧 Email
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart - RFQs by Date */}
      {analytics && analytics.by_date.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📈 RFQs Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.by_date.slice(-30).map((item) => (
                <div key={item.date} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-24">{item.date}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.max((item.count / Math.max(...analytics.by_date.map(d => d.count))) * 100, 10)}%`,
                      }}
                    >
                      <span className="text-white text-xs font-bold">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


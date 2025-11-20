import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { 
  TrendingUp, 
  FileText, 
  Eye, 
  Search, 
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  MessageSquare
} from "lucide-react"
import { getRFQAnalytics, getRFQsByPage, getExitIntentEmails } from "../../lib/rfqQueries"
import type { RFQAnalytics } from "../../types/rfq"

export default function Dashboard() {
  const [rfqAnalytics, setRfqAnalytics] = useState<RFQAnalytics | null>(null)
  const [rfqsByPage, setRfqsByPage] = useState<Array<{ page: string; count: number }>>([])
  const [exitIntentEmails, setExitIntentEmails] = useState<Array<{ id: string; name: string; email: string; phone?: string; created_at: string; source_url?: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRFQData = async () => {
      try {
        setLoading(true)
        console.log('Fetching RFQ data...')
        
        const [analyticsResult, pageResult, exitIntentResult] = await Promise.all([
          getRFQAnalytics(),
          getRFQsByPage(),
          getExitIntentEmails(50)
        ])
        
        console.log('Analytics result:', analyticsResult)
        console.log('Page result:', pageResult)
        console.log('Exit intent result:', exitIntentResult)
        
        if (analyticsResult.error) {
          console.error('Analytics error:', analyticsResult.error)
        }
        
        if (pageResult.error) {
          console.error('Page result error:', pageResult.error)
        }
        
        if (exitIntentResult.error) {
          console.error('Exit intent error:', exitIntentResult.error)
        }
        
        if (analyticsResult.data) {
          console.log('Setting RFQ analytics:', analyticsResult.data)
          setRfqAnalytics(analyticsResult.data)
        } else {
          console.warn('No analytics data received')
        }
        
        if (pageResult.data) {
          console.log('Setting RFQs by page:', pageResult.data)
          setRfqsByPage(pageResult.data)
        } else {
          console.warn('No page data received')
        }
        
        if (exitIntentResult.data) {
          console.log('Setting exit intent emails:', exitIntentResult.data)
          setExitIntentEmails(exitIntentResult.data)
        } else {
          console.warn('No exit intent data received')
        }
      } catch (error) {
        console.error('Error fetching RFQ data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRFQData()
  }, [])
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your website performance and AI automations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Parts</p>
                <p className="text-3xl font-bold text-gray-900">500,000+</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Updated daily
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Page Views</p>
                <p className="text-3xl font-bold text-gray-900">45,234</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% this week
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">SEO Score</p>
                <p className="text-3xl font-bold text-gray-900">94/100</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Excellent
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">AI Blog Posts</p>
                <p className="text-3xl font-bold text-gray-900">127</p>
                <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Auto-generated
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RFQ Statistics Card */}
        <Card className="border-2 border-indigo-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total RFQs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : (rfqAnalytics?.total_rfqs || 0).toLocaleString()}
                </p>
                <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {rfqAnalytics?.rfqs_today || 0} today
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Mail className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent AI Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent AI Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">Blog Post Published</p>
                  <p className="text-xs text-gray-600 mt-1">
                    "Top 10 Aerospace Fasteners for 2024" - 1,245 words
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">SEO Meta Updated</p>
                  <p className="text-xs text-gray-600 mt-1">
                    250 product pages optimized automatically
                  </p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">Content Generation</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Product descriptions updated for Brass Standoffs category
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">Scheduled Post</p>
                  <p className="text-xs text-gray-600 mt-1">
                    "How to Choose the Right Standoff" - Scheduled for tomorrow 10:00 AM
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Upcoming</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                <FileText className="h-6 w-6 mb-2" />
                <p className="font-semibold text-sm">New Blog Post</p>
              </button>
              <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                <Search className="h-6 w-6 mb-2" />
                <p className="font-semibold text-sm">Update SEO</p>
              </button>
              <button className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                <Activity className="h-6 w-6 mb-2" />
                <p className="font-semibold text-sm">Run AI Scan</p>
              </button>
              <button className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                <Clock className="h-6 w-6 mb-2" />
                <p className="font-semibold text-sm">Schedule Task</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RFQ Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFQ Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600" />
              RFQ Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading RFQ data...</div>
            ) : rfqAnalytics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Total RFQs</p>
                    <p className="text-2xl font-bold text-gray-900">{rfqAnalytics.total_rfqs.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{rfqAnalytics.rfqs_this_week}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{rfqAnalytics.rfqs_this_month}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Today</p>
                    <p className="text-2xl font-bold text-gray-900">{rfqAnalytics.rfqs_today}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">By Status</p>
                  <div className="space-y-2">
                    {Object.entries(rfqAnalytics.by_status).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700 capitalize">{status}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No RFQ data available</div>
            )}
          </CardContent>
        </Card>

        {/* RFQs by Page */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              RFQs by Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading page data...</div>
            ) : rfqsByPage.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {rfqsByPage.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.page}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.count} RFQ{item.count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="ml-4">
                      <span className="text-lg font-bold text-indigo-600">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No RFQ submissions yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exit Intent Emails Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-red-600" />
            Exit Intent Form Emails
            {exitIntentEmails.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                {exitIntentEmails.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading exit intent emails...</div>
          ) : exitIntentEmails.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {exitIntentEmails.map((item) => (
                <div key={item.id} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-red-600" />
                        <a 
                          href={`mailto:${item.email}`}
                          className="font-semibold text-gray-900 hover:text-red-600 transition-colors"
                        >
                          {item.email}
                        </a>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Name:</span> {item.name}
                      </p>
                      {item.phone && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Phone:</span> {item.phone}
                        </p>
                      )}
                      {item.source_url && (
                        <p className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Page:</span>{' '}
                          <a 
                            href={item.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {item.source_url.length > 60 ? item.source_url.substring(0, 60) + '...' : item.source_url}
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No exit intent emails yet</p>
              <p className="text-sm text-gray-400 mt-1">Emails will appear here when users fill the exit intent form</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Website Status */}
      <Card>
        <CardHeader>
          <CardTitle>Website Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Server Status</p>
              <p className="text-sm text-green-600">Online & Healthy</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Database</p>
              <p className="text-sm text-green-600">Connected</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">AI Services</p>
              <p className="text-sm text-green-600">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


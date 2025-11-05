import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users,
  MousePointer,
  Clock,
  Globe
} from "lucide-react"

export default function Analytics() {
  const stats = [
    { label: "Total Page Views", value: "145,234", change: "+12%", icon: Eye, color: "blue" },
    { label: "Unique Visitors", value: "34,892", change: "+8%", icon: Users, color: "green" },
    { label: "Avg. Session Time", value: "4:32", change: "+5%", icon: Clock, color: "purple" },
    { label: "Click Rate", value: "3.2%", change: "+15%", icon: MousePointer, color: "orange" },
  ]

  const topPages = [
    { page: "/parts/17300-B-0256-15", views: 12458, bounce: "32%" },
    { page: "/category/standoffs", views: 9821, bounce: "28%" },
    { page: "/", views: 8934, bounce: "41%" },
    { page: "/category/brass-standoffs", views: 6543, bounce: "35%" },
    { page: "/search", views: 5234, bounce: "45%" },
  ]

  const trafficSources = [
    { source: "Google Organic", visitors: 45234, percentage: 52 },
    { source: "Direct", visitors: 23456, percentage: 27 },
    { source: "Referral", visitors: 12345, percentage: 14 },
    { source: "Social Media", visitors: 5432, percentage: 6 },
    { source: "Email", visitors: 1234, percentage: 1 },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Monitor your website performance and user behavior</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={`border-2 border-${stat.color}-100`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} vs last week
                    </p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <Icon className={`h-8 w-8 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Traffic Overview (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[45, 52, 48, 58, 62, 71, 68].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                    <span className="text-sm text-gray-600">{source.visitors.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Top Performing Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Page URL</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Bounce Rate</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-900">{page.page}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">{page.bounce}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SEO Performance */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">94/100</div>
              <p className="text-sm text-gray-600">SEO Score</p>
              <p className="text-xs text-green-600 mt-2">Excellent</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-1">2,847</div>
              <p className="text-sm text-gray-600">Indexed Pages</p>
              <p className="text-xs text-blue-600 mt-2">+124 this month</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-1">1,234</div>
              <p className="text-sm text-gray-600">Backlinks</p>
              <p className="text-xs text-purple-600 mt-2">High quality</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { 
  TrendingUp, 
  FileText, 
  Eye, 
  Search, 
  Activity,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

export default function Dashboard() {
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


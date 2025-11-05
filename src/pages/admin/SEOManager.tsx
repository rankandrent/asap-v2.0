import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { 
  Search, 
  FileText, 
  Globe,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Save
} from "lucide-react"

export default function SEOManager() {
  const [loading, setLoading] = useState(false)

  const seoMetrics = [
    { label: "Overall SEO Score", value: "94/100", status: "excellent", color: "green" },
    { label: "Mobile Friendly", value: "98/100", status: "excellent", color: "green" },
    { label: "Page Speed", value: "87/100", status: "good", color: "blue" },
    { label: "Meta Tags", value: "100%", status: "complete", color: "green" },
  ]

  const pages = [
    { 
      url: "/", 
      title: "ASAPAmatom.com - Official Amatom Parts Catalog", 
      status: "optimized",
      score: 95 
    },
    { 
      url: "/category/standoffs", 
      title: "Standoffs - Amatom Parts", 
      status: "optimized",
      score: 92 
    },
    { 
      url: "/parts/17300-B-0256-15", 
      title: "17300-B-0256-15 - Brass Standoff", 
      status: "needs-update",
      score: 78 
    },
  ]

  const handleOptimize = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Management</h1>
          <p className="text-gray-600">Optimize your website for search engines</p>
        </div>
        <Button 
          onClick={handleOptimize}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run AI Optimization
            </>
          )}
        </Button>
      </div>

      {/* SEO Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {seoMetrics.map((metric) => (
          <Card key={metric.label} className={`border-2 border-${metric.color}-100`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <Badge 
                    className={`mt-2 bg-${metric.color}-100 text-${metric.color}-700`}
                  >
                    {metric.status}
                  </Badge>
                </div>
                <CheckCircle className={`h-8 w-8 text-${metric.color}-600`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Global SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Title
            </label>
            <Input 
              defaultValue="ASAPAmatom.com - Official Amatom Parts Catalog"
              placeholder="Enter site title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              defaultValue="Browse 500,000+ Amatom aerospace and industrial parts. Standoffs, Fasteners, and more."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords
            </label>
            <Input 
              defaultValue="Amatom parts, aerospace parts, industrial parts, standoffs"
              placeholder="Enter keywords"
            />
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Page-by-Page SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Page SEO Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pages.map((page) => (
              <div 
                key={page.url}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-gray-600">{page.url}</span>
                    <Badge 
                      className={
                        page.status === "optimized" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {page.status === "optimized" ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Optimized</>
                      ) : (
                        <><AlertCircle className="h-3 w-3 mr-1" /> Needs Update</>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-900">{page.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{page.score}</p>
                    <p className="text-xs text-gray-500">SEO Score</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sitemap & Robots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sitemap.xml</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Last generated: 2 hours ago
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline" className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Robots.txt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Status: Active & Configured
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


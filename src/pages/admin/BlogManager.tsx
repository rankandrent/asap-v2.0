import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { 
  FileText, 
  Plus, 
  Bot,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Eye
} from "lucide-react"

export default function BlogManager() {
  const [showNewBlogModal, setShowNewBlogModal] = useState(false)
  const [formData, setFormData] = useState({
    topic: "",
    prompt: "",
    scheduledDate: "",
    scheduledTime: "",
    keywords: "",
    wordCount: "1500"
  })

  const blogs = [
    {
      id: 1,
      title: "Top 10 Aerospace Fasteners for 2024",
      status: "published",
      date: "2024-01-15",
      views: 1245,
      keywords: "aerospace, fasteners, 2024"
    },
    {
      id: 2,
      title: "Complete Guide to Brass Standoffs",
      status: "scheduled",
      date: "2024-01-20",
      scheduledFor: "2024-01-20 10:00 AM",
      keywords: "brass standoffs, guide"
    },
    {
      id: 3,
      title: "How to Choose the Right Standoff",
      status: "draft",
      date: "2024-01-18",
      keywords: "standoff selection"
    },
    {
      id: 4,
      title: "Aluminum vs Stainless Steel Parts",
      status: "generating",
      date: "2024-01-19",
      keywords: "aluminum, stainless steel, comparison"
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating AI Blog:", formData)
    setShowNewBlogModal(false)
    // Here you'll integrate with ChatGPT API
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; text: string }> = {
      published: { color: "green", icon: CheckCircle, text: "Published" },
      scheduled: { color: "blue", icon: Clock, text: "Scheduled" },
      draft: { color: "gray", icon: Edit, text: "Draft" },
      generating: { color: "purple", icon: Bot, text: "AI Generating..." },
    }

    const config = statusConfig[status] || statusConfig.draft
    const Icon = config.icon

    return (
      <Badge className={`bg-${config.color}-100 text-${config.color}-700`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Blog Manager</h1>
          <p className="text-gray-600">Automate blog creation with AI</p>
        </div>
        <Button 
          onClick={() => setShowNewBlogModal(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New AI Blog Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 border-green-100">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">127</p>
            <p className="text-sm text-gray-600">Published Blogs</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-600">Scheduled Posts</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardContent className="pt-6 text-center">
            <Bot className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-600">AI Generating</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100">
          <CardContent className="pt-6 text-center">
            <Edit className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Blog List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            All Blog Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {blogs.map((blog) => (
              <div 
                key={blog.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                    {getStatusBadge(blog.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📅 {blog.date}</span>
                    {blog.views && <span>👁️ {blog.views} views</span>}
                    {blog.scheduledFor && <span>⏰ {blog.scheduledFor}</span>}
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      Keywords: {blog.keywords}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Blog Modal */}
      {showNewBlogModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  Create AI Blog Post
                </CardTitle>
                <button 
                  onClick={() => setShowNewBlogModal(false)}
                  className="text-white hover:bg-white/20 rounded p-1"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Blog Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Topic / Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Complete Guide to Choosing Aerospace Fasteners"
                    required
                  />
                </div>

                {/* AI Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Writing Prompt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    placeholder="Write a comprehensive guide about aerospace fasteners. Include types, materials, applications, and selection criteria. Make it technical but accessible. Target audience: engineers and procurement professionals."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Be specific about tone, style, and target audience for better results
                  </p>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <Input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="aerospace fasteners, bolts, screws, engineering"
                  />
                </div>

                {/* Word Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Word Count
                  </label>
                  <select
                    value={formData.wordCount}
                    onChange={(e) => setFormData({ ...formData, wordCount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="500">500 words (Short)</option>
                    <option value="1000">1000 words (Medium)</option>
                    <option value="1500">1500 words (Long)</option>
                    <option value="2000">2000 words (Comprehensive)</option>
                    <option value="3000">3000+ words (Ultimate Guide)</option>
                  </select>
                </div>

                {/* Scheduling */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Date
                    </label>
                    <Input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Time
                    </label>
                    <Input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        How it works:
                      </p>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>AI will generate the blog post based on your prompt</li>
                        <li>Content will be optimized for SEO automatically</li>
                        <li>Post will be published at scheduled time (or immediately)</li>
                        <li>You can review and edit before publishing</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewBlogModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


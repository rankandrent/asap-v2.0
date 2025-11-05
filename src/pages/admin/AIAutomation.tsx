import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { 
  Bot, 
  Zap, 
  FileText, 
  Search, 
  Image,
  Mail,
  Database,
  Play,
  Pause,
  Settings as SettingsIcon
} from "lucide-react"

export default function AIAutomation() {
  const automations = [
    {
      id: 1,
      name: "Auto Blog Generation",
      description: "Automatically generate and publish blog posts based on scheduled topics",
      status: "active",
      icon: FileText,
      color: "blue",
      lastRun: "2 hours ago",
      nextRun: "Tomorrow 10:00 AM"
    },
    {
      id: 2,
      name: "SEO Meta Optimizer",
      description: "Automatically optimize meta tags, descriptions, and keywords for all pages",
      status: "active",
      icon: Search,
      color: "purple",
      lastRun: "5 hours ago",
      nextRun: "In 3 hours"
    },
    {
      id: 3,
      name: "Product Description Generator",
      description: "Generate detailed descriptions for parts with missing or incomplete content",
      status: "active",
      icon: Database,
      color: "green",
      lastRun: "1 day ago",
      nextRun: "Weekly on Monday"
    },
    {
      id: 4,
      name: "Email Campaign Writer",
      description: "Create personalized email campaigns for different customer segments",
      status: "paused",
      icon: Mail,
      color: "orange",
      lastRun: "3 days ago",
      nextRun: "Paused"
    },
    {
      id: 5,
      name: "Social Media Content",
      description: "Generate social media posts about new products and industry news",
      status: "inactive",
      icon: Image,
      color: "pink",
      lastRun: "Never",
      nextRun: "Not scheduled"
    },
  ]

  const workflowTemplates = [
    {
      name: "Category Content Generator",
      description: "Auto-generate detailed content for each category page",
      icon: Zap
    },
    {
      name: "Related Products AI",
      description: "Intelligently suggest related products using AI",
      icon: Bot
    },
    {
      name: "FAQ Generator",
      description: "Create comprehensive FAQs for each product",
      icon: FileText
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Automations</h1>
          <p className="text-gray-600">Manage automated AI workflows and tasks</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Bot className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 border-green-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">3</div>
            <p className="text-sm text-gray-600">Active Automations</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-orange-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">1</div>
            <p className="text-sm text-gray-600">Paused</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-blue-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">842</div>
            <p className="text-sm text-gray-600">Tasks Completed</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-purple-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">98%</div>
            <p className="text-sm text-gray-600">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Automations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Active Automations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {automations.map((automation) => {
              const Icon = automation.icon
              return (
                <div 
                  key={automation.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 bg-${automation.color}-100 rounded-lg`}>
                      <Icon className={`h-6 w-6 text-${automation.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{automation.name}</h3>
                        <Badge 
                          className={
                            automation.status === "active" 
                              ? "bg-green-100 text-green-700" 
                              : automation.status === "paused"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {automation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{automation.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>⏱️ Last run: {automation.lastRun}</span>
                        <span>📅 Next run: {automation.nextRun}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {automation.status === "active" ? (
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-green-600">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <SettingsIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            Automation Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workflowTemplates.map((template, index) => {
              const Icon = template.icon
              return (
                <div 
                  key={index}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Icon className="h-8 w-8 text-gray-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Configuration */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI Model Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                <option>GPT-4 Turbo (Recommended)</option>
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3 Opus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creativity Level
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                <option>Balanced (0.7)</option>
                <option>Conservative (0.3)</option>
                <option>Creative (1.0)</option>
              </select>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Usage Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">12,458</p>
                <p className="text-xs text-gray-600">Tokens Used</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">$3.42</p>
                <p className="text-xs text-gray-600">Cost This Month</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">156</p>
                <p className="text-xs text-gray-600">API Calls</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


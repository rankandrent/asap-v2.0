import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Plus,
  FileText,
  Search,
  Mail,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export default function Scheduler() {
  const [showNewTask, setShowNewTask] = useState(false)

  const scheduledTasks = [
    {
      id: 1,
      title: "Blog: Complete Guide to Choosing Fasteners",
      type: "blog",
      scheduledFor: "2024-01-20 10:00 AM",
      status: "scheduled",
      recurrence: "Once"
    },
    {
      id: 2,
      title: "SEO Optimization - All Product Pages",
      type: "seo",
      scheduledFor: "2024-01-22 02:00 AM",
      status: "scheduled",
      recurrence: "Weekly"
    },
    {
      id: 3,
      title: "Email Campaign - New Products",
      type: "email",
      scheduledFor: "2024-01-21 09:00 AM",
      status: "scheduled",
      recurrence: "Monthly"
    },
    {
      id: 4,
      title: "Blog: Top 10 Standoffs for 2024",
      type: "blog",
      scheduledFor: "2024-01-19 08:30 AM",
      status: "completed",
      recurrence: "Once"
    },
  ]

  const taskTypes = [
    { value: "blog", label: "AI Blog Post", icon: FileText, color: "blue" },
    { value: "seo", label: "SEO Optimization", icon: Search, color: "purple" },
    { value: "email", label: "Email Campaign", icon: Mail, color: "green" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Scheduler</h1>
          <p className="text-gray-600">Schedule automated tasks and content publishing</p>
        </div>
        <Button 
          onClick={() => setShowNewTask(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-100">
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-600">Scheduled Tasks</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">142</p>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardContent className="pt-6 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-600">Today</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledTasks.map((task) => {
              const taskType = taskTypes.find(t => t.value === task.type)
              const Icon = taskType?.icon || FileText
              
              return (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 bg-${taskType?.color}-100 rounded-lg`}>
                      <Icon className={`h-5 w-5 text-${taskType?.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <Badge 
                          className={
                            task.status === "completed" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {task.status === "completed" ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Completed</>
                          ) : (
                            <><Clock className="h-3 w-3 mr-1" /> Scheduled</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {task.scheduledFor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {task.recurrence}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                      Cancel
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Schedule Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Schedule Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left">
              <FileText className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Daily Blog Post</h3>
              <p className="text-sm text-gray-600">Auto-generate and publish blog daily</p>
            </button>

            <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-left">
              <Search className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Weekly SEO Scan</h3>
              <p className="text-sm text-gray-600">Optimize all pages every week</p>
            </button>

            <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left">
              <Mail className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Monthly Newsletter</h3>
              <p className="text-sm text-gray-600">Send newsletter on 1st of month</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle>Schedule New Task</CardTitle>
                <button 
                  onClick={() => setShowNewTask(false)}
                  className="text-white hover:bg-white/20 rounded p-1"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="blog">AI Blog Post</option>
                  <option value="seo">SEO Optimization</option>
                  <option value="email">Email Campaign</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date & Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="time" className="px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recurrence
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Once</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Schedule Task
                </Button>
                <Button variant="outline" onClick={() => setShowNewTask(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


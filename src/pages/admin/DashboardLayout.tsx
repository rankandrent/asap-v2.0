import { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Settings, 
  BarChart3, 
  Bot, 
  Calendar,
  Menu,
  X,
  LogOut,
  Mail
} from "lucide-react"

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { path: "/admin/rfqs", icon: Mail, label: "RFQ Manager" },
    { path: "/admin/seo", icon: Search, label: "SEO Management" },
    { path: "/admin/blogs", icon: FileText, label: "AI Blog Manager" },
    { path: "/admin/automation", icon: Bot, label: "AI Automations" },
    { path: "/admin/schedule", icon: Calendar, label: "Scheduler" },
    { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              ASAP-Amatom Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View Website →
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-gray-200 
            transition-transform duration-300 z-20
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path, item.exact)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${active 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* AI Status Indicator */}
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-sm">AI Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Active & Ready</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}


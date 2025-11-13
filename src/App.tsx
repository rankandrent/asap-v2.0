import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { AuthProvider } from "./contexts/AuthContext"
import { ManufacturerProvider } from "./contexts/ManufacturerContext"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import AISmartChatbot from "./components/common/AISmartChatbot"
import ExitIntentPopup from "./components/common/ExitIntentPopup"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import HomePage from "./pages/HomePage"
import CategoryPage from "./pages/CategoryPage"
import SubcategoryPage from "./pages/SubcategoryPage"
import PartDetailPage from "./pages/PartDetailPage"
import SearchPage from "./pages/SearchPage"
import AboutUsPage from "./pages/AboutUsPage"
import NotFound from "./pages/NotFound"

// Auth Pages
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"

// User Dashboard Pages
import UserDashboard from "./pages/user/Dashboard"
import OrderHistory from "./pages/user/OrderHistory"
import OrderDetail from "./pages/user/OrderDetail"
import ProfileSettings from "./pages/user/ProfileSettings"

// Admin Pages
import DashboardLayout from "./pages/admin/DashboardLayout"
import Dashboard from "./pages/admin/Dashboard"
import RFQManager from "./pages/admin/RFQManager"
import SEOManager from "./pages/admin/SEOManager"
import BlogManager from "./pages/admin/BlogManager"
import AIAutomation from "./pages/admin/AIAutomation"
import Scheduler from "./pages/admin/Scheduler"
import Analytics from "./pages/admin/Analytics"
import Settings from "./pages/admin/Settings"

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ManufacturerProvider>
          <Routes>
            {/* Auth Routes (No Layout) */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<SignUp />} />

            {/* User Dashboard Routes (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <UserDashboard />
                    </main>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <OrderHistory />
                    </main>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders/:orderId"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <OrderDetail />
                    </main>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <ProfileSettings />
                    </main>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="rfqs" element={<RFQManager />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="blogs" element={<BlogManager />} />
              <Route path="automation" element={<AIAutomation />} />
              <Route path="schedule" element={<Scheduler />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Public Website Routes */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/categories" element={<HomePage />} />
                      <Route path="/categories/:categorySlug" element={<CategoryPage />} />
                      <Route
                        path="/categories/:categorySlug/:subcategorySlug"
                        element={<SubcategoryPage />}
                      />
                      <Route path="/parts/:productname" element={<PartDetailPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/about-us" element={<AboutUsPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <AISmartChatbot />
                  <ExitIntentPopup />
                </div>
              }
            />
          </Routes>
          </ManufacturerProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App

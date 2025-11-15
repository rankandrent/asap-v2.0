import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { AuthProvider } from "./contexts/AuthContext"
import { ManufacturerProvider } from "./contexts/ManufacturerContext"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
)

// Lazy load all pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"))
const CategoryPage = lazy(() => import("./pages/CategoryPage"))
const SubcategoryPage = lazy(() => import("./pages/SubcategoryPage"))
const PartDetailPage = lazy(() => import("./pages/PartDetailPage"))
const SearchPage = lazy(() => import("./pages/SearchPage"))
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"))
const NotFound = lazy(() => import("./pages/NotFound"))
const AISmartChatbot = lazy(() => import("./components/common/AISmartChatbot"))
const ExitIntentPopup = lazy(() => import("./components/common/ExitIntentPopup"))

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"))
const SignUp = lazy(() => import("./pages/auth/SignUp"))

// User Dashboard Pages
const UserDashboard = lazy(() => import("./pages/user/Dashboard"))
const OrderHistory = lazy(() => import("./pages/user/OrderHistory"))
const OrderDetail = lazy(() => import("./pages/user/OrderDetail"))
const ProfileSettings = lazy(() => import("./pages/user/ProfileSettings"))

// Admin Pages
const DashboardLayout = lazy(() => import("./pages/admin/DashboardLayout"))
const Dashboard = lazy(() => import("./pages/admin/Dashboard"))
const RFQManager = lazy(() => import("./pages/admin/RFQManager"))
const SEOManager = lazy(() => import("./pages/admin/SEOManager"))
const BlogManager = lazy(() => import("./pages/admin/BlogManager"))
const AIAutomation = lazy(() => import("./pages/admin/AIAutomation"))
const Scheduler = lazy(() => import("./pages/admin/Scheduler"))
const Analytics = lazy(() => import("./pages/admin/Analytics"))
const Settings = lazy(() => import("./pages/admin/Settings"))

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ManufacturerProvider>
          <Routes>
            {/* Auth Routes (No Layout) */}
            <Route path="/auth/login" element={
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            } />
            <Route path="/auth/signup" element={
              <Suspense fallback={<PageLoader />}>
                <SignUp />
              </Suspense>
            } />

            {/* User Dashboard Routes (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Suspense fallback={<PageLoader />}>
                        <UserDashboard />
                      </Suspense>
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
                      <Suspense fallback={<PageLoader />}>
                        <OrderHistory />
                      </Suspense>
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
                      <Suspense fallback={<PageLoader />}>
                        <OrderDetail />
                      </Suspense>
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
                      <Suspense fallback={<PageLoader />}>
                        <ProfileSettings />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={
              <Suspense fallback={<PageLoader />}>
                <DashboardLayout />
              </Suspense>
            }>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="rfqs" element={
                <Suspense fallback={<PageLoader />}>
                  <RFQManager />
                </Suspense>
              } />
              <Route path="seo" element={
                <Suspense fallback={<PageLoader />}>
                  <SEOManager />
                </Suspense>
              } />
              <Route path="blogs" element={
                <Suspense fallback={<PageLoader />}>
                  <BlogManager />
                </Suspense>
              } />
              <Route path="automation" element={
                <Suspense fallback={<PageLoader />}>
                  <AIAutomation />
                </Suspense>
              } />
              <Route path="schedule" element={
                <Suspense fallback={<PageLoader />}>
                  <Scheduler />
                </Suspense>
              } />
              <Route path="analytics" element={
                <Suspense fallback={<PageLoader />}>
                  <Analytics />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<PageLoader />}>
                  <Settings />
                </Suspense>
              } />
            </Route>

            {/* Public Website Routes */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Suspense fallback={<PageLoader />}>
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
                    </Suspense>
                  </main>
                  <Footer />
                  <Suspense fallback={null}>
                    <AISmartChatbot />
                  </Suspense>
                  <Suspense fallback={null}>
                    <ExitIntentPopup />
                  </Suspense>
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

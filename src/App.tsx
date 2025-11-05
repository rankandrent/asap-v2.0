import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import HomePage from "./pages/HomePage"
import CategoryPage from "./pages/CategoryPage"
import SubcategoryPage from "./pages/SubcategoryPage"
import PartDetailPage from "./pages/PartDetailPage"
import SearchPage from "./pages/SearchPage"
import NotFound from "./pages/NotFound"

// Admin Pages
import DashboardLayout from "./pages/admin/DashboardLayout"
import Dashboard from "./pages/admin/Dashboard"
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
        <Routes>
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="seo" element={<SEOManager />} />
            <Route path="blogs" element={<BlogManager />} />
            <Route path="automation" element={<AIAutomation />} />
            <Route path="schedule" element={<Scheduler />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public Website Routes */}
          <Route path="/*" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/categories" element={<HomePage />} />
                  <Route
                    path="/categories/:categorySlug"
                    element={<CategoryPage />}
                  />
                  <Route
                    path="/categories/:categorySlug/:subcategorySlug"
                    element={<SubcategoryPage />}
                  />
                  <Route path="/parts/:productname" element={<PartDetailPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App

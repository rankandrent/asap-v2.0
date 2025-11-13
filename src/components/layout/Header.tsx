import { useState } from "react"
import { Link } from "react-router-dom"
import SearchBar from "../common/SearchBar"
import { Package } from "lucide-react"

export default function Header() {
  const [logoError, setLogoError] = useState(false)

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      {/* SEO-friendly structured header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" itemScope itemType="https://schema.org/Organization">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="" 
                className="h-12 w-auto"
                itemProp="logo"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="p-2 bg-blue-600 rounded-lg" itemProp="logo">
                <Package className="h-6 w-6 text-white" />
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-primary" itemProp="name">
                ASAP-Amatom.com
              </h1>
              <p className="text-xs text-muted-foreground" itemProp="description">
                Official Amatom Parts Catalog | 500,000+ Parts
              </p>
              {/* Hidden structured data for SEO */}
              <meta itemProp="url" content="https://asapamatom.netlify.app" />
            </div>
          </Link>
          
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
          
          <nav className="hidden md:flex gap-4" itemScope itemType="https://schema.org/SiteNavigationElement">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
              itemProp="url"
            >
              <span itemProp="name">Home</span>
            </Link>
            <Link
              to="/categories"
              className="text-sm font-medium hover:text-primary transition-colors"
              itemProp="url"
            >
              <span itemProp="name">Categories</span>
            </Link>
            <Link
              to="/search"
              className="text-sm font-medium hover:text-primary transition-colors"
              itemProp="url"
            >
              <span itemProp="name">Search</span>
            </Link>
            <Link
              to="/about-us"
              className="text-sm font-medium hover:text-primary transition-colors"
              itemProp="url"
            >
              <span itemProp="name">About Us</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}


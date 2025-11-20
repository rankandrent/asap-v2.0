'use client'

/**
 * SEO Component for Next.js with React Helmet
 * 
 * This component works alongside Next.js Metadata API:
 * - Next.js Metadata API handles SSR (server-side rendering)
 * - React Helmet handles client-side dynamic updates
 * 
 * Usage:
 * - For static pages: Use Next.js Metadata API (generateMetadata)
 * - For dynamic client-side updates: Use this SEO component
 * 
 * Note: Next.js Metadata API is preferred for SSR, but this component
 * allows for client-side meta tag updates when needed.
 */

import { Helmet } from 'react-helmet-async'
import { usePathname } from 'next/navigation'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogType?: string
  ogImage?: string
  schema?: any
  keywords?: string
  robots?: string
  author?: string
  noIndex?: boolean
  alternates?: { hreflang: string; href: string }[]
}

export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  schema,
  keywords,
  robots,
  author = 'ASAP-Amatom.com',
  noIndex = false,
  alternates,
}: SEOProps) {
  const pathname = usePathname()
  const siteName = 'ASAP-Amatom.com'
  const siteUrl = 'https://asap-amatom.com'
  const fullTitle = title 
    ? (title.includes(siteName) ? title : `${title} | ${siteName}`)
    : `${siteName} - Official Amatom Parts Catalog`
  const defaultImage = `${siteUrl}/og-image.jpg`
  const finalImage = ogImage || defaultImage

  // Auto-generate canonical URL if not provided
  const generateCanonicalUrl = (): string => {
    if (canonical) return canonical
    
    const cleanPath = pathname.endsWith('/') && pathname !== '/' 
      ? pathname.slice(0, -1) 
      : pathname
    
    if (cleanPath === '/') return siteUrl
    
    return `${siteUrl}${cleanPath}`
  }

  const canonicalUrl = generateCanonicalUrl()

  // Determine robots content
  const robotsContent = noIndex 
    ? 'noindex, nofollow' 
    : (robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      {title && <title>{fullTitle}</title>}
      {title && <meta name="title" content={fullTitle} />}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="publisher" content={siteName} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Language Links */}
      {alternates?.map((alt) => (
        <link 
          key={alt.hreflang} 
          rel="alternate" 
          hrefLang={alt.hreflang} 
          href={alt.href} 
        />
      ))}

      {/* Open Graph / Facebook */}
      {ogType && <meta property="og:type" content={ogType} />}
      {title && <meta property="og:title" content={fullTitle} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={fullTitle} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@ASAPAmatom" />
      <meta name="twitter:creator" content="@ASAPAmatom" />

      {/* Additional SEO */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Security & Performance */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Geographic Targeting */}
      <meta name="geo.region" content="US" />
      <meta name="geo.position" content="33.7175;-117.8311" />
      <meta name="ICBM" content="33.7175, -117.8311" />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}


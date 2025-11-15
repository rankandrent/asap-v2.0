import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const PROD_DOMAIN = 'https://asap-amatom.com'

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Serve static files (assets, images, etc.) - MUST be before catch-all
app.use('/assets', express.static(path.resolve(__dirname, 'dist', 'assets')))
app.use('/image', express.static(path.resolve(__dirname, 'dist', 'image')))
app.use('/images', express.static(path.resolve(__dirname, 'dist', 'images')))

// Helper function to serve HTML with SEO tags
async function serveHTMLWithSEO(req, res) {
  try {
    // Read the index.html file
    const indexPath = path.resolve(__dirname, 'dist', 'index.html')
    let html = fs.readFileSync(indexPath, 'utf-8')

    // Generate canonical URL from request path
    const pathname = req.path.endsWith('/') && req.path !== '/' 
      ? req.path.slice(0, -1) 
      : req.path
    
    const canonicalUrl = pathname === '/' 
      ? `${PROD_DOMAIN}/`
      : `${PROD_DOMAIN}${pathname}`

    // Generate SEO meta tags based on route (async to fetch data if needed)
    const seoTags = await generateSEOTags(req.path, canonicalUrl, req)

    // Replace title tag
    const titleMatch = html.match(/<title>.*?<\/title>/)
    if (titleMatch && seoTags.title) {
      html = html.replace(titleMatch[0], `<title>${escapeHtml(seoTags.title)}</title>`)
    }

    // Replace description meta tag
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(seoTags.description)}" />`
    )

    // Replace keywords meta tag
    if (seoTags.keywords) {
      html = html.replace(
        /<meta name="keywords" content="[^"]*" \/>/,
        `<meta name="keywords" content="${escapeHtml(seoTags.keywords)}" />`
      )
    }

    // Inject canonical and additional SEO tags
    html = html.replace(
      '<!-- Canonical URL will be dynamically inserted by React Helmet per page -->',
      `<!-- Server-side injected canonical (React Helmet will take over after JS loads) -->
    <link rel="canonical" href="${canonicalUrl}" data-server="true">
    ${seoTags.additionalTags}`
    )

    // Replace OG and Twitter tags if they exist
    if (seoTags.ogTitle) {
      html = html.replace(
        /<meta property="og:title" content="[^"]*" \/>/,
        `<meta property="og:title" content="${escapeHtml(seoTags.ogTitle)}" data-server="true" />`
      )
    }
    if (seoTags.ogDescription) {
      html = html.replace(
        /<meta property="og:description" content="[^"]*" \/>/,
        `<meta property="og:description" content="${escapeHtml(seoTags.ogDescription)}" data-server="true" />`
      )
    }
    if (seoTags.ogType) {
      html = html.replace(
        /<meta property="og:type" content="[^"]*" \/>/,
        `<meta property="og:type" content="${escapeHtml(seoTags.ogType)}" data-server="true" />`
      )
    }
    if (seoTags.ogImage) {
      html = html.replace(
        /<meta property="og:image" content="[^"]*" \/>/,
        `<meta property="og:image" content="${escapeHtml(seoTags.ogImage)}" data-server="true" />`
      )
    }
    if (seoTags.ogUrl) {
      html = html.replace(
        /<meta property="og:url" content="[^"]*" \/>/,
        `<meta property="og:url" content="${escapeHtml(seoTags.ogUrl)}" data-server="true" />`
      )
    }

    // Inject schema if provided
    if (seoTags.schema) {
      html = html.replace(
        '<!-- Structured Data - WebSite -->',
        `<!-- Structured Data - WebSite -->\n    <!-- Dynamic Schema -->\n    <script type="application/ld+json">\n    ${JSON.stringify(seoTags.schema, null, 2)}\n    </script>`
      )
    }

    // Add preconnect hints for performance
    const performanceHints = `
    <!-- Performance hints -->
    <link rel="preconnect" href="${PROD_DOMAIN}">
    <link rel="dns-prefetch" href="${PROD_DOMAIN}">`

    html = html.replace('</head>', `${performanceHints}\n  </head>`)

    // Send the modified HTML
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    res.send(html)

  } catch (error) {
    console.error('Error serving page:', error)
    res.status(500).send('Internal Server Error')
  }
}

// Wrapper to handle async route handlers in Express 5
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Define routes - Express 5 compatible
app.get('/', asyncHandler(serveHTMLWithSEO))
app.get('/categories/:slug', asyncHandler(serveHTMLWithSEO))
app.get('/categories/:slug/:subslug', asyncHandler(serveHTMLWithSEO))
app.get('/parts/:productname', asyncHandler(serveHTMLWithSEO))
app.get('/search', asyncHandler(serveHTMLWithSEO))
app.get('/about-us', asyncHandler(serveHTMLWithSEO))
app.get('/404', asyncHandler(serveHTMLWithSEO))

// Catch-all fallback for SPA routing (must be last)
app.use(asyncHandler((req, res, next) => {
  // Only handle if not already handled (skip static assets)
  if (req.path.startsWith('/assets/') || req.path.startsWith('/image/') || req.path.startsWith('/images/')) {
    return res.status(404).send('Not Found')
  }
  // Serve HTML for any other route
  return serveHTMLWithSEO(req, res)
}))

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

// Generate SEO meta tags based on route (async to fetch actual data)
async function generateSEOTags(path, canonicalUrl, req = null) {
  // Default tags
  let title = 'ASAP-Amatom.com - Official Amatom Parts Catalog | 500,000+ Parts'
  let description = 'Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts across multiple categories including Standoffs, Fasteners, and more. Official Amatom manufacturer parts.'
  let ogType = 'website'
  let ogImage = `${PROD_DOMAIN}/og-image.jpg`
  let schema = null
  let keywords = 'Amatom parts, aerospace parts, industrial parts, standoffs, fasteners, Amatom catalog, aviation parts'

  // Route-specific tags
  if (path.startsWith('/parts/')) {
    const partName = decodeURIComponent(path.split('/parts/')[1])
    
    // Fetch actual part data from Supabase
    if (supabase) {
      try {
        const { data: part, error } = await supabase
          .from('products_data')
          .select('*')
          .eq('productname', partName)
          .eq('manufacturer', 'Amatom')
          .single()

        if (!error && part) {
          // Use actual part data
          title = `${part.productname} - ${part.description || 'Part Details'} | Amatom Parts`
          description = `Buy ${part.productname} from Amatom. ${part.description || 'Aerospace and industrial part'}. Category: ${part.category || 'Parts'} > ${part.sub_category || 'Components'}. Official ASAP-Amatom.com catalog.`
          keywords = `${part.productname}, Amatom, ${part.category}, ${part.sub_category}, ${part.manufacturer}, aerospace parts, industrial parts`
          ogType = 'product'
          
          // Use part image if available
          if (part.images && part.images.length > 0) {
            ogImage = part.images[0]
          }

          // Generate Product Schema
          schema = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "name": part.productname,
                "description": part.description || '',
                "brand": {
                  "@type": "Brand",
                  "name": part.manufacturer || 'Amatom'
                },
                "category": `${part.category || ''} > ${part.sub_category || ''}`,
                "url": canonicalUrl,
                ...(part.images && part.images.length > 0 && {
                  "image": part.images[0]
                }),
                "offers": {
                  "@type": "Offer",
                  "availability": "https://schema.org/InStock",
                  "priceCurrency": "USD",
                  "url": canonicalUrl,
                  "seller": {
                    "@type": "Organization",
                    "name": "ASAP-Amatom.com"
                  }
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `${PROD_DOMAIN}/`
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": part.category || 'Category',
                    "item": `${PROD_DOMAIN}/categories/${part.category ? part.category.toLowerCase().replace(/\s+/g, '-') : 'parts'}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": part.productname,
                    "item": canonicalUrl
                  }
                ]
              }
            ]
          }
        } else {
          // Fallback if part not found
          title = `${partName} - Part Details | ASAP-Amatom.com`
          description = `View specifications and details for ${partName}. Official Amatom part from ASAP-Amatom.com.`
          ogType = 'product'
        }
      } catch (error) {
        console.error('Error fetching part data:', error)
        // Fallback on error
        title = `${partName} - Part Details | ASAP-Amatom.com`
        description = `View specifications and details for ${partName}. Official Amatom part from ASAP-Amatom.com.`
        ogType = 'product'
      }
    } else {
      // Fallback if Supabase not configured
      title = `${partName} - Part Details | ASAP-Amatom.com`
      description = `View specifications and details for ${partName}. Official Amatom part from ASAP-Amatom.com.`
      ogType = 'product'
    }
  } else if (path.startsWith('/categories/')) {
    const segments = path.split('/').filter(Boolean)
    if (segments.length === 2) {
      // Category page
      const categorySlug = segments[1]
      const category = categorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      title = `${category} - Amatom Parts | ASAP-Amatom.com`
      description = `Browse all ${category} parts from Amatom manufacturer. Find specifications, pricing, and availability for aerospace and industrial ${category} parts.`
      keywords = `${category}, Amatom ${category}, ${category} parts, aerospace ${category}, industrial ${category}`
      ogImage = `${PROD_DOMAIN}/images/categories/${categorySlug}.jpg`
    } else if (segments.length === 3) {
      // Subcategory page
      const categorySlug = segments[1]
      const subcategorySlug = segments[2]
      const category = categorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      const subcategory = subcategorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      title = `${subcategory} - ${category} | Amatom Parts | ASAP-Amatom.com`
      description = `Shop ${subcategory} from Amatom manufacturer. Browse complete catalog of ${subcategory} parts. Find specifications, pricing, and availability. Category: ${category}.`
      keywords = `${subcategory}, ${category}, Amatom ${subcategory}, ${subcategory} parts, buy ${subcategory}`
      ogImage = `${PROD_DOMAIN}/images/categories/${categorySlug}.jpg`
    }
  } else if (path.startsWith('/search')) {
    let query = null
    if (req && req.url) {
      try {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
        query = url.searchParams.get('q')
      } catch (e) {
        // Fallback: parse manually
        const match = req.url.match(/[?&]q=([^&]*)/)
        if (match) query = decodeURIComponent(match[1])
      }
    }
    if (query) {
      title = `Search Results for "${query}" | ASAP-Amatom.com`
      description = `Search results for "${query}" in Amatom parts catalog. Browse aerospace and industrial parts from official Amatom manufacturer.`
      keywords = `${query}, Amatom ${query}, search ${query} parts, ${query} aerospace parts`
    } else {
      title = 'Search Parts - ASAP-Amatom.com'
      description = 'Search our catalog of 500,000+ Amatom aerospace and industrial parts.'
    }
  } else if (path.startsWith('/about-us')) {
    title = 'About Us - ASAP-Amatom.com | Our Story & Services'
    description = 'ASAP Semiconductor is a solution-based system integrator offering custom-procurement, distribution, logistics, and project management solutions.'
    keywords = 'about ASAP Semiconductor, aerospace parts distributor, defense contractor, logistics solutions'
  }

  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType,
    ogImage,
    ogUrl: canonicalUrl,
    keywords,
    schema,
    additionalTags: `
    <meta property="og:site_name" content="ASAP-Amatom.com" data-server="true">
    <meta name="twitter:card" content="summary_large_image" data-server="true">
    <meta name="twitter:title" content="${escapeHtml(title)}" data-server="true">
    <meta name="twitter:description" content="${escapeHtml(description)}" data-server="true">
    <meta name="twitter:image" content="${ogImage}" data-server="true">`
  }
}

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅  Server Started Successfully!                         ║
║                                                            ║
║   🌐  URL: http://localhost:${PORT}                         ║
║   📄  SSR: ENABLED (Canonical tags in page source!)       ║
║   🔍  SEO: OPTIMIZED                                      ║
║                                                            ║
║   Test canonical in source:                               ║
║   curl -s http://localhost:${PORT}/parts/ABC-123 | grep canonical  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `)
})


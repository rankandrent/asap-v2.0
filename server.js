import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const PROD_DOMAIN = 'https://asap-amatom.com'

// Serve static files
app.use(express.static(path.resolve(__dirname, 'dist'), {
  maxAge: '1d',
  etag: true
}))

// Middleware to inject canonical tags dynamically
app.get('*', (req, res) => {
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

    // Generate SEO meta tags based on route
    const seoTags = generateSEOTags(req.path, canonicalUrl)

    // Inject SEO tags into HTML
    html = html.replace(
      '<!-- Canonical URL will be dynamically inserted by React Helmet per page -->',
      `<!-- Server-side injected canonical (React Helmet will take over after JS loads) -->
    <link rel="canonical" href="${canonicalUrl}" data-server="true">
    ${seoTags}`
    )

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
})

// Generate SEO meta tags based on route
function generateSEOTags(path, canonicalUrl) {
  // Default tags
  let title = 'ASAP-Amatom.com - Official Amatom Parts Catalog | 500,000+ Parts'
  let description = 'Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts across multiple categories.'
  let ogType = 'website'

  // Route-specific tags
  if (path.startsWith('/parts/')) {
    const partName = decodeURIComponent(path.split('/parts/')[1])
    title = `${partName} - Part Details | ASAP-Amatom.com`
    description = `View specifications and details for ${partName}. Official Amatom part from ASAP-Amatom.com.`
    ogType = 'product'
  } else if (path.startsWith('/categories/')) {
    const segments = path.split('/').filter(Boolean)
    if (segments.length === 2) {
      // Category page
      const category = segments[1].replace(/-/g, ' ')
      title = `${category.charAt(0).toUpperCase() + category.slice(1)} - Browse Parts | ASAP-Amatom.com`
      description = `Browse all ${category} parts from Amatom. High-quality aerospace and industrial components.`
    } else if (segments.length === 3) {
      // Subcategory page
      const subcategory = segments[2].replace(/-/g, ' ')
      title = `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} - Parts List | ASAP-Amatom.com`
      description = `View all ${subcategory} parts. Premium quality components from Amatom.`
    }
  } else if (path.startsWith('/search')) {
    title = 'Search Parts - ASAP-Amatom.com'
    description = 'Search our catalog of 500,000+ Amatom aerospace and industrial parts.'
  } else if (path.startsWith('/about-us')) {
    title = 'About Us - ASAP-Amatom.com'
    description = 'Learn about ASAP-Amatom.com, your trusted source for official Amatom parts and components.'
  }

  return `
    <meta property="og:title" content="${title}" data-server="true">
    <meta property="og:description" content="${description}" data-server="true">
    <meta property="og:url" content="${canonicalUrl}" data-server="true">
    <meta property="og:type" content="${ogType}" data-server="true">
    <meta name="twitter:title" content="${title}" data-server="true">
    <meta name="twitter:description" content="${description}" data-server="true">`
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


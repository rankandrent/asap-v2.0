// Netlify Edge Function for Server-Side Meta Tags Injection
// This ensures Google crawlers see dynamic meta tags in the initial HTML

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname

  // Skip if it's an asset, API route, or has file extension
  if (
    path.startsWith('/assets/') ||
    path.startsWith('/image/') ||
    path.startsWith('/images/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/api/') ||
    path.includes('.') ||
    path === '/favicon.ico'
  ) {
    // Let Netlify handle static files - return 404 so it falls through
    return new Response(null, { status: 404 })
  }

  try {
    // Fetch the built index.html from Netlify's deployment
    // Try to get from origin first
    const origin = request.headers.get('x-forwarded-host') || 'asap-amatom.com'
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const originUrl = `${protocol}://${origin}/index.html`
    
    let htmlResponse: Response
    try {
      htmlResponse = await fetch(originUrl, {
        headers: {
          'User-Agent': 'Netlify-Edge-Function',
          'Accept': 'text/html'
        }
      })
    } catch (error) {
      // If fetch fails, return basic HTML structure
      console.error('Error fetching index.html:', error)
      return new Response('<!DOCTYPE html><html><head><title>Loading...</title></head><body><div id="root"></div></body></html>', {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    if (!htmlResponse.ok) {
      return htmlResponse
    }

    let html = await htmlResponse.text()

    // Generate dynamic meta tags based on route
    const siteUrl = 'https://asap-amatom.com'
    let title = 'ASAP-Amatom.com - Official Amatom Parts Catalog | 500,000+ Parts'
    let description = 'Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts across multiple categories.'
    let canonical = `${siteUrl}${path === '/' ? '' : path}`
    let ogType = 'website'
    let ogImage = `${siteUrl}/og-image.jpg`

    // Route-specific meta tags
    if (path.startsWith('/parts/')) {
      const partName = decodeURIComponent(path.split('/parts/')[1] || '')
      title = `${partName} - Part Details | Amatom Parts | ASAP-Amatom.com`
      description = `Buy ${partName} from Amatom. View specifications, pricing, and availability. Official ASAP-Amatom.com catalog.`
      ogType = 'product'
    } else if (path.startsWith('/categories/')) {
      const segments = path.split('/').filter(Boolean)
      if (segments.length === 2) {
        const categorySlug = segments[1]
        const category = categorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        title = `${category} - Amatom Parts | ASAP-Amatom.com`
        description = `Browse all ${category} parts from Amatom manufacturer. Find specifications, pricing, and availability.`
        ogImage = `${siteUrl}/images/categories/${categorySlug}.jpg`
      } else if (segments.length === 3) {
        const categorySlug = segments[1]
        const subcategorySlug = segments[2]
        const category = categorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        const subcategory = subcategorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        title = `${subcategory} - ${category} | Amatom Parts | ASAP-Amatom.com`
        description = `Shop ${subcategory} from Amatom manufacturer. Browse complete catalog of ${subcategory} parts.`
        ogImage = `${siteUrl}/images/categories/${categorySlug}.jpg`
      }
    } else if (path.startsWith('/search')) {
      const query = url.searchParams.get('q')
      if (query) {
        title = `Search Results for "${query}" | ASAP-Amatom.com`
        description = `Search results for "${query}" in Amatom parts catalog. Browse aerospace and industrial parts.`
      } else {
        title = 'Search Parts - ASAP-Amatom.com'
        description = 'Search 500,000+ Amatom aerospace and industrial parts.'
      }
    } else if (path.startsWith('/about-us')) {
      title = 'About Us - ASAP-Amatom.com'
      description = 'ASAP Semiconductor is a solution-based system integrator offering custom-procurement and distribution solutions.'
    }

    // Escape HTML for meta tags
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    // Replace title tag
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)

    // Replace description meta tag
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(description)}" />`
    )

    // Inject or update Open Graph tags
    const ogTags = `
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="ASAP-Amatom.com" />
    <link rel="canonical" href="${canonical}" />
    `

    // Insert OG tags before closing head tag
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${ogTags}\n    </head>`)
    }

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error in SSR function:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}


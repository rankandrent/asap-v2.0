import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PROD_DOMAIN = 'https://asap-amatom.com'

// Initialize Supabase client
const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('VITE_SUPABASE_ANON_KEY') || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

// Generate SEO meta tags based on route
async function generateSEOTags(path: string, canonicalUrl: string, url: URL) {
  // Default tags
  let title = 'ASAP-Amatom.com - Official Amatom Parts Catalog | 500,000+ Parts'
  let description = 'Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts across multiple categories including Standoffs, Fasteners, and more. Official Amatom manufacturer parts.'
  let ogType = 'website'
  let ogImage = `${PROD_DOMAIN}/og-image.jpg`
  let schema: any = null
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
    const query = url.searchParams.get('q')
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
    schema
  }
}

serve(async (req) => {
  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Skip if it's an asset or API route
    if (
      path.startsWith('/assets/') ||
      path.startsWith('/image/') ||
      path.startsWith('/images/') ||
      path.startsWith('/_next/') ||
      path.startsWith('/api/') ||
      path.includes('.')
    ) {
      // Let Netlify handle static files
      return new Response('Not Found', { status: 404 })
    }

    // Fetch the built index.html
    // In Netlify, dist folder is available at deployment time
    // We'll need to read it from the file system during build or use a CDN
    // For now, we'll fetch it from the origin
    let html: string
    
    try {
      // Try to get index.html from origin (Netlify's static hosting)
      const originUrl = `${PROD_DOMAIN}${path === '/' ? '/index.html' : '/index.html'}`
      const htmlResponse = await fetch(originUrl)
      html = await htmlResponse.text()
    } catch (error) {
      // Fallback: return basic HTML structure
      console.error('Error fetching index.html:', error)
      return new Response('Error loading page', { status: 500 })
    }

    // Generate canonical URL
    const pathname = path.endsWith('/') && path !== '/' 
      ? path.slice(0, -1) 
      : path
    
    const canonicalUrl = pathname === '/' 
      ? `${PROD_DOMAIN}/`
      : `${PROD_DOMAIN}${pathname}`

    // Generate SEO meta tags
    const seoTags = await generateSEOTags(path, canonicalUrl, url)

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
    <meta property="og:url" content="${escapeHtml(seoTags.ogUrl)}" data-server="true">
    <meta property="og:site_name" content="ASAP-Amatom.com" data-server="true">
    <meta name="twitter:card" content="summary_large_image" data-server="true">
    <meta name="twitter:title" content="${escapeHtml(seoTags.ogTitle)}" data-server="true">
    <meta name="twitter:description" content="${escapeHtml(seoTags.ogDescription)}" data-server="true">
    <meta name="twitter:image" content="${seoTags.ogImage}" data-server="true">`
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

    // Inject schema if provided
    if (seoTags.schema) {
      html = html.replace(
        '<!-- Structured Data - WebSite -->',
        `<!-- Structured Data - WebSite -->
    <!-- Dynamic Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(seoTags.schema, null, 2)}
    </script>`
      )
    }

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error in SSR function:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})


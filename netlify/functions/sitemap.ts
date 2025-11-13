import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://asap-amatom.com'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Helper function to slugify
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

// Helper function to generate XML URL entry
function generateUrlEntry(loc: string, lastmod?: string, changefreq?: string, priority?: string): string {
  const lastmodStr = lastmod || new Date().toISOString().split('T')[0]
  const changefreqStr = changefreq || 'weekly'
  const priorityStr = priority || '0.8'
  
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmodStr}</lastmod>
    <changefreq>${changefreqStr}</changefreq>
    <priority>${priorityStr}</priority>
  </url>
`
}

// Main sitemap handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const path = event.path.replace('/.netlify/functions/sitemap', '')
  
  try {
    const today = new Date().toISOString().split('T')[0]
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    
    // Main sitemap.xml
    if (path === '/sitemap.xml' || path === '') {
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      
      // Static pages
      xml += generateUrlEntry(`${SITE_URL}/`, today, 'daily', '1.0')
      xml += generateUrlEntry(`${SITE_URL}/about-us`, today, 'monthly', '0.9')
      xml += generateUrlEntry(`${SITE_URL}/categories`, today, 'weekly', '0.9')
      xml += generateUrlEntry(`${SITE_URL}/search`, today, 'weekly', '0.8')
      
      // Get all manufacturers
      const { data: manufacturersData, error: mfrError } = await supabase
        .from('products_data')
        .select('manufacturer')
        .not('manufacturer', 'is', null)
        .neq('manufacturer', '')
        .limit(10000)
      
      if (!mfrError && manufacturersData) {
        const uniqueManufacturers = new Set<string>()
        manufacturersData.forEach((row: { manufacturer: string }) => {
          if (row.manufacturer && row.manufacturer.trim()) {
            uniqueManufacturers.add(row.manufacturer.trim())
          }
        })
        
        // Generate manufacturer sitemap links
        for (const manufacturer of Array.from(uniqueManufacturers).sort()) {
          const manufacturerSlug = slugify(manufacturer)
          xml += generateUrlEntry(
            `${SITE_URL}/${manufacturerSlug}.xml`,
            today,
            'weekly',
            '0.9'
          )
        }
      }
      
      xml += '</urlset>'
    }
    // Manufacturer sitemap (e.g., /Amatom.xml)
    else if (path.endsWith('.xml')) {
      const manufacturerName = decodeURIComponent(path.replace(/\.xml$/, '').replace(/^\//, ''))
      
      // Get all categories for this manufacturer
      const { data: categoriesData, error } = await supabase
        .from('products_data')
        .select('category')
        .eq('manufacturer', manufacturerName)
        .not('category', 'is', null)
        .neq('category', '')
        .limit(10000)
      
      if (error) {
        throw error
      }
      
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      
      if (categoriesData) {
        const uniqueCategories = new Set<string>()
        categoriesData.forEach((row: { category: string }) => {
          if (row.category && row.category.trim()) {
            uniqueCategories.add(row.category.trim())
          }
        })
        
        // Generate category sitemap links
        for (const categoryName of Array.from(uniqueCategories).sort()) {
          const categorySlug = slugify(categoryName)
          xml += generateUrlEntry(
            `${SITE_URL}/${categorySlug}.xml`,
            today,
            'weekly',
            '0.9'
          )
        }
      }
      
      xml += '</urlset>'
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: xml,
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: '<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>',
    }
  }
}


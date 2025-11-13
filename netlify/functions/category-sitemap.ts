import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://asap-amatom.com'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''
const MAX_PARTS_PER_SITEMAP = 50000 // Google's limit

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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

// Category sitemap handler (e.g., /Standoffs.xml)
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Extract category name from path (e.g., /Standoffs.xml -> "Standoffs")
    const path = event.path.replace('/.netlify/functions/category-sitemap', '')
    const categorySlug = path.replace(/\.xml$/, '').replace(/^\//, '')
    
    // Get page number from query string if splitting (e.g., ?page=1)
    const page = parseInt(event.queryStringParameters?.page || '1', 10)
    const offset = (page - 1) * MAX_PARTS_PER_SITEMAP
    
    const today = new Date().toISOString().split('T')[0]
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    // First, try to find the actual category name from slug
    // Query a sample to find matching category name
    const { data: sampleData, error: sampleError } = await supabase
      .from('products_data')
      .select('category')
      .not('category', 'is', null)
      .neq('category', '')
      .limit(1000)
    
    let categoryName: string | null = null
    if (sampleData) {
      // Find category that matches slug
      const categoryMap = new Map<string, string>()
      sampleData.forEach((row: { category: string }) => {
        if (row.category && row.category.trim()) {
          const catName = row.category.trim()
          const catSlug = catName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
          if (!categoryMap.has(catSlug)) {
            categoryMap.set(catSlug, catName)
          }
        }
      })
      categoryName = categoryMap.get(categorySlug.toLowerCase()) || null
    }
    
    if (!categoryName) {
      // Fallback: try direct match (case-insensitive)
      const { data: directData, error: directError } = await supabase
        .from('products_data')
        .select('category')
        .ilike('category', `%${categorySlug.replace(/-/g, ' ')}%`)
        .limit(1)
      
      if (!directError && directData && directData.length > 0) {
        categoryName = directData[0].category?.trim() || null
      }
    }
    
    if (!categoryName) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/xml',
        },
        body: '<?xml version="1.0" encoding="UTF-8"?><error>Category not found</error>',
      }
    }
    
    // Get parts in this category with pagination
    let query = supabase
      .from('products_data')
      .select('productname')
      .eq('category', categoryName)
      .order('productname', { ascending: true })
      .range(offset, offset + MAX_PARTS_PER_SITEMAP - 1)
    
    const { data: partsData, error: partsError, count } = await query
    
    if (partsError) {
      throw partsError
    }
    
    // Generate part URLs
    if (partsData) {
      for (const part of partsData) {
        if (part.productname) {
          const encodedProductName = encodeURIComponent(part.productname)
          xml += generateUrlEntry(
            `${SITE_URL}/parts/${encodedProductName}`,
            today,
            'monthly',
            '0.7'
          )
        }
      }
    }
    
    // If there are more parts, add a reference to the next page sitemap
    const totalParts = count || 0
    if (totalParts > offset + MAX_PARTS_PER_SITEMAP) {
      const nextPage = page + 1
      xml += `  <url>
    <loc>${SITE_URL}/${categorySlug}.xml?page=${nextPage}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
    }
    
    xml += '</urlset>'
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: xml,
    }
  } catch (error) {
    console.error('Error generating category sitemap:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: '<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>',
    }
  }
}


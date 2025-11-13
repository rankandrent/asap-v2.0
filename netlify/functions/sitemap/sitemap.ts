import type { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://asap-amatom.com'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

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

// Main sitemap handler - handles /sitemap.xml, /[manufacturer].xml, and /[category].xml
export const handler: Handler = async (event) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check environment variables.')
    }

    const today = new Date().toISOString().split('T')[0]
    const rawPath = event.rawPath || event.path
    const path = rawPath.replace('/.netlify/functions/sitemap', '')
    const queryParams = event.queryStringParameters || {}
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    
    // Determine if this is main sitemap, manufacturer sitemap, or category sitemap
    const isMainSitemap = rawPath === '/sitemap.xml' || path === '' || path === '/sitemap.xml'
    const fileName = rawPath.split('/').pop() || ''
    const isXmlFile = fileName.endsWith('.xml') && !isMainSitemap
    
    // Main sitemap.xml
    if (isMainSitemap) {
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
    // Manufacturer or Category sitemap (e.g., /Amatom.xml or /Standoffs.xml)
    else if (isXmlFile) {
      // Extract name from file (e.g., "Amatom.xml" -> "Amatom")
      const nameFromFile = fileName.replace(/\.xml$/, '')
      const decodedName = decodeURIComponent(nameFromFile)
      
      // First, check if it's a manufacturer by looking for it in manufacturer column
      const { data: mfrCheck, error: mfrCheckError } = await supabase
        .from('products_data')
        .select('manufacturer')
        .eq('manufacturer', decodedName)
        .limit(1)
      
      const isManufacturer = !mfrCheckError && mfrCheck && mfrCheck.length > 0
      
      if (isManufacturer) {
        // Manufacturer sitemap - list all categories for this manufacturer
        const { data: categoriesData, error } = await supabase
          .from('products_data')
          .select('category')
          .eq('manufacturer', decodedName)
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
      } else {
        // Category sitemap - list all parts in this category
        const categorySlug = decodedName
        const page = parseInt(queryParams.page || '1', 10)
        const MAX_PARTS_PER_SITEMAP = 50000 // Google's limit
        const offset = (page - 1) * MAX_PARTS_PER_SITEMAP
        
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        // Find category name from slug
        const { data: sampleData } = await supabase
          .from('products_data')
          .select('category')
          .not('category', 'is', null)
          .neq('category', '')
          .limit(1000)
        
        let categoryName: string | null = null
        if (sampleData) {
          const categoryMap = new Map<string, string>()
          sampleData.forEach((row: { category: string }) => {
            if (row.category && row.category.trim()) {
              const catName = row.category.trim()
              const catSlug = slugify(catName)
              if (!categoryMap.has(catSlug)) {
                categoryMap.set(catSlug, catName)
              }
            }
          })
          categoryName = categoryMap.get(categorySlug.toLowerCase()) || null
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
        
        // Get parts with pagination
        const { data: partsData, error: partsError, count } = await supabase
          .from('products_data')
          .select('productname', { count: 'exact' })
          .eq('category', categoryName)
          .order('productname', { ascending: true })
          .range(offset, offset + MAX_PARTS_PER_SITEMAP - 1)
        
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
        
        // If there are more parts, add a reference to next page in comment
        const totalParts = count || 0
        if (totalParts > offset + MAX_PARTS_PER_SITEMAP) {
          const nextPage = page + 1
          xml += `  <!-- Next page available at: ${SITE_URL}/${categorySlug}.xml?page=${nextPage} -->\n`
        }
        
        xml += '</urlset>'
      }
    } else {
      // Invalid path
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/xml',
        },
        body: '<?xml version="1.0" encoding="UTF-8"?><error>Invalid sitemap path</error>',
      }
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

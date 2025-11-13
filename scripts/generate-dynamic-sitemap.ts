import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// Load environment variables from the workspace root
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '..', '.env')
config({ path: envPath })

const SITE_URL = 'https://asap-amatom.com'
const MAX_URLS_PER_SITEMAP = 50000 // Google limit

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file')
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to create XML sitemap
function createSitemapXML(urls: { loc: string; lastmod?: string; changefreq?: string; priority?: string }[]): string {
  const urlsXML = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `\n    <priority>${url.priority}</priority>` : ''}
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`
}

// Helper function to create sitemap index XML
function createSitemapIndexXML(sitemaps: { loc: string; lastmod?: string }[]): string {
  const sitemapsXML = sitemaps
    .map(
      (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>${sitemap.lastmod ? `\n    <lastmod>${sitemap.lastmod}</lastmod>` : ''}
  </sitemap>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXML}
</sitemapindex>`
}

// Slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

// Get all manufacturers from database
async function getManufacturers(): Promise<string[]> {
  console.log('📦 Fetching manufacturers...')
  const { data, error } = await supabase
    .from('products_data')
    .select('manufacturer')
    .not('manufacturer', 'is', null)
    .neq('manufacturer', '')
    .limit(1000)

  if (error) {
    console.error('Error fetching manufacturers:', error)
    return []
  }

  const manufacturers = [...new Set(data.map((row) => row.manufacturer))]
  console.log(`✅ Found ${manufacturers.length} manufacturers`)
  return manufacturers
}

// Get all categories for a manufacturer
async function getCategoriesForManufacturer(manufacturer: string): Promise<string[]> {
  console.log(`📦 Fetching categories for ${manufacturer}...`)
  
  // Fetch categories in batches to handle large datasets
  const allCategories = new Set<string>()
  let offset = 0
  const batchSize = 1000 // Supabase default max per query
  let totalProcessed = 0
  
  while (true) {
    const { data, error } = await supabase
      .from('products_data')
      .select('category')
      .eq('manufacturer', manufacturer)
      .not('category', 'is', null)
      .neq('category', '')
      .range(offset, offset + batchSize - 1)

    if (error) {
      console.error('Error fetching categories:', error)
      break
    }

    if (!data || data.length === 0) break

    data.forEach((row) => {
      if (row.category && row.category.trim()) {
        allCategories.add(row.category.trim())
      }
    })

    totalProcessed += data.length
    console.log(`  Processed ${totalProcessed} rows, found ${allCategories.size} unique categories so far...`)

    // If we got fewer rows than batch size, we've reached the end
    if (data.length < batchSize) {
      console.log(`  Reached end of data (got ${data.length} rows in last batch)`)
      break
    }
    
    offset += batchSize
    
    // Safety limit: stop after processing 500k rows to avoid infinite loops
    // This should be enough to discover all categories
    if (totalProcessed >= 500000) {
      console.log(`  Stopping at 500k rows for safety`)
      break
    }
  }

  const categories = Array.from(allCategories)
  console.log(`✅ Found ${categories.length} total categories for ${manufacturer}`)
  return categories
}

// Get all parts for a category
async function getPartsForCategory(
  manufacturer: string,
  category: string,
  limit: number = MAX_URLS_PER_SITEMAP
): Promise<{ productname: string; created_at?: string }[]> {
  console.log(`📦 Fetching parts for ${manufacturer} > ${category}...`)
  const { data, error } = await supabase
    .from('products_data')
    .select('productname, created_at')
    .eq('manufacturer', manufacturer)
    .eq('category', category)
    .not('productname', 'is', null)
    .neq('productname', '')
    .limit(limit)

  if (error) {
    console.error('Error fetching parts:', error)
    return []
  }

  console.log(`✅ Found ${data.length} parts for ${category}`)
  return data
}

// Count parts for a category
async function countPartsForCategory(manufacturer: string, category: string): Promise<number> {
  const { count, error } = await supabase
    .from('products_data')
    .select('productname', { count: 'exact', head: true })
    .eq('manufacturer', manufacturer)
    .eq('category', category)
    .not('productname', 'is', null)
    .neq('productname', '')

  if (error) {
    console.error('Error counting parts:', error)
    return 0
  }

  return count || 0
}

// Get all subcategories for a category
async function getSubcategoriesForCategory(manufacturer: string, category: string): Promise<string[]> {
  console.log(`📦 Fetching subcategories for ${category}...`)
  
  const allSubcategories = new Set<string>()
  let offset = 0
  const batchSize = 5000
  
  while (true) {
    const { data, error } = await supabase
      .from('products_data')
      .select('sub_category')
      .eq('manufacturer', manufacturer)
      .eq('category', category)
      .not('sub_category', 'is', null)
      .neq('sub_category', '')
      .range(offset, offset + batchSize - 1)

    if (error) {
      console.error('Error fetching subcategories:', error)
      break
    }

    if (!data || data.length === 0) break

    data.forEach((row) => {
      if (row.sub_category && row.sub_category.trim()) {
        allSubcategories.add(row.sub_category.trim())
      }
    })

    if (data.length < batchSize) break
    offset += batchSize
  }

  const subcategories = Array.from(allSubcategories)
  console.log(`✅ Found ${subcategories.length} subcategories for ${category}`)
  return subcategories
}

// Generate subcategory sitemap with parts
async function generateSubcategorySitemap(
  manufacturer: string,
  category: string,
  subcategory: string
): Promise<string[]> {
  const categorySlug = slugify(category)
  const subcategorySlug = slugify(subcategory)
  const totalParts = await countPartsForSubcategory(manufacturer, category, subcategory)
  const numSitemaps = Math.ceil(totalParts / MAX_URLS_PER_SITEMAP)

  console.log(`📄 Generating ${numSitemaps} sitemap(s) for ${category} > ${subcategory} (${totalParts} parts)`)

  const sitemapFiles: string[] = []

  for (let i = 0; i < numSitemaps; i++) {
    const startOffset = i * MAX_URLS_PER_SITEMAP
    const targetCount = Math.min(MAX_URLS_PER_SITEMAP, totalParts - startOffset)
    
    // Fetch parts in batches of 1000 (Supabase limit) until we reach targetCount
    const allParts: { productname: string; created_at?: string }[] = []
    let currentOffset = startOffset
    const supabaseBatchSize = 1000
    
    while (allParts.length < targetCount) {
      const remainingToFetch = targetCount - allParts.length
      const batchSize = Math.min(supabaseBatchSize, remainingToFetch)
      
      const { data: parts, error } = await supabase
        .from('products_data')
        .select('productname, created_at')
        .eq('manufacturer', manufacturer)
        .eq('category', category)
        .eq('sub_category', subcategory)
        .not('productname', 'is', null)
        .neq('productname', '')
        .range(currentOffset, currentOffset + batchSize - 1)

      if (error || !parts || parts.length === 0) {
        if (error) console.error('Error fetching parts:', error)
        break
      }

      allParts.push(...parts)
      currentOffset += parts.length
      
      // If we got fewer rows than requested, we've reached the end
      if (parts.length < batchSize) break
    }

    if (allParts.length === 0) {
      console.log(`⚠️ No parts fetched for ${filename}`)
      continue
    }

    const urls = allParts.map((part) => ({
      loc: `${SITE_URL}/parts/${encodeURIComponent(part.productname)}`,
      lastmod: part.created_at ? new Date(part.created_at).toISOString().split('T')[0] : undefined,
      changefreq: 'weekly' as const,
      priority: '0.6',
    }))

    const sitemapXML = createSitemapXML(urls)
    const filename = numSitemaps > 1 
      ? `${categorySlug}-${subcategorySlug}-${i + 1}.xml` 
      : `${categorySlug}-${subcategorySlug}.xml`
    const filepath = path.join(process.cwd(), 'public', filename)

    fs.writeFileSync(filepath, sitemapXML, 'utf-8')
    console.log(`✅ Created ${filename} with ${allParts.length} parts`)
    sitemapFiles.push(filename)
  }

  return sitemapFiles
}

// Count parts for a subcategory
async function countPartsForSubcategory(
  manufacturer: string,
  category: string,
  subcategory: string
): Promise<number> {
  const { count, error } = await supabase
    .from('products_data')
    .select('productname', { count: 'exact', head: true })
    .eq('manufacturer', manufacturer)
    .eq('category', category)
    .eq('sub_category', subcategory)
    .not('productname', 'is', null)
    .neq('productname', '')

  if (error) {
    console.error('Error counting parts:', error)
    return 0
  }

  return count || 0
}

// Generate category sitemap (includes category page + subcategory pages)
async function generateCategorySitemap(manufacturer: string, category: string): Promise<string[]> {
  const categorySlug = slugify(category)
  console.log(`📄 Generating sitemap for category: ${category}`)

  const sitemapFiles: string[] = []

  // Get all subcategories for this category
  const subcategories = await getSubcategoriesForCategory(manufacturer, category)

  // Create category sitemap with category page and subcategory pages
  const urls = [
    {
      loc: `${SITE_URL}/categories/${categorySlug}`,
      changefreq: 'weekly' as const,
      priority: '0.8',
    },
    ...subcategories.map((subcategory) => ({
      loc: `${SITE_URL}/categories/${categorySlug}/${slugify(subcategory)}`,
      changefreq: 'weekly' as const,
      priority: '0.7',
    })),
  ]

  const categorySitemapXML = createSitemapXML(urls)
  const categoryFilename = `${categorySlug}.xml`
  const categoryFilepath = path.join(process.cwd(), 'public', categoryFilename)
  fs.writeFileSync(categoryFilepath, categorySitemapXML, 'utf-8')
  console.log(`✅ Created ${categoryFilename} with category and ${subcategories.length} subcategories`)
  sitemapFiles.push(categoryFilename)

  // Generate individual subcategory sitemaps with parts
  for (const subcategory of subcategories) {
    const subcategorySitemaps = await generateSubcategorySitemap(manufacturer, category, subcategory)
    sitemapFiles.push(...subcategorySitemaps)
  }

  return sitemapFiles
}

// Generate manufacturer sitemap index (lists all category sitemaps)
async function generateManufacturerSitemap(manufacturer: string): Promise<string> {
  const manufacturerSlug = slugify(manufacturer)
  const categories = await getCategoriesForManufacturer(manufacturer)

  const categorySitemaps: string[] = []

  for (const category of categories) {
    const sitemaps = await generateCategorySitemap(manufacturer, category)
    categorySitemaps.push(...sitemaps)
  }

  // Create manufacturer sitemap index
  const sitemaps = categorySitemaps.map((filename) => ({
    loc: `${SITE_URL}/${filename}`,
    lastmod: new Date().toISOString().split('T')[0],
  }))

  const sitemapIndexXML = createSitemapIndexXML(sitemaps)
  const filename = `${manufacturerSlug}.xml`
  const filepath = path.join(process.cwd(), 'public', filename)

  fs.writeFileSync(filepath, sitemapIndexXML, 'utf-8')
  console.log(`✅ Created ${filename} with ${categorySitemaps.length} category sitemaps`)

  return filename
}

// Generate main sitemap.xml (root sitemap index)
async function generateMainSitemap(): Promise<void> {
  console.log('🚀 Starting main sitemap generation...')

  const manufacturers = await getManufacturers()
  const manufacturerSitemaps: string[] = []

  // Generate sitemap for each manufacturer
  for (const manufacturer of manufacturers) {
    const sitemapFile = await generateManufacturerSitemap(manufacturer)
    manufacturerSitemaps.push(sitemapFile)
  }

  // Static pages
  const staticPages = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/about-us`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/search`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/categories`, priority: '0.9', changefreq: 'weekly' },
  ]

  const staticSitemapXML = createSitemapXML(staticPages)
  const staticSitemapPath = path.join(process.cwd(), 'public', 'static-pages.xml')
  fs.writeFileSync(staticSitemapPath, staticSitemapXML, 'utf-8')
  console.log('✅ Created static-pages.xml')

  // Create main sitemap index
  const allSitemaps = [
    { loc: `${SITE_URL}/static-pages.xml`, lastmod: new Date().toISOString().split('T')[0] },
    ...manufacturerSitemaps.map((filename) => ({
      loc: `${SITE_URL}/${filename}`,
      lastmod: new Date().toISOString().split('T')[0],
    })),
  ]

  const mainSitemapXML = createSitemapIndexXML(allSitemaps)
  const mainSitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
  fs.writeFileSync(mainSitemapPath, mainSitemapXML, 'utf-8')
  console.log('✅ Created main sitemap.xml')

  console.log('🎉 Sitemap generation complete!')
  console.log(`📊 Total manufacturer sitemaps: ${manufacturerSitemaps.length}`)
}

// Run the script
generateMainSitemap().catch((error) => {
  console.error('❌ Error generating sitemap:', error)
  process.exit(1)
})

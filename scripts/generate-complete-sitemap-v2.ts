#!/usr/bin/env tsx
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { slugify } from '../src/lib/utils'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const SITE_URL = process.env.VITE_SITE_URL || 'https://www.asapamatom.com'
const PUBLIC_DIR = path.join(__dirname, '../public')

const MAX_URLS_PER_SITEMAP = 50000 // Google's limit
const FETCH_LIMIT = 1000 // Fetch 1000 at a time for better reliability

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Part {
  id: number
  productname: string
  category: string
  sub_category: string
}

const generateSitemapFile = (filename: string, urls: string[], isIndex: boolean = false) => {
  let content = `<?xml version="1.0" encoding="UTF-8"?>\n`
  
  if (isIndex) {
    content += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    urls.forEach(url => {
      content += `  <sitemap>\n`
      content += `    <loc>${url}</loc>\n`
      content += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
      content += `  </sitemap>\n`
    })
    content += `</sitemapindex>\n`
  } else {
    content += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`
    content += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`
    content += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`
    content += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`
    
    urls.forEach(url => {
      content += `  <url>\n`
      content += `    <loc>${url}</loc>\n`
      content += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
      content += `    <changefreq>weekly</changefreq>\n`
      content += `    <priority>0.8</priority>\n`
      content += `  </url>\n`
    })
    content += `</urlset>\n`
  }
  
  const filePath = path.join(PUBLIC_DIR, filename)
  fs.writeFileSync(filePath, content)
  console.log(`  ✅ Created ${filename} (${urls.length.toLocaleString()} ${isIndex ? 'sitemaps' : 'URLs'})`)
}

const getTotalPartsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('products_data')
    .select('*', { count: 'exact', head: true })
    .eq('manufacturer', 'Amatom')

  if (error) {
    console.error('Error getting total count:', error.message)
    throw error
  }

  return count || 0
}

const getAllParts = async (): Promise<Part[]> => {
  console.log('   📦 Fetching ALL parts using cursor-based pagination...')
  console.log('   (This is more reliable than offset-based queries)')
  console.log('')
  
  const allParts: Part[] = []
  let lastId = 0
  let fetchedCount = 0
  let batchNumber = 0

  while (true) {
    batchNumber++
    
    // Fetch using ID cursor (more reliable than offset for large datasets)
    const { data, error } = await supabase
      .from('products_data')
      .select('id, productname, category, sub_category')
      .eq('manufacturer', 'Amatom')
      .gt('id', lastId)
      .order('id', { ascending: true })
      .limit(FETCH_LIMIT)

    if (error) {
      console.error(`Error fetching parts (lastId: ${lastId}):`, error.message)
      throw error
    }

    if (!data || data.length === 0) {
      break // No more parts
    }

    allParts.push(...(data as Part[]))
    fetchedCount += data.length
    lastId = data[data.length - 1].id
    
    // Progress indicator every 50,000 parts
    if (fetchedCount % 50000 === 0 || data.length < FETCH_LIMIT) {
      console.log(`   ⏳ Fetched ${fetchedCount.toLocaleString()} parts so far... (batch ${batchNumber})`)
    }

    // If we got fewer results than the limit, we've reached the end
    if (data.length < FETCH_LIMIT) {
      break
    }
  }

  console.log(`   ✅ Total parts fetched: ${allParts.length.toLocaleString()}`)
  console.log('')

  return allParts
}

const getCategories = async () => {
  const { data, error } = await supabase
    .from('products_data')
    .select('category, sub_category')
    .eq('manufacturer', 'Amatom')
    .limit(10000) // Get enough for category mapping

  if (error) throw error

  const categoryMap = new Map<string, Set<string>>()
  data?.forEach((part: { category: string; sub_category: string }) => {
    if (!categoryMap.has(part.category)) {
      categoryMap.set(part.category, new Set())
    }
    if (part.sub_category) {
      categoryMap.get(part.category)?.add(part.sub_category)
    }
  })

  return categoryMap
}

const generateCompleteSitemap = async () => {
  console.log('🚀 Starting COMPLETE sitemap generation for ALL 500,000 parts...')
  console.log('=' .repeat(70))
  console.log('')

  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  }

  const allSitemapFiles: string[] = []

  // ========== STEP 1: Main Static Pages ==========
  console.log('📄 Step 1: Generating main pages sitemap...')
  const mainPages = [
    `${SITE_URL}/`,
    `${SITE_URL}/categories`,
    `${SITE_URL}/search`,
  ]
  generateSitemapFile('sitemap-main.xml', mainPages)
  allSitemapFiles.push(`${SITE_URL}/sitemap-main.xml`)
  console.log('')

  // ========== STEP 2: Category & Subcategory Pages ==========
  console.log('📦 Step 2: Generating category & subcategory pages...')
  const categoryMap = await getCategories()
  const categoryUrls: string[] = []

  for (const [categoryName, subcategories] of categoryMap.entries()) {
    const categorySlug = slugify(categoryName)
    categoryUrls.push(`${SITE_URL}/categories/${categorySlug}`)

    for (const subcategoryName of subcategories) {
      const subcategorySlug = slugify(subcategoryName)
      categoryUrls.push(`${SITE_URL}/categories/${categorySlug}/${subcategorySlug}`)
    }
  }

  generateSitemapFile('sitemap-categories.xml', categoryUrls)
  allSitemapFiles.push(`${SITE_URL}/sitemap-categories.xml`)
  console.log(`   Found ${categoryMap.size} categories with ${categoryUrls.length} total pages`)
  console.log('')

  // ========== STEP 3: ALL Part Pages (500,000 parts) ==========
  console.log('🔧 Step 3: Generating part pages (ALL 500,000 parts)...')
  console.log('   Using improved cursor-based pagination...')
  console.log('')

  const totalParts = await getTotalPartsCount()
  console.log(`   📊 Total parts in database: ${totalParts.toLocaleString()}`)
  
  // Fetch ALL parts at once using cursor pagination
  const allParts = await getAllParts()
  
  console.log(`   📑 Will create ${Math.ceil(allParts.length / MAX_URLS_PER_SITEMAP)} part sitemap file(s)`)
  console.log(`   💾 Splitting into ${MAX_URLS_PER_SITEMAP.toLocaleString()} URLs per file`)
  console.log('')

  let currentSitemapIndex = 1
  let currentSitemapUrls: string[] = []

  // Process all parts
  for (let i = 0; i < allParts.length; i++) {
    const part = allParts[i]
    const encodedPartName = encodeURIComponent(part.productname)
    const partUrl = `${SITE_URL}/parts/${encodedPartName}`
    currentSitemapUrls.push(partUrl)

    // Progress indicator
    if ((i + 1) % 50000 === 0) {
      console.log(`   ⏳ Processing: ${(i + 1).toLocaleString()} / ${allParts.length.toLocaleString()} parts...`)
    }

    // If we've reached the limit for this sitemap, write it and start a new one
    if (currentSitemapUrls.length >= MAX_URLS_PER_SITEMAP) {
      const filename = `sitemap-parts-${currentSitemapIndex}.xml`
      generateSitemapFile(filename, currentSitemapUrls)
      allSitemapFiles.push(`${SITE_URL}/${filename}`)
      currentSitemapUrls = []
      currentSitemapIndex++
    }
  }

  // Write remaining parts if any
  if (currentSitemapUrls.length > 0) {
    const filename = `sitemap-parts-${currentSitemapIndex}.xml`
    generateSitemapFile(filename, currentSitemapUrls)
    allSitemapFiles.push(`${SITE_URL}/${filename}`)
  }

  const numPartSitemaps = currentSitemapIndex
  console.log('')
  console.log(`   ✅ Processed ${allParts.length.toLocaleString()} parts`)
  console.log(`   ✅ Created ${numPartSitemaps} part sitemap file(s)`)
  console.log('')

  // ========== STEP 4: Main Sitemap Index ==========
  console.log('🗂️  Step 4: Generating main sitemap index...')
  generateSitemapFile('sitemap.xml', allSitemapFiles, true)
  console.log('')

  // ========== Summary ==========
  console.log('=' .repeat(70))
  console.log('✨ SITEMAP GENERATION COMPLETE!')
  console.log('=' .repeat(70))
  console.log('')
  console.log('📊 SUMMARY:')
  console.log(`   • Total pages: ${(mainPages.length + categoryUrls.length + allParts.length).toLocaleString()}`)
  console.log(`   • Main pages: ${mainPages.length}`)
  console.log(`   • Category/Subcategory pages: ${categoryUrls.length}`)
  console.log(`   • Part pages: ${allParts.length.toLocaleString()}`)
  console.log(`   • Total sitemap files: ${allSitemapFiles.length + 1}`)
  console.log('')
  console.log('📁 FILES CREATED:')
  console.log(`   ✅ sitemap.xml (Main Index - ${allSitemapFiles.length} sitemaps)`)
  console.log(`   ✅ sitemap-main.xml (${mainPages.length} URLs)`)
  console.log(`   ✅ sitemap-categories.xml (${categoryUrls.length} URLs)`)
  
  for (let i = 1; i <= numPartSitemaps; i++) {
    const isLastFile = i === numPartSitemaps
    const count = isLastFile && (allParts.length % MAX_URLS_PER_SITEMAP !== 0)
      ? allParts.length % MAX_URLS_PER_SITEMAP
      : MAX_URLS_PER_SITEMAP
    console.log(`   ✅ sitemap-parts-${i}.xml (${count.toLocaleString()} URLs)`)
  }
  
  console.log('')
  console.log('🌐 NEXT STEPS:')
  console.log('   1. Submit sitemap.xml to Google Search Console')
  console.log('   2. Submit to Bing Webmaster Tools')
  console.log('   3. Monitor indexing progress')
  console.log('   4. Re-generate weekly for updates')
  console.log('')
  console.log(`   📍 Main sitemap URL: ${SITE_URL}/sitemap.xml`)
  console.log('')
  console.log('=' .repeat(70))
}

// Run the script
generateCompleteSitemap().catch(console.error)


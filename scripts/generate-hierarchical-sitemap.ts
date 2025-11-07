#!/usr/bin/env tsx
import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const SITE_URL = 'https://asapamatom.netlify.app'
const OUTPUT_DIR = path.join(process.cwd(), 'public')

interface Category {
  name: string
  slug: string
}

interface Subcategory {
  name: string
  slug: string
  category: string
  categorySlug: string
}

interface Part {
  productname: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

function generateSitemapIndexHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
}

function generateSitemapHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`
}

function generateSitemapIndexEntry(loc: string, lastmod: string): string {
  return `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
`
}

function generateUrlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`
}

async function getCategories(): Promise<Category[]> {
  console.log('📦 Fetching categories...')
  const { data, error } = await supabase
    .from('products_data')
    .select('category')
    .eq('manufacturer', 'Amatom')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  const categoryMap = new Map<string, boolean>()
  data?.forEach((item: { category: string }) => {
    categoryMap.set(item.category, true)
  })

  const categories = Array.from(categoryMap.keys()).map((name) => ({
    name,
    slug: slugify(name),
  }))

  console.log(`  ✅ Found ${categories.length} categories`)
  return categories
}

async function getSubcategories(categoryName: string): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from('products_data')
    .select('sub_category')
    .eq('category', categoryName)
    .eq('manufacturer', 'Amatom')

  if (error) {
    console.error('Error fetching subcategories:', error)
    return []
  }

  const subcategoryMap = new Map<string, boolean>()
  data?.forEach((item: { sub_category: string }) => {
    subcategoryMap.set(item.sub_category, true)
  })

  return Array.from(subcategoryMap.keys()).map((name) => ({
    name,
    slug: slugify(name),
    category: categoryName,
    categorySlug: slugify(categoryName),
  }))
}

async function getPartsBySubcategory(
  categoryName: string,
  subcategoryName: string
): Promise<Part[]> {
  const allParts: Part[] = []
  let lastProductname = ''
  const BATCH_SIZE = 1000

  while (true) {
    const query = supabase
      .from('products_data')
      .select('productname')
      .eq('category', categoryName)
      .eq('sub_category', subcategoryName)
      .eq('manufacturer', 'Amatom')
      .order('productname', { ascending: true })
      .limit(BATCH_SIZE)

    if (lastProductname) {
      query.gt('productname', lastProductname)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching parts:', error)
      break
    }

    if (!data || data.length === 0) {
      break
    }

    allParts.push(...(data as Part[]))
    lastProductname = data[data.length - 1].productname

    if (data.length < BATCH_SIZE) {
      break
    }
  }

  return allParts
}

async function generateMainPagesSitemap(today: string): Promise<string> {
  console.log('\n📄 Generating main pages sitemap...')
  let sitemap = generateSitemapHeader()

  // Homepage
  sitemap += generateUrlEntry(
    `${SITE_URL}/`,
    today,
    'daily',
    '1.0'
  )

  // Categories page
  sitemap += generateUrlEntry(
    `${SITE_URL}/categories`,
    today,
    'weekly',
    '0.9'
  )

  // Search page
  sitemap += generateUrlEntry(
    `${SITE_URL}/search`,
    today,
    'monthly',
    '0.8'
  )

  sitemap += '</urlset>'

  const filename = 'sitemap-main.xml'
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), sitemap, 'utf8')
  console.log(`  ✅ Created ${filename}`)
  
  return filename
}

async function generateCategorySitemap(
  category: Category,
  subcategoryFilenames: string[][],
  today: string
): Promise<string> {
  console.log(`\n📂 Generating sitemap index for category: ${category.name}`)
  let sitemap = generateSitemapIndexHeader()

  // Add category page sitemap
  const categoryPageSitemapName = `sitemap-${category.slug}-page.xml`
  sitemap += generateSitemapIndexEntry(
    `${SITE_URL}/${categoryPageSitemapName}`,
    today
  )

  // Add each subcategory sitemap (might be multiple files per subcategory)
  for (const filenames of subcategoryFilenames) {
    for (const filename of filenames) {
      sitemap += generateSitemapIndexEntry(
        `${SITE_URL}/${filename}`,
        today
      )
    }
  }

  sitemap += '</sitemapindex>'

  const filename = `sitemap-${category.slug}.xml`
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), sitemap, 'utf8')
  
  const totalSitemaps = subcategoryFilenames.flat().length + 1
  console.log(`  ✅ Created ${filename} with ${totalSitemaps} sitemap references`)

  return filename
}

async function generateCategoryPageSitemap(
  category: Category,
  today: string
): Promise<string> {
  let sitemap = generateSitemapHeader()

  // Category page URL
  sitemap += generateUrlEntry(
    `${SITE_URL}/categories/${category.slug}`,
    today,
    'weekly',
    '0.9'
  )

  sitemap += '</urlset>'

  const filename = `sitemap-${category.slug}-page.xml`
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), sitemap, 'utf8')
  
  return filename
}

async function generateSubcategorySitemap(
  subcategory: Subcategory,
  today: string
): Promise<string[]> {
  console.log(`    📋 Generating sitemap for subcategory: ${subcategory.name}`)
  
  // Get all parts in this subcategory
  const parts = await getPartsBySubcategory(subcategory.category, subcategory.name)
  console.log(`      🔧 Found ${parts.length.toLocaleString()} parts`)

  const MAX_URLS_PER_SITEMAP = 50000
  const filenames: string[] = []
  
  // If parts + subcategory page <= 50,000, create single sitemap
  if (parts.length + 1 <= MAX_URLS_PER_SITEMAP) {
    let sitemap = generateSitemapHeader()

    // Subcategory page itself
    sitemap += generateUrlEntry(
      `${SITE_URL}/categories/${subcategory.categorySlug}/${subcategory.slug}`,
      today,
      'weekly',
      '0.8'
    )

    // Add all parts
    for (const part of parts) {
      sitemap += generateUrlEntry(
        `${SITE_URL}/parts/${encodeURIComponent(part.productname)}`,
        today,
        'monthly',
        '0.7'
      )
    }

    sitemap += '</urlset>'

    const filename = `sitemap-${subcategory.categorySlug}-${subcategory.slug}.xml`
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), sitemap, 'utf8')
    console.log(`      ✅ Created ${filename} with ${(parts.length + 1).toLocaleString()} URLs`)
    filenames.push(filename)
  } else {
    // Split into multiple sitemaps
    const totalSitemaps = Math.ceil((parts.length + 1) / MAX_URLS_PER_SITEMAP)
    console.log(`      📑 Splitting into ${totalSitemaps} sitemap files...`)
    
    let currentSitemapIndex = 1
    let currentUrls: string[] = []
    
    // Add subcategory page to first sitemap
    currentUrls.push(generateUrlEntry(
      `${SITE_URL}/categories/${subcategory.categorySlug}/${subcategory.slug}`,
      today,
      'weekly',
      '0.8'
    ))
    
    for (const part of parts) {
      currentUrls.push(generateUrlEntry(
        `${SITE_URL}/parts/${encodeURIComponent(part.productname)}`,
        today,
        'monthly',
        '0.7'
      ))
      
      if (currentUrls.length >= MAX_URLS_PER_SITEMAP) {
        const filename = `sitemap-${subcategory.categorySlug}-${subcategory.slug}-${currentSitemapIndex}.xml`
        const content = generateSitemapHeader() + currentUrls.join('') + '</urlset>'
        fs.writeFileSync(path.join(OUTPUT_DIR, filename), content, 'utf8')
        console.log(`      ✅ Created ${filename} with ${currentUrls.length.toLocaleString()} URLs`)
        filenames.push(filename)
        currentUrls = []
        currentSitemapIndex++
      }
    }
    
    // Write remaining URLs
    if (currentUrls.length > 0) {
      const filename = `sitemap-${subcategory.categorySlug}-${subcategory.slug}-${currentSitemapIndex}.xml`
      const content = generateSitemapHeader() + currentUrls.join('') + '</urlset>'
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), content, 'utf8')
      console.log(`      ✅ Created ${filename} with ${currentUrls.length.toLocaleString()} URLs`)
      filenames.push(filename)
    }
  }

  return filenames
}

async function generateMainSitemapIndex(
  mainSitemapFile: string,
  categorySitemapFiles: string[],
  today: string
): Promise<void> {
  console.log('\n🗂️  Generating main sitemap index (sitemap.xml)...')
  
  let sitemapIndex = generateSitemapIndexHeader()

  // Add main pages sitemap
  sitemapIndex += generateSitemapIndexEntry(
    `${SITE_URL}/${mainSitemapFile}`,
    today
  )

  // Add all category sitemaps
  for (const filename of categorySitemapFiles) {
    sitemapIndex += generateSitemapIndexEntry(
      `${SITE_URL}/${filename}`,
      today
    )
  }

  sitemapIndex += '</sitemapindex>'

  const outputPath = path.join(OUTPUT_DIR, 'sitemap.xml')
  fs.writeFileSync(outputPath, sitemapIndex, 'utf8')
  console.log(`  ✅ Created sitemap.xml with ${categorySitemapFiles.length + 1} sitemap references`)
}

async function main() {
  try {
    console.log('🚀 Starting hierarchical sitemap generation...')
    console.log('=' .repeat(60))
    
    const today = new Date().toISOString().split('T')[0]
    
    // Step 1: Generate main pages sitemap
    const mainSitemapFile = await generateMainPagesSitemap(today)
    
    // Step 2: Get all categories
    const categories = await getCategories()
    
    const categorySitemapFiles: string[] = []
    let totalUrls = 3 // Homepage, categories page, search page
    
    // Step 3: Generate sitemaps for each category
    for (const category of categories) {
      // Get subcategories
      const subcategories = await getSubcategories(category.name)
      console.log(`  📂 ${category.name}: ${subcategories.length} subcategories`)
      
      // Generate category page sitemap
      await generateCategoryPageSitemap(category, today)
      totalUrls += 1
      
      // Generate subcategory sitemaps (with parts)
      const subcategoryFilenames: string[][] = []
      for (const subcategory of subcategories) {
        const filenames = await generateSubcategorySitemap(subcategory, today)
        subcategoryFilenames.push(filenames)
        
        // Count parts for stats
        const parts = await getPartsBySubcategory(subcategory.category, subcategory.name)
        totalUrls += parts.length + 1 // +1 for subcategory page itself
      }
      
      // Generate category index sitemap
      const categorySitemapFile = await generateCategorySitemap(category, subcategoryFilenames, today)
      categorySitemapFiles.push(categorySitemapFile)
    }
    
    // Step 4: Generate main sitemap index
    await generateMainSitemapIndex(mainSitemapFile, categorySitemapFiles, today)
    
    console.log('\n' + '=' .repeat(60))
    console.log('✨ Hierarchical sitemap generation complete!')
    console.log(`📊 Statistics:`)
    console.log(`   - Categories: ${categories.length}`)
    console.log(`   - Total URLs: ${totalUrls}`)
    console.log(`   - Files created: Check public/ folder`)
    console.log('\n📁 Sitemap Structure:')
    console.log('   sitemap.xml (Main Index)')
    console.log('   ├── sitemap-main.xml (Main pages)')
    for (const category of categories) {
      console.log(`   └── sitemap-${category.slug}.xml (${category.name})`)
      const subcategories = await getSubcategories(category.name)
      for (const subcategory of subcategories) {
        console.log(`       └── sitemap-${category.slug}-${subcategory.slug}.xml (${subcategory.name} + parts)`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

main()


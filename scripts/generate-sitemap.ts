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

function generateSitemapHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`
}

function generateSitemapFooter(): string {
  return '</urlset>'
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

  return Array.from(categoryMap.keys()).map((name) => ({
    name,
    slug: slugify(name),
  }))
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
  }))
}

async function getPartsSample(limit: number = 10000): Promise<Part[]> {
  const { data, error } = await supabase
    .from('products_data')
    .select('productname')
    .eq('manufacturer', 'Amatom')
    .limit(limit)

  if (error) {
    console.error('Error fetching parts:', error)
    return []
  }

  return (data as Part[]) || []
}

async function generateMainSitemap() {
  console.log('🚀 Generating sitemap.xml...')
  const today = new Date().toISOString().split('T')[0]
  
  let sitemap = generateSitemapHeader()

  // Homepage
  sitemap += generateUrlEntry(
    `${SITE_URL}/`,
    today,
    'daily',
    '1.0'
  )

  // Main pages
  sitemap += generateUrlEntry(
    `${SITE_URL}/categories`,
    today,
    'weekly',
    '0.9'
  )

  sitemap += generateUrlEntry(
    `${SITE_URL}/search`,
    today,
    'monthly',
    '0.8'
  )

  // Categories
  const categories = await getCategories()
  console.log(`📦 Found ${categories.length} categories`)

  for (const category of categories) {
    sitemap += generateUrlEntry(
      `${SITE_URL}/categories/${category.slug}`,
      today,
      'weekly',
      '0.9'
    )

    // Subcategories
    const subcategories = await getSubcategories(category.name)
    console.log(`  📂 ${category.name}: ${subcategories.length} subcategories`)

    for (const subcategory of subcategories) {
      sitemap += generateUrlEntry(
        `${SITE_URL}/categories/${category.slug}/${subcategory.slug}`,
        today,
        'weekly',
        '0.8'
      )
    }
  }

  // Sample parts (first 10,000 to keep sitemap size manageable)
  console.log('🔧 Fetching parts sample (10,000 max)...')
  const parts = await getPartsSample(10000)
  console.log(`  Found ${parts.length} parts`)

  for (const part of parts) {
    sitemap += generateUrlEntry(
      `${SITE_URL}/parts/${encodeURIComponent(part.productname)}`,
      today,
      'monthly',
      '0.7'
    )
  }

  sitemap += generateSitemapFooter()

  // Write to file
  const outputPath = path.join(OUTPUT_DIR, 'sitemap.xml')
  fs.writeFileSync(outputPath, sitemap, 'utf8')
  console.log(`✅ Sitemap generated successfully: ${outputPath}`)
  console.log(`📊 Total URLs: ${categories.length + parts.length + 2}`)
}

async function generateSitemapIndex() {
  console.log('🗂️  Generating sitemap index...')
  const today = new Date().toISOString().split('T')[0]

  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-parts-1.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-index.xml')
  fs.writeFileSync(outputPath, sitemapIndex, 'utf8')
  console.log(`✅ Sitemap index generated: ${outputPath}`)
}

async function main() {
  try {
    await generateMainSitemap()
    // Uncomment for sitemap index approach (for very large sites)
    // await generateSitemapIndex()
    console.log('✨ Done!')
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

main()


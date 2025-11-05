#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getDatabaseStats() {
  console.log('📊 Fetching database statistics...\n')
  console.log('='.repeat(60))

  // Total parts count
  const { count: totalParts, error: totalError } = await supabase
    .from('products_data')
    .select('*', { count: 'exact', head: true })
    .eq('manufacturer', 'Amatom')

  if (totalError) {
    console.error('Error fetching total parts:', totalError.message)
    return
  }

  console.log(`\n🔢 TOTAL PARTS: ${totalParts?.toLocaleString() || 0}`)
  console.log('='.repeat(60))

  // Count by category
  const { data: categoryData, error: catError } = await supabase
    .from('products_data')
    .select('category')
    .eq('manufacturer', 'Amatom')

  if (!catError && categoryData) {
    const categoryCount = new Map<string, number>()
    categoryData.forEach(item => {
      const cat = item.category || 'Uncategorized'
      categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1)
    })

    console.log('\n📦 PARTS BY CATEGORY:')
    console.log('-'.repeat(60))
    
    const sortedCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
    
    sortedCategories.forEach(([category, count]) => {
      const percentage = ((count / (totalParts || 1)) * 100).toFixed(1)
      console.log(`   ${category.padEnd(35)} ${count.toLocaleString().padStart(8)} (${percentage}%)`)
    })
  }

  // Count by subcategory (top 10)
  const { data: subcatData, error: subcatError } = await supabase
    .from('products_data')
    .select('sub_category')
    .eq('manufacturer', 'Amatom')

  if (!subcatError && subcatData) {
    const subcategoryCount = new Map<string, number>()
    subcatData.forEach(item => {
      const subcat = item.sub_category || 'Uncategorized'
      subcategoryCount.set(subcat, (subcategoryCount.get(subcat) || 0) + 1)
    })

    console.log('\n🏷️  TOP 10 SUBCATEGORIES:')
    console.log('-'.repeat(60))
    
    const sortedSubcategories = Array.from(subcategoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    
    sortedSubcategories.forEach(([subcategory, count], index) => {
      console.log(`   ${(index + 1).toString().padStart(2)}. ${subcategory.padEnd(32)} ${count.toLocaleString().padStart(8)}`)
    })
  }

  // Sample parts
  const { data: sampleParts, error: sampleError } = await supabase
    .from('products_data')
    .select('productname, category, sub_category')
    .eq('manufacturer', 'Amatom')
    .limit(5)

  if (!sampleError && sampleParts && sampleParts.length > 0) {
    console.log('\n📋 SAMPLE PARTS:')
    console.log('-'.repeat(60))
    sampleParts.forEach((part, index) => {
      console.log(`   ${index + 1}. ${part.productname}`)
      console.log(`      Category: ${part.category} > ${part.sub_category}`)
    })
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ Database statistics complete!')
  console.log('='.repeat(60) + '\n')
}

getDatabaseStats().catch(console.error)


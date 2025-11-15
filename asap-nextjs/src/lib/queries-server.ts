/**
 * Server-Side Database Queries for Next.js
 * These run on the server and are used for SSR/SSG/ISR
 * Use 'server-only' to ensure these don't get bundled for the client
 */
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Part, Category, Subcategory } from '@/types/part'
import { slugify } from './utils'
import { cache } from 'react'

// HARDCODED FALLBACK - Based on actual database data
const HARDCODED_CATEGORIES: Record<string, Category[]> = {
  'Amatom': [
    { name: 'Standoffs', slug: 'standoffs', subcategoryCount: 6 },
    { name: 'Handles', slug: 'handles', subcategoryCount: 2 },
    { name: 'Spacers', slug: 'spacers', subcategoryCount: 7 },
    { name: 'Screws And Bolts', slug: 'screws-and-bolts', subcategoryCount: 2 },
    { name: 'Washers', slug: 'washers', subcategoryCount: 1 },
    { name: 'Bearings And Bushings', slug: 'bearings-and-bushings', subcategoryCount: 1 },
  ]
}

const HARDCODED_SUBCATEGORIES: Record<string, Record<string, Omit<Subcategory, 'category'>[]>> = {
  'Amatom': {
    'standoffs': [
      { name: 'Brass Standoffs', slug: 'brass-standoffs', partCount: 122484 },
      { name: 'Aluminum Standoffs', slug: 'aluminum-standoffs', partCount: 120406 },
      { name: 'Steel Standoffs', slug: 'steel-standoffs', partCount: 82461 },
      { name: 'Stainless Steel Standoffs', slug: 'stainless-steel-standoffs', partCount: 35868 },
      { name: 'Phenolic Standoffs', slug: 'phenolic-standoffs', partCount: 6616 },
      { name: 'Nylon Standoffs', slug: 'nylon-standoffs', partCount: 4645 },
    ],
    'handles': [
      { name: 'Surface Mount Handles', slug: 'surface-mount-handles', partCount: 66634 },
      { name: 'Handle Ferrules', slug: 'handle-ferrules', partCount: 633 },
    ],
    'spacers': [
      { name: 'Aluminum Spacers', slug: 'aluminum-spacers', partCount: 14950 },
      { name: 'Brass Spacers', slug: 'brass-spacers', partCount: 14888 },
      { name: 'Steel Spacers', slug: 'steel-spacers', partCount: 8502 },
      { name: 'Stainless Steel Spacers', slug: 'stainless-steel-spacers', partCount: 4472 },
      { name: 'Phenolic Spacers', slug: 'phenolic-spacers', partCount: 2105 },
      { name: 'Nylon Spacers', slug: 'nylon-spacers', partCount: 1498 },
      { name: 'Cpvc Spacers', slug: 'cpvc-spacers', partCount: 12 },
    ],
    'screws-and-bolts': [
      { name: 'Captive Screws', slug: 'captive-screws', partCount: 13613 },
      { name: 'Jack Screws', slug: 'jack-screws', partCount: 24 },
    ],
    'washers': [
      { name: 'Captive Screw Washers', slug: 'captive-screw-washers', partCount: 160 },
    ],
    'bearings-and-bushings': [
      { name: 'Bushings', slug: 'bushings', partCount: 29 },
    ],
  }
}

/**
 * Get all categories for a manufacturer
 * Cached using React cache() - deduplicates requests during render
 */
export const getCategories = cache(async (manufacturer: string = 'Amatom'): Promise<Category[]> => {
  // Use hardcoded data for Amatom (fastest, most reliable)
  if (manufacturer === 'Amatom' && HARDCODED_CATEGORIES[manufacturer]) {
    return HARDCODED_CATEGORIES[manufacturer]
  }

  const supabase = await createClient()
  
  try {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_categories_summary', {
      p_manufacturer_name: manufacturer
    })
    
    if (!rpcError && rpcData && rpcData.length > 0) {
      return rpcData.map((row: { category_name: string; subcategory_count: number }) => ({
        name: row.category_name,
        slug: slugify(row.category_name),
        subcategoryCount: Number(row.subcategory_count),
      })).sort((a: Category, b: Category) => {
        if (a.name === 'Standoffs') return -1
        if (b.name === 'Standoffs') return 1
        return a.name.localeCompare(b.name)
      })
    }
  } catch (err) {
    console.warn('RPC function failed, using fallback:', err)
  }

  // Fallback: Query database directly
  const { data, error } = await supabase
    .from('products_data')
    .select('category, sub_category')
    .eq('manufacturer', manufacturer)
    .not('category', 'is', null)
    .limit(10000)

  if (error || !data) {
    console.error('Failed to fetch categories:', error)
    return []
  }

  const categoryMap = new Map<string, Set<string>>()
  
  data.forEach((row: { category: string; sub_category: string }) => {
    if (row.category) {
      if (!categoryMap.has(row.category)) {
        categoryMap.set(row.category, new Set())
      }
      if (row.sub_category) {
        categoryMap.get(row.category)!.add(row.sub_category)
      }
    }
  })

  return Array.from(categoryMap.entries())
    .map(([name, subcategories]) => ({
      name,
      slug: slugify(name),
      subcategoryCount: subcategories.size,
    }))
    .sort((a, b) => {
      if (a.name === 'Standoffs') return -1
      if (b.name === 'Standoffs') return 1
      return a.name.localeCompare(b.name)
    })
})

/**
 * Get subcategories for a category
 * Cached using React cache()
 */
export const getSubcategories = cache(async (
  categorySlug: string, 
  manufacturer: string = 'Amatom'
): Promise<Subcategory[]> => {
  // Use hardcoded data for Amatom
  if (manufacturer === 'Amatom' && HARDCODED_SUBCATEGORIES[manufacturer]?.[categorySlug]) {
    const category = HARDCODED_CATEGORIES[manufacturer]?.find(c => c.slug === categorySlug)
    const categoryName = category?.name || categorySlug.replace(/-/g, ' ')
      .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    
    return HARDCODED_SUBCATEGORIES[manufacturer][categorySlug].map(subcat => ({
      ...subcat,
      category: categoryName
    }))
  }

  const supabase = await createClient()
  
  // Get category name from slug
  const categories = await getCategories(manufacturer)
  const category = categories.find(c => c.slug === categorySlug)
  if (!category) return []

  try {
    const { data, error } = await supabase.rpc('get_subcategories_summary', {
      p_category_name: category.name,
      p_manufacturer_name: manufacturer
    })
    
    if (!error && data) {
      return data.map((row: { subcategory_name: string; part_count: number }) => ({
        name: row.subcategory_name,
        slug: slugify(row.subcategory_name),
        partCount: Number(row.part_count),
        category: category.name,
      }))
    }
  } catch (err) {
    console.warn('RPC function failed, using fallback:', err)
  }

  // Fallback
  const { data, error } = await supabase
    .from('products_data')
    .select('sub_category')
    .eq('category', category.name)
    .eq('manufacturer', manufacturer)
    .not('sub_category', 'is', null)
    .limit(10000)

  if (error || !data) return []

  const subcategoryMap = new Map<string, number>()
  data.forEach((row: { sub_category: string }) => {
    if (row.sub_category) {
      subcategoryMap.set(row.sub_category, (subcategoryMap.get(row.sub_category) || 0) + 1)
    }
  })

  return Array.from(subcategoryMap.entries())
    .map(([name, partCount]) => ({
      name,
      slug: slugify(name),
      partCount,
      category: category.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

/**
 * Get parts by subcategory with pagination
 */
export async function getPartsBySubcategory(
  categorySlug: string,
  subcategorySlug: string,
  manufacturer: string = 'Amatom',
  page: number = 1,
  limit: number = 50
): Promise<{ parts: Part[]; total: number }> {
  const supabase = await createClient()
  
  // Get category and subcategory names
  const categories = await getCategories(manufacturer)
  const category = categories.find(c => c.slug === categorySlug)
  if (!category) return { parts: [], total: 0 }

  const subcategories = await getSubcategories(categorySlug, manufacturer)
  const subcategory = subcategories.find(s => s.slug === subcategorySlug)
  if (!subcategory) return { parts: [], total: 0 }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('products_data')
    .select('*', { count: 'exact' })
    .eq('category', category.name)
    .eq('sub_category', subcategory.name)
    .eq('manufacturer', manufacturer)
    .order('productname', { ascending: true })
    .range(from, to)

  if (error) {
    console.error('Error fetching parts:', error)
    return { parts: [], total: 0 }
  }

  return { parts: (data as Part[]) || [], total: count || 0 }
}

/**
 * Get a single part by product name
 * Cached using React cache()
 */
export const getPartByProductname = cache(async (
  productname: string, 
  manufacturer?: string
): Promise<Part | null> => {
  const supabase = await createClient()
  
  let query = supabase
    .from('products_data')
    .select('*')
    .eq('productname', productname)
  
  if (manufacturer) {
    query = query.eq('manufacturer', manufacturer)
  }
  
  const { data, error } = await query.single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching part:', error)
    return null
  }

  return data as Part
})

/**
 * Search parts
 */
export async function searchParts(
  searchQuery: string, 
  manufacturer: string = 'Amatom', 
  limit: number = 50
): Promise<Part[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products_data')
    .select('*')
    .eq('manufacturer', manufacturer)
    .or(`productname.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    .limit(limit)

  if (error) {
    console.error('Error searching parts:', error)
    return []
  }

  return (data as Part[]) || []
}

/**
 * Get all parts count for sitemap generation
 */
export async function getTotalPartsCount(manufacturer: string = 'Amatom'): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('products_data')
    .select('*', { count: 'exact', head: true })
    .eq('manufacturer', manufacturer)

  if (error) {
    console.error('Error counting parts:', error)
    return 0
  }

  return count || 0
}

/**
 * Get parts for sitemap (paginated)
 * Used during build time for generating static params
 */
export async function getPartsForSitemap(
  manufacturer: string = 'Amatom',
  limit: number = 1000,
  offset: number = 0
): Promise<Part[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products_data')
    .select('productname, updated_at')
    .eq('manufacturer', manufacturer)
    .order('productname', { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching parts for sitemap:', error)
    return []
  }

  return (data as Part[]) || []
}


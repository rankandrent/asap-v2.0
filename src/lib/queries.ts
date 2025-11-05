import { supabase } from './supabase'
import type { Part, Category, Subcategory } from '../types/part'
import { slugify } from './utils'

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('products_data')
    .select('category, sub_category')
    .eq('manufacturer', 'Amatom')

  if (error) throw error

  // Get unique categories and count subcategories
  const categoryMap = new Map<string, Set<string>>()

  data?.forEach((part: { category: string; sub_category: string }) => {
    const category = part.category
    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Set())
    }
    categoryMap.get(category)?.add(part.sub_category)
  })

  return Array.from(categoryMap.entries()).map(([name, subcategories]) => ({
    name,
    slug: slugify(name),
    subcategoryCount: subcategories.size,
  }))
}

export const getSubcategories = async (categorySlug: string): Promise<Subcategory[]> => {
  // First, get the actual category name from slug
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === categorySlug)

  if (!category) return []

  const { data, error } = await supabase
    .from('products_data')
    .select('sub_category')
    .eq('category', category.name)
    .eq('manufacturer', 'Amatom')

  if (error) throw error

  // Get unique subcategories and count parts
  const subcategoryMap = new Map<string, number>()

  data?.forEach((part: { sub_category: string }) => {
    const subcategory = part.sub_category
    subcategoryMap.set(subcategory, (subcategoryMap.get(subcategory) || 0) + 1)
  })

  return Array.from(subcategoryMap.entries()).map(([name, partCount]) => ({
    name,
    slug: slugify(name),
    partCount,
    category: category.name,
  }))
}

export const getPartsBySubcategory = async (
  categorySlug: string,
  subcategorySlug: string,
  page: number = 1,
  limit: number = 50
): Promise<{ parts: Part[]; total: number }> => {
  // Get actual category and subcategory names
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === categorySlug)
  if (!category) return { parts: [], total: 0 }

  const subcategories = await getSubcategories(categorySlug)
  const subcategory = subcategories.find((s) => s.slug === subcategorySlug)
  if (!subcategory) return { parts: [], total: 0 }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('products_data')
    .select('*', { count: 'exact' })
    .eq('category', category.name)
    .eq('sub_category', subcategory.name)
    .eq('manufacturer', 'Amatom')
    .order('productname', { ascending: true })
    .range(from, to)

  if (error) throw error

  return { parts: (data as Part[]) || [], total: count || 0 }
}

export const getPartByProductname = async (productname: string): Promise<Part | null> => {
  const { data, error } = await supabase
    .from('products_data')
    .select('*')
    .eq('productname', productname)
    .eq('manufacturer', 'Amatom')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }

  return data as Part
}

export const searchParts = async (query: string, limit: number = 50): Promise<Part[]> => {
  const { data, error } = await supabase
    .from('products_data')
    .select('*')
    .eq('manufacturer', 'Amatom')
    .or(`productname.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(limit)

  if (error) throw error

  return (data as Part[]) || []
}


import { supabase, slugify } from './supabase'

export interface Part {
  id: number
  productname: string
  description: string
  category: string
  sub_category: string
  manufacturer: string
  specifications?: Record<string, any>
  images?: string[]
  price?: number
  availability_status?: string
  quantity?: number
  lead_time?: string
}

export interface Category {
  name: string
  slug: string
  subcategoryCount: number
}

export interface Subcategory {
  name: string
  slug: string
  partCount: number
  category: string
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('products_data')
    .select('category, sub_category')
    .eq('manufacturer', 'Amatom')

  if (error) throw error

  const categoryMap = new Map<string, Set<string>>()

  data?.forEach((part: { category: string; sub_category: string }) => {
    if (!categoryMap.has(part.category)) {
      categoryMap.set(part.category, new Set())
    }
    categoryMap.get(part.category)?.add(part.sub_category)
  })

  return Array.from(categoryMap.entries()).map(([name, subcategories]) => ({
    name,
    slug: slugify(name),
    subcategoryCount: subcategories.size,
  }))
}

export async function getSubcategories(categorySlug: string): Promise<Subcategory[]> {
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === categorySlug)

  if (!category) return []

  const { data, error } = await supabase
    .from('products_data')
    .select('sub_category')
    .eq('category', category.name)
    .eq('manufacturer', 'Amatom')

  if (error) throw error

  const subcategoryMap = new Map<string, number>()

  data?.forEach((part: { sub_category: string }) => {
    subcategoryMap.set(part.sub_category, (subcategoryMap.get(part.sub_category) || 0) + 1)
  })

  return Array.from(subcategoryMap.entries()).map(([name, partCount]) => ({
    name,
    slug: slugify(name),
    partCount,
    category: category.name,
  }))
}

export async function getPartsBySubcategory(
  categorySlug: string,
  subcategorySlug: string,
  page: number = 1,
  limit: number = 50
): Promise<{ parts: Part[]; total: number }> {
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

export async function getPartByProductname(productname: string): Promise<Part | null> {
  const { data, error } = await supabase
    .from('products_data')
    .select('*')
    .eq('productname', productname)
    .eq('manufacturer', 'Amatom')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as Part
}

export async function getAllPartProductnames(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products_data')
    .select('productname')
    .eq('manufacturer', 'Amatom')
    .limit(10000) // Limit for sitemap generation

  if (error) throw error

  return data?.map((p: { productname: string }) => p.productname) || []
}


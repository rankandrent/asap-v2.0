import { supabase } from './supabase'
import type { Part, Category, Subcategory } from '../types/part'
import { slugify } from './utils'

// Helper function removed - using Promise.race directly in queries

export const getCategories = async (manufacturer: string): Promise<Category[]> => {
  if (!manufacturer || manufacturer.trim() === '') {
    console.error('❌ getCategories: No manufacturer provided')
    return []
  }
  
  console.log(`🔄 getCategories: Starting for manufacturer: ${manufacturer}`)
  const startTime = Date.now()
  
  // OPTIMIZED: Try to use RPC function first (fastest), fallback to sampling
  try {
    console.log('🔍 getCategories: Trying RPC function...')
    // Try to use the database function (much faster) with timeout
    const rpcPromise = supabase.rpc('get_categories_summary', {
      p_manufacturer_name: manufacturer
    }).then(result => result)
    
    const timeoutPromise = new Promise<{ data: null; error: { message: string; code: string } }>((resolve) => {
      setTimeout(() => {
        resolve({ data: null, error: { message: 'RPC timeout', code: 'TIMEOUT' } })
      }, 5000)
    })
    
    const result = await Promise.race([rpcPromise, timeoutPromise]).catch((err) => {
      console.warn('⚠️ getCategories: RPC function timeout or error:', err)
      return { data: null, error: { message: 'RPC timeout', code: 'TIMEOUT' } }
    })
    
    const rpcData = result.data
    const rpcError = result.error
    
    // Check if RPC function exists (error code 42883 means function doesn't exist)
    if (rpcError) {
      if (rpcError.code === '42883' || rpcError.message?.includes('function') || rpcError.message?.includes('does not exist')) {
        console.warn('⚠️ getCategories: RPC function does not exist, using fallback method')
      } else {
        console.warn('⚠️ getCategories: RPC function error:', rpcError)
      }
    } else if (rpcData && rpcData.length > 0) {
      console.log('✅ getCategories: RPC function succeeded!', rpcData.length, 'categories')
      // Use RPC function results (fastest path)
      const categories = rpcData.map((row: { category_name: string; subcategory_count: number }) => ({
        name: row.category_name,
        slug: slugify(row.category_name),
        subcategoryCount: Number(row.subcategory_count),
      })).sort((a: Category, b: Category) => {
        // "Standoffs" should always appear first
        if (a.name === 'Standoffs' && b.name !== 'Standoffs') return -1
        if (b.name === 'Standoffs' && a.name !== 'Standoffs') return 1
        return a.name.localeCompare(b.name)
      })
      console.log(`✅ getCategories: Completed in ${Date.now() - startTime}ms`)
      return categories
    } else {
      console.warn('⚠️ getCategories: RPC function returned no data, using fallback')
    }
  } catch (err) {
    console.warn('⚠️ getCategories: RPC function exception, using fallback:', err)
    // Continue with fallback method
  }
  
  // FALLBACK: Fast single query with reasonable limit
  // Fetch enough data to get all unique categories (typically just 1-2 categories)
  console.log('🔄 getCategories: Using fallback method...')
  const categoryMap = new Map<string, Set<string>>()
  const FAST_SAMPLE = 2000 // Reduced to 2k for faster loading (should get all categories)
  
  try {
    // Single query - fast and efficient with timeout
    const queryPromise = supabase
      .from('products_data')
      .select('category, sub_category')
      .eq('manufacturer', manufacturer)
      .not('category', 'is', null)
      .neq('category', '')
      .not('sub_category', 'is', null)
      .neq('sub_category', '')
      .limit(FAST_SAMPLE)
      .then(result => result)
    
    const timeoutPromise = new Promise<{ data: null; error: unknown }>((resolve) => {
      setTimeout(() => {
        resolve({ data: null, error: new Error('Query timeout') })
      }, 8000)
    })
    
    const result = await Promise.race([queryPromise, timeoutPromise]).catch((err) => {
      console.error('Query timeout:', err)
      return { data: null, error: err }
    })
    
    const data = result.data
    const error = result.error
    
    if (error) {
      console.error('❌ getCategories: Query error:', error)
      throw error
    }
    
    if (data && data.length > 0) {
      console.log(`📦 getCategories: Fetched ${data.length} parts`)
      // Process all data at once (fast)
      data.forEach((part: { category: string; sub_category: string }) => {
        const cat = part.category?.trim()
        const subCat = part.sub_category?.trim()
        
        if (cat) {
          if (!categoryMap.has(cat)) {
            categoryMap.set(cat, new Set())
          }
          if (subCat) {
            categoryMap.get(cat)?.add(subCat)
          }
        }
      })
      console.log(`✅ getCategories: Found ${categoryMap.size} categories`)
    } else {
      console.warn('⚠️ getCategories: No data returned from query')
    }
  } catch (err) {
    console.error('❌ getCategories: Error in fallback method:', err)
    // Return empty array if query fails
    return []
  }

  // Convert to Category array and sort
  const categories = Array.from(categoryMap.entries())
    .map(([name, subcategories]) => ({
      name,
      slug: slugify(name),
      subcategoryCount: subcategories.size,
    }))
    .sort((a: Category, b: Category) => {
      // "Standoffs" should always appear first
      if (a.name === 'Standoffs' && b.name !== 'Standoffs') return -1
      if (b.name === 'Standoffs' && a.name !== 'Standoffs') return 1
      // Otherwise sort alphabetically
      return a.name.localeCompare(b.name)
    })

  console.log(`✅ getCategories: Completed in ${Date.now() - startTime}ms, returning ${categories.length} categories`)
  return categories
}

// Helper function to get category name from slug (more efficient)
const getCategoryNameFromSlug = async (categorySlug: string, manufacturer: string): Promise<string | null> => {
  if (!manufacturer || manufacturer.trim() === '') {
    console.error('❌ getCategoryNameFromSlug: No manufacturer provided')
    return null
  }
  
  if (!categorySlug || categorySlug.trim() === '') {
    console.error('❌ getCategoryNameFromSlug: No category slug provided')
    return null
  }
  
  console.log(`🔍 getCategoryNameFromSlug: Looking for category slug: ${categorySlug}, manufacturer: ${manufacturer}`)
  
  // Get all unique category names (should be just a few, so no pagination needed)
  const { data, error } = await supabase
    .from('products_data')
    .select('category')
    .eq('manufacturer', manufacturer)
    .not('category', 'is', null)
    .neq('category', '')
    .limit(1000) // Should be enough for unique categories

  if (error) {
    console.error('❌ getCategoryNameFromSlug: Query error:', error)
    throw error
  }

  if (!data || data.length === 0) {
    console.warn(`⚠️ getCategoryNameFromSlug: No data found for manufacturer: ${manufacturer}`)
    return null
  }

  // Find category name that matches the slug
  const categorySet = new Set<string>()
  data.forEach((part: { category: string }) => {
    if (part.category && part.category.trim() !== '') {
      categorySet.add(part.category.trim())
    }
  })

  console.log(`📦 getCategoryNameFromSlug: Found ${categorySet.size} unique categories:`, Array.from(categorySet))

  for (const categoryName of categorySet) {
    const categorySlugFromName = slugify(categoryName)
    if (categorySlugFromName === categorySlug) {
      console.log(`✅ getCategoryNameFromSlug: Found match! ${categoryName} -> ${categorySlug}`)
      return categoryName
    }
  }

  console.warn(`⚠️ getCategoryNameFromSlug: No category found for slug: ${categorySlug}`)
  console.warn(`Available categories:`, Array.from(categorySet).map(c => `${c} -> ${slugify(c)}`))
  return null
}

export const getSubcategories = async (categorySlug: string, manufacturer: string): Promise<Subcategory[]> => {
  if (!manufacturer || manufacturer.trim() === '') {
    console.error('❌ getSubcategories: No manufacturer provided')
    return []
  }
  
  if (!categorySlug || categorySlug.trim() === '') {
    console.error('❌ getSubcategories: No category slug provided')
    return []
  }
  
  console.log(`🔄 getSubcategories: Starting for category: ${categorySlug}, manufacturer: ${manufacturer}`)
  
  // Get the actual category name from slug (more efficient)
  let categoryName: string | null = null
  try {
    categoryName = await getCategoryNameFromSlug(categorySlug, manufacturer)
  } catch (err) {
    console.error('❌ getSubcategories: Error getting category name:', err)
    // Continue with fallback - try to find category name directly from query
  }

  if (!categoryName) {
    console.warn(`⚠️ getSubcategories: Category not found for slug: ${categorySlug}, trying direct query...`)
    
    // FALLBACK: Try to find category name by querying with slug directly
    // This is less efficient but might work if category name lookup failed
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('products_data')
        .select('category')
        .eq('manufacturer', manufacturer)
        .not('category', 'is', null)
        .neq('category', '')
        .limit(100)
      
      if (!categoryError && categoryData) {
        // Find category that matches slug
        for (const part of categoryData) {
          if (part.category && slugify(part.category) === categorySlug) {
            categoryName = part.category.trim()
            console.log(`✅ getSubcategories: Found category name via fallback: ${categoryName}`)
            break
          }
        }
      }
    } catch (err) {
      console.error('❌ getSubcategories: Fallback category lookup failed:', err)
    }
    
    if (!categoryName) {
      console.error(`❌ getSubcategories: Could not find category for slug: ${categorySlug}`)
      return []
    }
  }

  console.log(`📦 getSubcategories: Using category name: ${categoryName}`)

  // OPTIMIZED: Try to use RPC function first (fastest), fallback to sampling
  try {
    console.log('🔍 getSubcategories: Trying RPC function...')
    // Try to use the database function (much faster)
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_subcategories_summary', {
      p_category_name: categoryName,
      p_manufacturer_name: manufacturer
    })
    
    // Check if RPC function exists
    if (rpcError) {
      if (rpcError.code === '42883' || rpcError.message?.includes('function') || rpcError.message?.includes('does not exist')) {
        console.warn('⚠️ getSubcategories: RPC function does not exist, using fallback method')
      } else {
        console.warn('⚠️ getSubcategories: RPC function error:', rpcError)
      }
    } else if (rpcData && rpcData.length > 0) {
      console.log('✅ getSubcategories: RPC function succeeded!', rpcData.length, 'subcategories')
      // Use RPC function results (fastest path)
      return rpcData.map((row: { subcategory_name: string; part_count: number }) => ({
        name: row.subcategory_name,
        slug: slugify(row.subcategory_name),
        partCount: Number(row.part_count),
        category: categoryName,
      })).sort((a: Subcategory, b: Subcategory) => a.name.localeCompare(b.name))
    } else {
      console.warn('⚠️ getSubcategories: RPC function returned no data, using fallback')
    }
  } catch (err) {
    console.warn('⚠️ getSubcategories: RPC function exception, using fallback method:', err)
    // Continue with fallback method
  }

  // FALLBACK: Use efficient sampling to get all unique subcategories
  // For large categories, sample to get unique subcategories (exact counts not critical)
  const subcategoryMap = new Map<string, number>()
  const SAMPLE_SIZE = 10000 // Sample 10k parts to get all unique subcategories
  
  try {
    console.log(`🔄 getSubcategories: Using fallback method - sampling ${SAMPLE_SIZE} parts...`)
    
    // Fetch a large sample to get all unique subcategories
    const { data, error } = await supabase
      .from('products_data')
      .select('sub_category')
      .eq('category', categoryName)
      .eq('manufacturer', manufacturer)
      .not('sub_category', 'is', null)
      .neq('sub_category', '')
      .limit(SAMPLE_SIZE)
    
    if (error) {
      console.error('❌ getSubcategories: Query error:', error)
      // Return empty array if query fails
      return []
    }
    
    if (data && data.length > 0) {
      console.log(`📦 getSubcategories: Fetched ${data.length} parts in sample`)
      
      // Count parts per subcategory in sample
      data.forEach((part: { sub_category: string }) => {
        if (part.sub_category && part.sub_category.trim() !== '') {
          const subcategory = part.sub_category.trim()
          subcategoryMap.set(subcategory, (subcategoryMap.get(subcategory) || 0) + 1)
        }
      })
      
      console.log(`✅ getSubcategories: Found ${subcategoryMap.size} unique subcategories in sample`)
      
      // If we got the full sample size, we might need to get actual counts
      // For now, the sample count is a good approximation
      // The subcategories will still show, just with approximate counts
      if (data.length >= SAMPLE_SIZE) {
        console.warn('⚠️ getSubcategories: Sample size reached - using approximate counts')
      }
    } else {
      console.warn('⚠️ getSubcategories: No data returned from query')
      return []
    }
  } catch (err) {
    console.error('❌ getSubcategories: Error in fallback method:', err)
    // Return empty array if query fails
    return []
  }

  return Array.from(subcategoryMap.entries())
    .map(([name, partCount]) => ({
      name,
      slug: slugify(name),
      partCount,
      category: categoryName,
    }))
    .sort((a: Subcategory, b: Subcategory) => a.name.localeCompare(b.name)) // Sort alphabetically
}

export const getPartsBySubcategory = async (
  categorySlug: string,
  subcategorySlug: string,
  manufacturer: string,
  page: number = 1,
  limit: number = 50
): Promise<{ parts: Part[]; total: number }> => {
  // Get actual category and subcategory names (more efficient)
  const categoryName = await getCategoryNameFromSlug(categorySlug, manufacturer)
  if (!categoryName) return { parts: [], total: 0 }

  // Get subcategory name - fetch a sample to find the matching one
  // We only need to check unique subcategories, not all parts
  const { data: subcategoryData, error: subError } = await supabase
    .from('products_data')
    .select('sub_category')
    .eq('category', categoryName)
    .eq('manufacturer', manufacturer)
    .not('sub_category', 'is', null)
    .neq('sub_category', '')
    .limit(1000) // Should be enough to find unique subcategories

  if (subError) throw subError

  // Find subcategory name that matches the slug
  const subcategorySet = new Set<string>()
  subcategoryData?.forEach((part: { sub_category: string }) => {
    if (part.sub_category && part.sub_category.trim() !== '') {
      subcategorySet.add(part.sub_category.trim())
    }
  })

  let subcategoryName: string | null = null
  for (const subName of subcategorySet) {
    if (slugify(subName) === subcategorySlug) {
      subcategoryName = subName
      break
    }
  }

  if (!subcategoryName) return { parts: [], total: 0 }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('products_data')
    .select('*', { count: 'exact' })
    .eq('category', categoryName)
    .eq('sub_category', subcategoryName)
    .eq('manufacturer', manufacturer)
    .order('productname', { ascending: true })
    .range(from, to)

  if (error) throw error

  return { parts: (data as Part[]) || [], total: count || 0 }
}

export const getPartByProductname = async (productname: string, manufacturer?: string): Promise<Part | null> => {
  let query = supabase
    .from('products_data')
    .select('*')
    .eq('productname', productname)
  
  // If manufacturer is provided, filter by it
  if (manufacturer) {
    query = query.eq('manufacturer', manufacturer)
  }
  
  const { data, error } = await query.single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }

  return data as Part
}

export const searchParts = async (searchQuery: string, manufacturer: string, limit: number = 50): Promise<Part[]> => {
  const { data, error } = await supabase
    .from('products_data')
    .select('*')
    .eq('manufacturer', manufacturer)
    .or(`productname.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    .limit(limit)

  if (error) throw error

  return (data as Part[]) || []
}


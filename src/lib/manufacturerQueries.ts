import { supabase } from './supabase'
import type { Manufacturer } from '../types/manufacturer'
import { slugify } from './utils'

// Helper function removed - using Promise.race directly in queries

/**
 * Get all manufacturers from the database
 * This automatically discovers all manufacturers without hardcoding
 */
export const getManufacturers = async (): Promise<Manufacturer[]> => {
  console.log('🔄 getManufacturers: Starting...')
  const startTime = Date.now()
  
  const manufacturerMap = new Map<string, { partCount: number; categories: Set<string> }>()
  const SAMPLE_SIZE = 10000 // Increased to 10k to ensure we get all manufacturers
  
  try {
    // Fetch sample of parts to discover all manufacturers
    const queryPromise = supabase
      .from('products_data')
      .select('manufacturer, category')
      .not('manufacturer', 'is', null)
      .neq('manufacturer', '')
      .limit(SAMPLE_SIZE)
      .then(result => result)
    
    const timeoutPromise = new Promise<{ data: null; error: unknown }>((resolve) => {
      setTimeout(() => {
        resolve({ data: null, error: new Error('Query timeout') })
      }, 10000)
    })
    
    const result = await Promise.race([queryPromise, timeoutPromise]).catch((err) => {
      console.error('⚠️ getManufacturers: Query timeout:', err)
      return { data: null, error: err }
    })
    
    const data = result.data
    const error = result.error
    
    if (error) {
      console.error('❌ getManufacturers: Query error:', error)
      // Don't throw - return empty array so app can still work with default
      console.warn('⚠️ getManufacturers: Returning empty array, app will use default manufacturer')
      return []
    }
    
    if (data && data.length > 0) {
      console.log(`📦 getManufacturers: Fetched ${data.length} parts`)
      
      // Process data to get unique manufacturers
      data.forEach((part: { manufacturer: string; category: string }) => {
        const manufacturer = part.manufacturer?.trim()
        const category = part.category?.trim()
        
        if (manufacturer) {
          if (!manufacturerMap.has(manufacturer)) {
            manufacturerMap.set(manufacturer, { partCount: 0, categories: new Set() })
          }
          
          const manufacturerData = manufacturerMap.get(manufacturer)!
          manufacturerData.partCount++
          
          if (category) {
            manufacturerData.categories.add(category)
          }
        }
      })
      
      console.log(`✅ getManufacturers: Found ${manufacturerMap.size} manufacturers`)
    } else {
      console.warn('⚠️ getManufacturers: No data returned from query - database might be empty or connection issue')
      // Return empty array - app will use default manufacturer
      return []
    }
  } catch (err) {
    console.error('❌ getManufacturers: Exception:', err)
    // Return empty array if query fails - app will use default manufacturer
    return []
  }

  // Convert to Manufacturer array and sort
  const manufacturers = Array.from(manufacturerMap.entries())
    .map(([name, data]) => ({
      name,
      slug: slugify(name),
      partCount: data.partCount,
      categoryCount: data.categories.size,
    }))
    .sort((a, b) => {
      // Sort by part count (descending) then by name
      if (b.partCount !== a.partCount) {
        return b.partCount - a.partCount
      }
      return a.name.localeCompare(b.name)
    })

  console.log(`✅ getManufacturers: Completed in ${Date.now() - startTime}ms, returning ${manufacturers.length} manufacturers`)
  return manufacturers
}

/**
 * Get exact manufacturer statistics using database function (if available)
 */
export const getManufacturerStats = async (manufacturerName: string): Promise<{ partCount: number; categoryCount: number } | null> => {
  try {
    // Try to use database function for exact counts
    const { data, error } = await supabase
      .rpc('get_manufacturer_stats', { p_manufacturer_name: manufacturerName })
      .single()
    
    if (!error && data && typeof data === 'object') {
      const dataObj = data as Record<string, unknown>
      if ('part_count' in dataObj && 'category_count' in dataObj) {
        return {
          partCount: Number(dataObj.part_count || 0),
          categoryCount: Number(dataObj.category_count || 0),
        }
      }
    }
  } catch (err) {
    console.warn('RPC function not available, using approximate counts')
  }
  
  // Fallback: approximate counts from sample
  return null
}


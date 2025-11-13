import { useQuery } from '@tanstack/react-query'
import { getSubcategories } from '../lib/queries'
import type { Subcategory } from '../types/part'
import { useManufacturerContext } from '../contexts/ManufacturerContext'

export const useSubcategories = (categorySlug: string) => {
  const { selectedManufacturer } = useManufacturerContext()
  
  // Enable query immediately if manufacturer and categorySlug are set
  const isEnabled = !!categorySlug && categorySlug.trim() !== '' && !!selectedManufacturer && selectedManufacturer.trim() !== ''
  
  return useQuery<Subcategory[]>({
    queryKey: ['subcategories', categorySlug, selectedManufacturer],
    queryFn: async () => {
      if (!selectedManufacturer || selectedManufacturer.trim() === '') {
        console.error('❌ useSubcategories: No manufacturer selected')
        throw new Error('No manufacturer selected')
      }
      if (!categorySlug || categorySlug.trim() === '') {
        console.error('❌ useSubcategories: No category slug provided')
        throw new Error('No category slug provided')
      }
      console.log(`🔄 useSubcategories: Fetching subcategories for category: ${categorySlug}, manufacturer: ${selectedManufacturer}`)
      const subcategories = await getSubcategories(categorySlug, selectedManufacturer)
      console.log(`✅ useSubcategories: Loaded ${subcategories.length} subcategories:`, subcategories.map(s => `${s.name} (${s.partCount} parts)`))
      
      if (subcategories.length === 0) {
        console.warn('⚠️ useSubcategories: No subcategories found! This might indicate:')
        console.warn('  1. Category not found in database')
        console.warn('  2. No subcategories exist for this category')
        console.warn('  3. Query filters are too strict')
        console.warn('  4. Category name lookup failed')
      }
      
      return subcategories
    },
    enabled: isEnabled, // Enable immediately if manufacturer and categorySlug are set
    staleTime: 30 * 60 * 1000, // 30 minutes - cache for 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache for 1 hour
    retry: 2, // Retry 2 times on error
    retryDelay: 1000, // Wait 1 second between retries
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch on mount to ensure fresh data
  })
}


import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../lib/queries'
import type { Category } from '../types/part'
import { useManufacturerContext } from '../contexts/ManufacturerContext'

export const useCategories = () => {
  const { selectedManufacturer } = useManufacturerContext()
  
  // Manufacturer is always set (defaults to "Amatom"), so we can enable queries immediately
  const isEnabled = !!selectedManufacturer && selectedManufacturer.trim() !== ''
  
  return useQuery<Category[]>({
    queryKey: ['categories', selectedManufacturer],
    queryFn: async () => {
      try {
        if (!selectedManufacturer || selectedManufacturer.trim() === '') {
          console.error('❌ useCategories: No manufacturer selected')
          throw new Error('No manufacturer selected')
        }
        console.log(`🔄 useCategories: Fetching categories for manufacturer: ${selectedManufacturer}`)
        const categories = await getCategories(selectedManufacturer)
        console.log(`✅ useCategories: Loaded ${categories.length} categories:`, categories.map(c => `${c.name} (${c.subcategoryCount} subcategories)`))
        
        if (categories.length === 0) {
          console.warn('⚠️ useCategories: No categories found! This might indicate:')
          console.warn('  1. Database connection issue')
          console.warn('  2. No data in database for manufacturer:', selectedManufacturer)
          console.warn('  3. Query filters are too strict')
        }
        
        return categories
      } catch (error) {
        console.error('❌ useCategories: Error:', error)
        throw error
      }
    },
    enabled: isEnabled, // Enable immediately if manufacturer is set (always true since we default to "Amatom")
    staleTime: 30 * 60 * 1000, // 30 minutes - cache for 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache for 1 hour
    retry: 2, // Retry 2 times on error
    retryDelay: 1000, // Wait 1 second between retries
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch on mount to ensure fresh data
    refetchOnReconnect: false, // Don't refetch on reconnect
  })
}


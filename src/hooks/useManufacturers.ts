import { useQuery } from '@tanstack/react-query'
import { getManufacturers } from '../lib/manufacturerQueries'
import type { Manufacturer } from '../types/manufacturer'

export const useManufacturers = () => {
  return useQuery<Manufacturer[]>({
    queryKey: ['manufacturers'],
    queryFn: async () => {
      try {
        const manufacturers = await getManufacturers()
        console.log('Manufacturers loaded:', manufacturers.length, manufacturers.map(m => m.name))
        return manufacturers
      } catch (error) {
        console.error('Error in useManufacturers:', error)
        throw error
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour - manufacturers don't change often
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep in cache for 24 hours
    retry: 1, // Retry 1 time on error
    retryDelay: 500, // Wait 0.5 second between retries
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
  })
}


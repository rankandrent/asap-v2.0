import { useQuery } from '@tanstack/react-query'
import { getPartsBySubcategory } from '../lib/queries'
import type { Part } from '../types/part'
import { useManufacturerContext } from '../contexts/ManufacturerContext'

export interface PartsListResponse {
  parts: Part[]
  total: number
}

export const usePartsList = (
  category: string,
  subcategory: string,
  page: number
) => {
  const { selectedManufacturer } = useManufacturerContext()
  
  return useQuery<PartsListResponse>({
    queryKey: ['parts', category, subcategory, selectedManufacturer, page],
    queryFn: () => {
      if (!selectedManufacturer) {
        throw new Error('No manufacturer selected')
      }
      return getPartsBySubcategory(category, subcategory, selectedManufacturer, page)
    },
    enabled: !!category && !!subcategory && !!selectedManufacturer,
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}


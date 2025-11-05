import { useQuery } from '@tanstack/react-query'
import { getPartsBySubcategory } from '../lib/queries'
import type { Part } from '../types/part'

export interface PartsListResponse {
  parts: Part[]
  total: number
}

export const usePartsList = (
  category: string,
  subcategory: string,
  page: number
) => {
  return useQuery<PartsListResponse>({
    queryKey: ['parts', category, subcategory, page],
    queryFn: () => getPartsBySubcategory(category, subcategory, page),
    enabled: !!category && !!subcategory,
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}


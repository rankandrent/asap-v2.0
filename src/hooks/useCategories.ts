import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../lib/queries'
import type { Category } from '../types/part'

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: false, // Don't retry on error
  })
}


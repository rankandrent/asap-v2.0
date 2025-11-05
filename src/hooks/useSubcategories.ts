import { useQuery } from '@tanstack/react-query'
import { getSubcategories } from '../lib/queries'
import type { Subcategory } from '../types/part'

export const useSubcategories = (categorySlug: string) => {
  return useQuery<Subcategory[]>({
    queryKey: ['subcategories', categorySlug],
    queryFn: () => getSubcategories(categorySlug),
    enabled: !!categorySlug,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}


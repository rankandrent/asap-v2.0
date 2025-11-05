import { useQuery } from '@tanstack/react-query'
import { getPartByProductname } from '../lib/queries'
import type { Part } from '../types/part'

export const usePart = (productname: string) => {
  return useQuery<Part | null>({
    queryKey: ['part', productname],
    queryFn: () => getPartByProductname(productname),
    enabled: !!productname,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}


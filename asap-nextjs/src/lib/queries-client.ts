/**
 * Client-Side Database Queries for React Query
 * These run in the browser and are used for dynamic client-side data fetching
 */
'use client'

import { createClient } from '@/lib/supabase/client'
import type { Part } from '@/types/part'

const supabase = createClient()

/**
 * Search parts (client-side)
 */
export async function searchParts(
  searchQuery: string, 
  manufacturer: string = 'Amatom', 
  limit: number = 50
): Promise<Part[]> {
  const { data, error } = await supabase
    .from('products_data')
    .select('*')
    .eq('manufacturer', manufacturer)
    .or(`productname.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    .limit(limit)

  if (error) {
    console.error('Error searching parts:', error)
    throw error
  }

  return (data as Part[]) || []
}

/**
 * Get related parts (client-side)
 */
export async function getRelatedParts(
  category: string,
  subcategory: string,
  currentPartId: number,
  manufacturer: string = 'Amatom',
  limit: number = 8
): Promise<Part[]> {
  const { data, error } = await supabase
    .from('products_data')
    .select('*')
    .eq('category', category)
    .eq('sub_category', subcategory)
    .eq('manufacturer', manufacturer)
    .neq('id', currentPartId)
    .limit(limit)

  if (error) {
    console.error('Error fetching related parts:', error)
    return []
  }

  return (data as Part[]) || []
}


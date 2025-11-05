import { supabase } from './supabase'
import type { Part } from '../types/part'

export interface PartAvailability {
  available: boolean
  partNumber: string
  part?: Part
  alternativeParts?: Part[]
  message: string
}

/**
 * Check if a specific part is available in database
 */
export const checkPartAvailability = async (partNumber: string): Promise<PartAvailability> => {
  try {
    // Clean up part number (remove spaces, convert to uppercase)
    const cleanPartNumber = partNumber.trim().toUpperCase()

    // Search for exact match first
    const { data: exactMatch, error } = await supabase
      .from('products_data')
      .select('*')
      .eq('manufacturer', 'Amatom')
      .ilike('productname', cleanPartNumber)
      .limit(1)
      .single()

    if (exactMatch && !error) {
      return {
        available: true,
        partNumber: exactMatch.productname,
        part: exactMatch as Part,
        message: `✅ Great news! ${exactMatch.productname} is available in stock!`
      }
    }

    // If exact match not found, search for similar parts
    const { data: similarParts } = await supabase
      .from('products_data')
      .select('*')
      .eq('manufacturer', 'Amatom')
      .or(`productname.ilike.%${cleanPartNumber}%,description.ilike.%${cleanPartNumber}%`)
      .limit(5)

    if (similarParts && similarParts.length > 0) {
      return {
        available: true,
        partNumber: cleanPartNumber,
        alternativeParts: similarParts as Part[],
        message: `I found ${similarParts.length} similar parts that might work for you!`
      }
    }

    // Part not found - but we can arrange it!
    return {
      available: false,
      partNumber: cleanPartNumber,
      message: `While ${cleanPartNumber} isn't currently in our warehouse, we can source it through our extensive supplier network!`
    }
  } catch (error) {
    console.error('Part lookup error:', error)
    return {
      available: false,
      partNumber: partNumber,
      message: `Let me check with our team about ${partNumber} and get back to you with availability and pricing.`
    }
  }
}

/**
 * Search parts by category or description
 */
export const searchPartsByDescription = async (description: string): Promise<Part[]> => {
  try {
    const { data, error } = await supabase
      .from('products_data')
      .select('*')
      .eq('manufacturer', 'Amatom')
      .or(`category.ilike.%${description}%,sub_category.ilike.%${description}%,description.ilike.%${description}%`)
      .limit(10)

    if (error) throw error
    return (data as Part[]) || []
  } catch (error) {
    console.error('Part search error:', error)
    return []
  }
}

/**
 * Get parts by category for quick suggestions
 */
export const getPartsByCategory = async (category: string, limit: number = 5): Promise<Part[]> => {
  try {
    const { data, error } = await supabase
      .from('products_data')
      .select('*')
      .eq('manufacturer', 'Amatom')
      .ilike('category', `%${category}%`)
      .limit(limit)

    if (error) throw error
    return (data as Part[]) || []
  } catch (error) {
    console.error('Category parts error:', error)
    return []
  }
}

/**
 * Extract potential part numbers from user message
 */
export const extractPartNumber = (message: string): string | null => {
  // Common part number patterns
  const patterns = [
    /\b([A-Z0-9]{3,}[-_][A-Z0-9][-_0-9]+)\b/gi, // ABC-123-XYZ format
    /\b([A-Z]{2,}[0-9]{3,}[A-Z0-9]*)\b/gi,      // MS21209-C4 format
    /\b([0-9]{4,}[-_][A-Z0-9][-_0-9]*)\b/gi,    // 17300-B-0256-0 format
  ]

  for (const pattern of patterns) {
    const matches = message.match(pattern)
    if (matches && matches.length > 0) {
      return matches[0].toUpperCase()
    }
  }

  return null
}


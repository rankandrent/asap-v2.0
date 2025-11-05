export interface Part {
  id: number
  created_at: string
  manufacturer: string // Always "Amatom"
  productname: string // Unique identifier
  description: string
  category: string
  sub_category: string
  specifications?: Record<string, any>
  images?: string[]
  price?: number
  availability_status?: string
  quantity?: number
  lead_time?: string
  certifications?: string[]
  updated_at?: string
}

export interface Category {
  name: string
  slug: string
  subcategoryCount: number
  image?: string
}

export interface Subcategory {
  name: string
  slug: string
  partCount: number
  category: string
  image?: string
}


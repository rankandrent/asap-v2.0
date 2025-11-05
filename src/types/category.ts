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


import { MetadataRoute } from 'next'
import { getCategories, getSubcategories, getTotalPartsCount } from '@/lib/queries-server'

/**
 * Generate dynamic sitemap for Next.js
 * For 500k+ parts, we create a sitemap index that points to multiple sitemaps
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://asap-amatom.com'
  const manufacturer = 'Amatom'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Get all categories
  const categories = await getCategories(manufacturer)
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Get all subcategories
  const subcategoryPages: MetadataRoute.Sitemap = []
  for (const category of categories) {
    const subcategories = await getSubcategories(category.slug, manufacturer)
    for (const subcategory of subcategories) {
      subcategoryPages.push({
        url: `${baseUrl}/categories/${category.slug}/${subcategory.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  // For 500k+ parts, we don't add all of them to the main sitemap
  // Instead, they'll be generated on-demand with ISR
  // If you need a full sitemap, create a sitemap index with multiple sitemap files
  
  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
  ]
}


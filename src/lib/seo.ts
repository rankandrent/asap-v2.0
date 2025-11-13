/**
 * SEO Utilities
 * Helper functions for generating consistent canonical URLs and meta tags
 */

const SITE_URL = 'https://asap-amatom.com'

/**
 * Generate canonical URL for a page
 * Always returns absolute URL without trailing slash
 */
export function getCanonicalUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Remove trailing slash
  const pathWithoutTrailing = cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath
  
  // Combine site URL with path
  const url = pathWithoutTrailing ? `${SITE_URL}/${pathWithoutTrailing}` : SITE_URL
  
  return url
}

/**
 * Generate canonical URL for homepage
 */
export function getHomeCanonicalUrl(): string {
  return SITE_URL
}

/**
 * Generate canonical URL for category page
 */
export function getCategoryCanonicalUrl(categorySlug: string): string {
  return getCanonicalUrl(`categories/${categorySlug}`)
}

/**
 * Generate canonical URL for subcategory page
 */
export function getSubcategoryCanonicalUrl(categorySlug: string, subcategorySlug: string): string {
  return getCanonicalUrl(`categories/${categorySlug}/${subcategorySlug}`)
}

/**
 * Generate canonical URL for part detail page
 */
export function getPartCanonicalUrl(productname: string): string {
  return getCanonicalUrl(`parts/${encodeURIComponent(productname)}`)
}

/**
 * Generate canonical URL for search page
 */
export function getSearchCanonicalUrl(query?: string): string {
  if (query) {
    return `${SITE_URL}/search?q=${encodeURIComponent(query)}`
  }
  return getCanonicalUrl('search')
}

/**
 * Generate default OG image URL
 */
export function getDefaultOgImage(): string {
  return `${SITE_URL}/og-image.jpg`
}

/**
 * Get site URL
 */
export function getSiteUrl(): string {
  return SITE_URL
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(product: {
  name: string
  description: string
  image?: string
  sku?: string
  manufacturer?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || getDefaultOgImage(),
    sku: product.sku || product.name,
    brand: {
      '@type': 'Brand',
      name: product.manufacturer || 'Amatom',
    },
    offers: {
      '@type': 'Offer',
      url: product.url,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.manufacturer || 'Amatom',
    },
  }
}


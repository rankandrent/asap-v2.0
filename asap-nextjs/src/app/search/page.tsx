import { Metadata } from 'next'
import SearchClient from './SearchClient'

// Generate metadata based on search query
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string }
}): Promise<Metadata> {
  const query = searchParams?.q || ''
  
  if (query) {
    const title = `Search Results for "${query}" | ASAP-Amatom.com`
    const description = `Search results for "${query}" in Amatom parts catalog. Browse aerospace and industrial parts from official Amatom manufacturer. Find ${query} parts with specifications, pricing, and availability.`
    const canonical = `https://asap-amatom.com/search?q=${encodeURIComponent(query)}`
    
    return {
      title,
      description,
      keywords: `${query}, Amatom ${query}, search ${query} parts, ${query} aerospace parts, ${query} industrial parts`,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  }
  
  // Default metadata for search page without query
  return {
    title: 'Search Parts - ASAP-Amatom.com | 500,000+ Parts Catalog',
    description: 'Search our catalog of 500,000+ Amatom aerospace and industrial parts. Find standoffs, fasteners, spacers, and more with detailed specifications and pricing.',
    keywords: 'search Amatom parts, parts search, aerospace parts search, industrial parts catalog, Amatom parts finder',
    alternates: {
      canonical: 'https://asap-amatom.com/search',
    },
    openGraph: {
      title: 'Search Parts - ASAP-Amatom.com',
      description: 'Search 500,000+ Amatom aerospace and industrial parts',
      url: 'https://asap-amatom.com/search',
      type: 'website',
    },
  }
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  return <SearchClient initialQuery={searchParams?.q || ''} />
}

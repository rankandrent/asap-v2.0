'use client'

/**
 * Example: Client-side SEO component for dynamic updates
 * 
 * This is an example of how to use React Helmet for client-side
 * meta tag updates. Use this when meta tags need to change
 * based on user interaction or real-time data.
 * 
 * Note: For most pages, Next.js Metadata API (generateMetadata)
 * is preferred as it's server-side rendered.
 */

import { useEffect, useState } from 'react'
import SEO from '@/components/common/SEO'

interface ClientSEOProps {
  productname: string
}

export default function ClientSEO({ productname }: ClientSEOProps) {
  const [partData, setPartData] = useState<any>(null)

  useEffect(() => {
    // Example: Fetch additional data that might update meta tags
    // This is only needed if meta tags change after initial render
    async function fetchPartData() {
      // Your data fetching logic here
      // This is just an example
    }
    
    fetchPartData()
  }, [productname])

  // Only render SEO component if you have dynamic data
  // For static pages, use generateMetadata instead
  if (!partData) {
    return null
  }

  return (
    <SEO
      title={`${partData.productname} - Dynamic Title`}
      description={partData.description}
      canonical={`https://asap-amatom.com/parts/${encodeURIComponent(productname)}`}
      ogType="product"
      keywords={partData.keywords}
    />
  )
}


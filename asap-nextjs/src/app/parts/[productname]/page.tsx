import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPartByProductname, getCategories, getSubcategories } from '@/lib/queries-server'
import { slugify } from '@/lib/utils'

// ISR: Revalidate every day (since parts don't change often)
export const revalidate = 86400

// For 500k+ pages, we use dynamicParams = true
// This enables on-demand ISR - pages are generated on first request then cached
export const dynamicParams = true

// We DON'T pre-generate all 500k pages at build time
// Instead, we generate them on-demand when users visit
// To pre-generate top 1000 most popular parts, you could do:
// export async function generateStaticParams() {
//   const topParts = await getTopParts(1000) // Implement this to get popular parts
//   return topParts.map((part) => ({
//     productname: encodeURIComponent(part.productname),
//   }))
// }

// Generate metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { productname: string } 
}): Promise<Metadata> {
  const decodedProductname = decodeURIComponent(params.productname)
  const part = await getPartByProductname(decodedProductname, 'Amatom')
  
  if (!part) {
    return { title: 'Part Not Found' }
  }

  const title = `${part.productname} - ${part.description} | Amatom Parts`
  const description = `Buy ${part.productname} from Amatom. ${part.description}. Category: ${part.category} > ${part.sub_category}. ${part.availability_status ? `Status: ${part.availability_status}.` : ''} Official ASAP-Amatom.com catalog.`
  const canonical = `https://asap-amatom.com/parts/${encodeURIComponent(part.productname)}`
  const imageUrl = part.images && part.images.length > 0 ? part.images[0] : 'https://asap-amatom.com/og-image.jpg'

  return {
    title,
    description,
    keywords: `${part.productname}, Amatom, ${part.category}, ${part.sub_category}, ${part.manufacturer}, aerospace parts, industrial parts`,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: part.productname,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PartDetailPage({
  params,
}: {
  params: { productname: string }
}) {
  const decodedProductname = decodeURIComponent(params.productname)
  const part = await getPartByProductname(decodedProductname, 'Amatom')

  if (!part) {
    notFound()
  }

  // Get category and subcategory info for breadcrumb
  const categories = await getCategories('Amatom')
  const category = categories.find(c => c.name === part.category)
  const categorySlug = category?.slug || slugify(part.category)
  
  const subcategories = await getSubcategories(categorySlug, 'Amatom')
  const subcategory = subcategories.find(s => s.name === part.sub_category)
  const subcategorySlug = subcategory?.slug || slugify(part.sub_category)

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": part.productname,
    "description": part.description,
    "brand": {
      "@type": "Brand",
      "name": part.manufacturer
    },
    "category": `${part.category} > ${part.sub_category}`,
    "offers": {
      "@type": "Offer",
      "availability": part.availability_status === "In Stock" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "priceCurrency": "USD",
      ...(part.price && { "price": part.price }),
      "url": `https://asap-amatom.com/parts/${encodeURIComponent(part.productname)}`,
      "seller": {
        "@type": "Organization",
        "name": "ASAP-Amatom.com"
      }
    },
    ...(part.images && part.images.length > 0 && {
      "image": part.images
    })
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://asap-amatom.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": part.category,
        "item": `https://asap-amatom.com/categories/${categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": part.sub_category,
        "item": `https://asap-amatom.com/categories/${categorySlug}/${subcategorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": part.productname,
        "item": `https://asap-amatom.com/parts/${encodeURIComponent(part.productname)}`
      }
    ]
  }

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [productSchema, breadcrumbSchema]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm text-gray-600 flex-wrap">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link 
            href={`/categories/${categorySlug}`}
            className="hover:text-blue-600"
          >
            {part.category}
          </Link>
          <span className="mx-2">/</span>
          <Link 
            href={`/categories/${categorySlug}/${subcategorySlug}`}
            className="hover:text-blue-600"
          >
            {part.sub_category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{part.productname}</span>
        </nav>

        {/* Part Detail */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              {part.images && part.images.length > 0 ? (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    src={part.images[0]} 
                    alt={part.productname}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{part.productname}</h1>
              
              <p className="text-lg text-gray-700 mb-6">{part.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <span className="font-semibold w-32">Manufacturer:</span>
                  <span>{part.manufacturer}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32">Category:</span>
                  <Link 
                    href={`/categories/${categorySlug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {part.category}
                  </Link>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32">Subcategory:</span>
                  <Link 
                    href={`/categories/${categorySlug}/${subcategorySlug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {part.sub_category}
                  </Link>
                </div>
                {part.availability_status && (
                  <div className="flex items-center">
                    <span className="font-semibold w-32">Availability:</span>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                      part.availability_status === 'In Stock' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {part.availability_status}
                    </span>
                  </div>
                )}
                {part.lead_time && (
                  <div className="flex items-center">
                    <span className="font-semibold w-32">Lead Time:</span>
                    <span>{part.lead_time}</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Request Quote
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                  Contact Us
                </button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {part.specifications && Object.keys(part.specifications).length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(part.specifications).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <dt className="font-semibold text-gray-700">{key}:</dt>
                    <dd className="text-gray-600">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Certifications */}
          {part.certifications && part.certifications.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-4">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {part.certifications.map((cert, index) => (
                  <span 
                    key={index}
                    className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


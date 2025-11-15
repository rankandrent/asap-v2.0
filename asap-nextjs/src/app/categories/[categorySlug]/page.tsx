import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategories, getSubcategories } from '@/lib/queries-server'

// ISR: Revalidate every hour
export const revalidate = 3600

// Generate static params for all categories at build time
export async function generateStaticParams() {
  const categories = await getCategories('Amatom')
  
  return categories.map((category) => ({
    categorySlug: category.slug,
  }))
}

// Generate metadata for each category page
export async function generateMetadata({ 
  params 
}: { 
  params: { categorySlug: string } 
}): Promise<Metadata> {
  const categories = await getCategories('Amatom')
  const category = categories.find(c => c.slug === params.categorySlug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const subcategories = await getSubcategories(params.categorySlug, 'Amatom')

  const title = `${category.name} - Amatom Parts | ASAP-Amatom.com`
  const description = `Browse all ${category.name} parts from Amatom manufacturer. ${subcategories.length} subcategories available. Find specifications, pricing, and availability for aerospace and industrial ${category.name} parts.`
  const canonical = `https://asap-amatom.com/categories/${params.categorySlug}`

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
        "name": category.name,
        "item": canonical
      }
    ]
  }

  // CollectionPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": description,
    "url": canonical,
    "breadcrumb": breadcrumbSchema,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": subcategories.length,
      "itemListElement": subcategories.slice(0, 10).map((subcat, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CollectionPage",
          "name": subcat.name,
          "url": `https://asap-amatom.com/categories/${params.categorySlug}/${subcat.slug}`
        }
      }))
    }
  }

  return {
    title,
    description,
    keywords: `${category.name}, Amatom ${category.name}, ${category.name} parts, aerospace ${category.name}, industrial ${category.name}`,
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
          url: `https://asap-amatom.com/images/categories/${params.categorySlug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.name} Parts`,
        },
      ],
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string }
}) {
  const categories = await getCategories('Amatom')
  const category = categories.find(c => c.slug === params.categorySlug)

  if (!category) {
    notFound()
  }

  const subcategories = await getSubcategories(params.categorySlug, 'Amatom')

  // JSON-LD structured data
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
        "name": category.name,
        "item": `https://asap-amatom.com/categories/${params.categorySlug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">
            Browse {subcategories.length} subcategories
          </p>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              href={`/categories/${params.categorySlug}/${subcategory.slug}`}
              className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                  {subcategory.name}
                </h3>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600">
                {subcategory.partCount.toLocaleString()} parts
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}


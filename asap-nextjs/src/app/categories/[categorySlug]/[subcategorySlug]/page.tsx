import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategories, getSubcategories, getPartsBySubcategory } from '@/lib/queries-server'

// ISR: Revalidate every hour
export const revalidate = 3600

// For 500k+ pages, we'll use on-demand ISR
// Only pre-generate the most popular subcategories at build time
export async function generateStaticParams() {
  const categories = await getCategories('Amatom')
  const params: { categorySlug: string; subcategorySlug: string }[] = []
  
  // Generate static params for all subcategories
  for (const category of categories) {
    const subcategories = await getSubcategories(category.slug, 'Amatom')
    for (const subcategory of subcategories) {
      params.push({
        categorySlug: category.slug,
        subcategorySlug: subcategory.slug,
      })
    }
  }
  
  return params
}

// Generate metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { categorySlug: string; subcategorySlug: string } 
}): Promise<Metadata> {
  const categories = await getCategories('Amatom')
  const category = categories.find(c => c.slug === params.categorySlug)
  
  if (!category) {
    return { title: 'Category Not Found' }
  }

  const subcategories = await getSubcategories(params.categorySlug, 'Amatom')
  const subcategory = subcategories.find(s => s.slug === params.subcategorySlug)
  
  if (!subcategory) {
    return { title: 'Subcategory Not Found' }
  }

  const title = `${subcategory.name} - ${category.name} | Amatom Parts`
  const description = `Browse ${subcategory.partCount.toLocaleString()} ${subcategory.name} parts from Amatom. Find specifications, pricing, and availability for aerospace and industrial ${subcategory.name}.`
  const canonical = `https://asap-amatom.com/categories/${params.categorySlug}/${params.subcategorySlug}`

  return {
    title,
    description,
    keywords: `${subcategory.name}, ${category.name}, Amatom ${subcategory.name}, aerospace parts, industrial parts`,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: { categorySlug: string; subcategorySlug: string }
  searchParams: { page?: string }
}) {
  const categories = await getCategories('Amatom')
  const category = categories.find(c => c.slug === params.categorySlug)

  if (!category) {
    notFound()
  }

  const subcategories = await getSubcategories(params.categorySlug, 'Amatom')
  const subcategory = subcategories.find(s => s.slug === params.subcategorySlug)
  
  if (!subcategory) {
    notFound()
  }

  const currentPage = parseInt(searchParams.page || '1', 10)
  const partsPerPage = 50

  const { parts, total } = await getPartsBySubcategory(
    params.categorySlug,
    params.subcategorySlug,
    'Amatom',
    currentPage,
    partsPerPage
  )

  const totalPages = Math.ceil(total / partsPerPage)

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
        "item": `https://asap-amatom.com/categories/${params.categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": subcategory.name,
        "item": `https://asap-amatom.com/categories/${params.categorySlug}/${params.subcategorySlug}`
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
          <Link 
            href={`/categories/${params.categorySlug}`}
            className="hover:text-blue-600"
          >
            {category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{subcategory.name}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{subcategory.name}</h1>
          <p className="text-gray-600">
            {total.toLocaleString()} parts available
          </p>
        </div>

        {/* Parts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {parts.map((part) => (
            <Link
              key={part.id}
              href={`/parts/${encodeURIComponent(part.productname)}`}
              className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors mb-2">
                {part.productname}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {part.description}
              </p>
              {part.availability_status && (
                <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                  part.availability_status === 'In Stock' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {part.availability_status}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}`}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
              if (page > totalPages) return null
              return (
                <Link
                  key={page}
                  href={`?page=${page}`}
                  className={`px-4 py-2 border rounded ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </Link>
              )
            })}

            {currentPage < totalPages && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}


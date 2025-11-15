import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useCategories } from "../hooks/useCategories"
import { useSubcategories } from "../hooks/useSubcategories"
import { usePartsList } from "../hooks/usePartsList"
import Breadcrumb from "../components/layout/Breadcrumb"
import PartCard from "../components/parts/PartCard"
import Pagination from "../components/common/Pagination"
import LoadingSpinner from "../components/common/LoadingSpinner"
import SEO from "../components/common/SEO"

const PARTS_PER_PAGE = 50

export default function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string
    subcategorySlug: string
  }>()
  const [page, setPage] = useState(1)

  const { data: categories } = useCategories()
  const { data: subcategories } = useSubcategories(categorySlug || "")
  const { data: partsData, isLoading, error: partsError, isError } = usePartsList(
    categorySlug || "",
    subcategorySlug || "",
    page
  )

  // Reset to page 1 when category or subcategory changes
  useEffect(() => {
    setPage(1)
  }, [categorySlug, subcategorySlug])

  // Debug logging
  useEffect(() => {
    console.log('📊 SubcategoryPage: Parts query state:', {
      categorySlug,
      subcategorySlug,
      page,
      isLoading,
      isError,
      partsError: partsError?.message,
      partsData,
      partsCount: partsData && 'parts' in partsData ? partsData.parts.length : 0,
      totalParts: partsData && 'total' in partsData ? partsData.total : 0,
      totalPages: partsData && 'total' in partsData ? Math.ceil(partsData.total / PARTS_PER_PAGE) : 0
    })
  }, [categorySlug, subcategorySlug, page, isLoading, isError, partsError, partsData])

  const category = categories?.find((c) => c.slug === categorySlug)
  const subcategory = subcategories?.find((s) => s.slug === subcategorySlug)

  const totalPages = partsData && 'total' in partsData
    ? Math.ceil(partsData.total / PARTS_PER_PAGE)
    : 0

  if (!category || !subcategory) {
    if (categories && subcategories) {
      return (
        <>
          <SEO
            title="Subcategory Not Found"
            description="The subcategory you're looking for doesn't exist."
            canonical={`https://asap-amatom.com/categories/${categorySlug}/${subcategorySlug}`}
          />
          <div className="container mx-auto px-4 py-8">
            <p>Subcategory not found.</p>
          </div>
        </>
      )
    }
  }

  const subcategoryTitle = `${subcategory?.name || "Subcategory"} - ${category?.name || "Category"} | Amatom Parts | ASAP-Amatom.com`
  const partCount = partsData && 'total' in partsData ? partsData.total : 0
  const subcategoryDescription = `Shop ${subcategory?.name || "subcategory"} from Amatom manufacturer. Complete catalog of ${partCount.toLocaleString()} ${subcategory?.name} parts. Browse specifications, pricing, and availability. Category: ${category?.name}. Official ASAP-Amatom.com.`
  const subcategoryKeywords = `${subcategory?.name}, ${category?.name}, Amatom ${subcategory?.name}, ${subcategory?.name} parts, buy ${subcategory?.name}, aerospace ${subcategory?.name}, industrial parts`
  const canonical = `https://asap-amatom.com/categories/${categorySlug}/${subcategorySlug}`
  
  // Dynamic OG image - use first part image if available, otherwise category-specific
  const firstPartImage = partsData && 'parts' in partsData && partsData.parts.length > 0 && partsData.parts[0].images && partsData.parts[0].images.length > 0
    ? partsData.parts[0].images[0]
    : `https://asap-amatom.com/images/categories/${categorySlug}.jpg`
  
  // ItemList Schema for product listing
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${subcategory?.name} - ${category?.name}`,
    "description": subcategoryDescription,
    "numberOfItems": partCount,
    "url": canonical,
    "itemListElement": partsData && 'parts' in partsData 
      ? partsData.parts.slice(0, 10).map((part, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": part.productname,
            "description": part.description,
            "url": `https://asap-amatom.com/parts/${encodeURIComponent(part.productname)}`,
            ...(part.images && part.images.length > 0 && {
              "image": part.images[0]
            })
          }
        }))
      : []
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
        "name": category?.name || "Category",
        "item": `https://asap-amatom.com/categories/${categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": subcategory?.name || "Subcategory",
        "item": canonical
      }
    ]
  }

  // CollectionPage Schema
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${subcategory?.name} - ${category?.name}`,
    "description": subcategoryDescription,
    "url": canonical,
    "mainEntity": itemListSchema
  }

  // Combine schemas
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [itemListSchema, breadcrumbSchema, collectionPageSchema]
  }

  return (
    <>
      <SEO
        title={subcategoryTitle}
        description={subcategoryDescription}
        canonical={canonical}
        ogType="website"
        ogImage={firstPartImage}
        keywords={subcategoryKeywords}
        schema={combinedSchema}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/" },
            {
              label: category?.name || "Category",
              href: `/categories/${categorySlug}`,
            },
            { label: subcategory?.name || "Subcategory" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{subcategory?.name}</h1>
          <p className="text-muted-foreground">
            {partsData && 'total' in partsData ? partsData.total.toLocaleString() : 0} parts available
          </p>
        </div>

        {/* Error display */}
        {isError && partsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Parts</h3>
            <p className="text-red-600 mb-4">{partsError.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            {partsData && 'parts' in partsData && partsData.parts.length > 0 ? (
              <>
                {/* Parts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {partsData.parts.map((part) => (
                    <PartCard key={part.id} part={part} />
                  ))}
                </div>

                {/* Pagination Info */}
                <div className="mb-4 text-center text-sm text-gray-600">
                  Showing {((page - 1) * PARTS_PER_PAGE) + 1} to {Math.min(page * PARTS_PER_PAGE, partsData.total)} of {partsData.total.toLocaleString()} parts
                </div>

                {/* Pagination Component */}
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => {
                    setPage(newPage)
                    // Scroll to top when page changes
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </>
            ) : (
              <div className="text-center py-12">
                {!isLoading && !isError && (
                  <>
                    <p className="text-lg font-semibold text-gray-800 mb-2">No parts found</p>
                    <p className="text-muted-foreground mb-4">
                      No parts available for this subcategory. Please check:
                    </p>
                    <ul className="text-sm text-gray-600 text-left max-w-md mx-auto">
                      <li>• Category: {category?.name || categorySlug}</li>
                      <li>• Subcategory: {subcategory?.name || subcategorySlug}</li>
                      <li>• Manufacturer: Amatom</li>
                    </ul>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Refresh Page
                    </button>
                  </>
                )}
                {isLoading && (
                  <p className="text-muted-foreground">Loading parts...</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}


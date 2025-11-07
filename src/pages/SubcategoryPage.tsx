import { useState } from "react"
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
  const { data: partsData, isLoading } = usePartsList(
    categorySlug || "",
    subcategorySlug || "",
    page
  )

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
            canonical={`https://asapamatom.netlify.app/categories/${categorySlug}/${subcategorySlug}`}
          />
          <div className="container mx-auto px-4 py-8">
            <p>Subcategory not found.</p>
          </div>
        </>
      )
    }
  }

  const subcategoryTitle = `${subcategory?.name || "Subcategory"} - ${category?.name || "Category"} | Amatom Parts`
  const partCount = partsData && 'total' in partsData ? partsData.total : 0
  const subcategoryDescription = `Shop ${subcategory?.name || "subcategory"} from Amatom manufacturer. Complete catalog of ${partCount.toLocaleString()} ${subcategory?.name} parts. Browse specifications, pricing, and availability. Category: ${category?.name}. Official ASAPAmatom.com.`
  const subcategoryKeywords = `${subcategory?.name}, ${category?.name}, Amatom ${subcategory?.name}, ${subcategory?.name} parts, buy ${subcategory?.name}`

  // ItemList Schema for product listing
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${subcategory?.name} - ${category?.name}`,
    "description": subcategoryDescription,
    "numberOfItems": partCount,
    "itemListElement": partsData && 'parts' in partsData 
      ? partsData.parts.slice(0, 10).map((part, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": part.productname,
            "description": part.description,
            "url": `https://asapamatom.netlify.app/parts/${encodeURIComponent(part.productname)}`
          }
        }))
      : []
  }

  return (
    <>
      <SEO
        title={subcategoryTitle}
        description={subcategoryDescription}
        canonical={`https://asapamatom.netlify.app/categories/${categorySlug}/${subcategorySlug}`}
        keywords={subcategoryKeywords}
        schema={itemListSchema}
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

        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            {partsData && 'parts' in partsData && partsData.parts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {partsData.parts.map((part) => (
                    <PartCard key={part.id} part={part} />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No parts found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}


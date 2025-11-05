import { useParams } from "react-router-dom"
import { useCategories } from "../hooks/useCategories"
import { useSubcategories } from "../hooks/useSubcategories"
import SubcategoryList from "../components/categories/SubcategoryList"
import Breadcrumb from "../components/layout/Breadcrumb"
import LoadingSpinner from "../components/common/LoadingSpinner"
import SEO from "../components/common/SEO"

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { data: categories } = useCategories()
  const { data: subcategories, isLoading } = useSubcategories(categorySlug || "")

  const category = categories?.find((c) => c.slug === categorySlug)

  if (!category && categories) {
    return (
      <>
        <SEO
          title="Category Not Found"
          description="The category you're looking for doesn't exist."
          canonical={`https://www.asapamatom.com/categories/${categorySlug}`}
        />
        <div className="container mx-auto px-4 py-8">
          <p>Category not found.</p>
        </div>
      </>
    )
  }

  const categoryTitle = `${category?.name || "Category"} - Amatom Parts | ASAPAmatom.com`
  const categoryDescription = `Browse all ${category?.name || "category"} parts from Amatom manufacturer. ${subcategories?.length || 0} subcategories available. Find specifications, pricing, and availability for aerospace and industrial ${category?.name} parts.`
  const categoryKeywords = `${category?.name}, Amatom ${category?.name}, ${category?.name} parts, aerospace ${category?.name}, industrial ${category?.name}`

  // CollectionPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category?.name,
    "description": categoryDescription,
    "url": `https://www.asapamatom.com/categories/${categorySlug}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.asapamatom.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category?.name,
          "item": `https://www.asapamatom.com/categories/${categorySlug}`
        }
      ]
    }
  }

  return (
    <>
      <SEO
        title={categoryTitle}
        description={categoryDescription}
        canonical={`https://www.asapamatom.com/categories/${categorySlug}`}
        keywords={categoryKeywords}
        schema={collectionSchema}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/" },
            { label: category?.name || "Category" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category?.name}</h1>
          <p className="text-muted-foreground">
            Browse {subcategories?.length || 0} subcategories
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <SubcategoryList
            subcategories={subcategories || []}
            categorySlug={categorySlug || ""}
          />
        )}
      </div>
    </>
  )
}


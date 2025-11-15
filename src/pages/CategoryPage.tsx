import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useCategories } from "../hooks/useCategories"
import { useSubcategories } from "../hooks/useSubcategories"
import { useManufacturerContext } from "../contexts/ManufacturerContext"
import SubcategoryList from "../components/categories/SubcategoryList"
import Breadcrumb from "../components/layout/Breadcrumb"
import SEO from "../components/common/SEO"

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { selectedManufacturer } = useManufacturerContext()
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories()
  const { data: subcategories, isLoading: isLoadingSubcategories, error: subcategoriesError } = useSubcategories(categorySlug || "")
  
  const isLoading = isLoadingCategories || isLoadingSubcategories
  const error = categoriesError || subcategoriesError

  // Debug logging
  useEffect(() => {
    console.log('📊 CategoryPage: State:', {
      categorySlug,
      selectedManufacturer,
      isLoadingCategories,
      isLoadingSubcategories,
      categoriesCount: categories?.length || 0,
      categories: categories?.map(c => `${c.name} (${c.subcategoryCount} subcats)`),
      subcategoriesCount: subcategories?.length || 0,
      subcategories: subcategories?.map(s => `${s.name} (${s.partCount} parts)`),
      categoriesError: categoriesError?.message,
      subcategoriesError: subcategoriesError?.message,
    })
  }, [categorySlug, selectedManufacturer, isLoadingCategories, isLoadingSubcategories, categories, subcategories, categoriesError, subcategoriesError])

  const category = categories?.find((c) => c.slug === categorySlug)

  if (!category && categories) {
    return (
      <>
        <SEO
          title="Category Not Found"
          description="The category you're looking for doesn't exist."
          canonical={`https://asap-amatom.com/categories/${categorySlug}`}
        />
        <div className="container mx-auto px-4 py-8">
          <p>Category not found.</p>
        </div>
      </>
    )
  }

  const categoryTitle = `${category?.name || "Category"} - Amatom Parts | ASAP-Amatom.com`
  const categoryDescription = `Browse all ${category?.name || "category"} parts from Amatom manufacturer. ${subcategories?.length || 0} subcategories available. Find specifications, pricing, and availability for aerospace and industrial ${category?.name} parts.`
  const categoryKeywords = `${category?.name}, Amatom ${category?.name}, ${category?.name} parts, aerospace ${category?.name}, industrial ${category?.name}, buy ${category?.name}`
  const canonical = `https://asap-amatom.com/categories/${categorySlug}`
  
  // Dynamic OG image - category-specific
  const categoryImage = `https://asap-amatom.com/images/categories/${categorySlug}.jpg`

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
        "item": canonical
      }
    ]
  }

  // CollectionPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category?.name || "Category",
    "description": categoryDescription,
    "url": canonical,
    "breadcrumb": breadcrumbSchema,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": subcategories?.length || 0,
      "itemListElement": subcategories?.slice(0, 10).map((subcat, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CollectionPage",
          "name": subcat.name,
          "url": `https://asap-amatom.com/categories/${categorySlug}/${subcat.slug}`
        }
      })) || []
    }
  }

  // Combine schemas
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [collectionSchema, breadcrumbSchema]
  }

  return (
    <>
      <SEO
        title={categoryTitle}
        description={categoryDescription}
        canonical={canonical}
        ogType="website"
        ogImage={categoryImage}
        keywords={categoryKeywords}
        schema={combinedSchema}
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

        <SubcategoryList
          subcategories={subcategories || []}
          categorySlug={categorySlug || ""}
          isLoading={isLoading}
          error={error as Error | null}
        />
      </div>
    </>
  )
}


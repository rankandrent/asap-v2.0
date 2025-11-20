import { useParams } from "react-router-dom"
import { usePart } from "../hooks/usePart"
import { useCategories } from "../hooks/useCategories"
import { useSubcategories } from "../hooks/useSubcategories"
import Breadcrumb from "../components/layout/Breadcrumb"
import PartDetail from "../components/parts/PartDetail"
import PartContent from "../components/parts/PartContent"
import PartFAQs from "../components/parts/PartFAQs"
import RelatedParts from "../components/parts/RelatedParts"
import LoadingSpinner from "../components/common/LoadingSpinner"
import SEO from "../components/common/SEO"
import { slugify } from "../lib/utils"

export default function PartDetailPage() {
  const { productname } = useParams<{ productname: string }>()
  const decodedProductname = productname ? decodeURIComponent(productname) : ""
  const { data: part, isLoading, error } = usePart(decodedProductname)

  const { data: categories } = useCategories()
  const { data: subcategories } = useSubcategories(
    part ? slugify(part.category) : ""
  )

  const category = categories?.find((c) =>
    part ? c.name === part.category : false
  )
  const subcategory = subcategories?.find((s) =>
    part ? s.name === part.sub_category : false
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !part) {
    return (
      <>
        <head>
          <title>Part Not Found | ASAP-Amatom.com</title>
          <meta name="description" content="The part you're looking for doesn't exist or has been removed." />
          <meta name="keywords" content="Part Not Found, ASAP-Amatom.com" />
          <meta name="author" content="ASAP-Amatom.com" />
          <meta name="robots" content="noindex, nofollow" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#000000" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-config" content="none" />
          <meta name="msapplication-TileImage" content="none" />
          <meta name="msapplication-starturl" content="none" />
          <meta name="msapplication-navbutton-color" content="#000000" />
          <meta name="msapplication-window" content="none" />
          <meta name="msapplication-tooltip" content="none" />
          <meta name="msapplication-task" content="none" />
        </head>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Part Not Found</h1>
            <p className="text-muted-foreground">
              The part you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </>
    )
  }

  // Generate SEO-optimized content - Unique for each part
  const partTitle = `${part.productname} - ${part.description.substring(0, 60)}${part.description.length > 60 ? '...' : ''} | ${part.category} | Amatom Parts | ASAP-Amatom.com`
  const partDescription = `Buy ${part.productname} from Amatom manufacturer. ${part.description}. Category: ${part.category} > ${part.sub_category}. ${part.availability_status ? `Availability: ${part.availability_status}.` : 'Contact for availability.'} ${part.price ? `Price: $${part.price}.` : 'Contact for pricing.'} Specifications, certifications, and technical details available. Official ASAP-Amatom.com catalog.`
  const partKeywords = `${part.productname}, buy ${part.productname}, ${part.productname} Amatom, ${part.category} ${part.sub_category}, ${part.manufacturer} parts, ${part.productname} specifications, ${part.productname} price, aerospace ${part.category}, industrial ${part.sub_category}`
  const canonical = `https://asap-amatom.com/parts/${encodeURIComponent(part.productname)}`
  const imageUrl = part.images && part.images.length > 0 ? part.images[0] : 'https://asap-amatom.com/og-image.jpg'

  // Product Schema.org markup
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
      "url": canonical,
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
        "name": category?.name || part.category,
        "item": `https://asap-amatom.com/categories/${category?.slug || slugify(part.category)}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": subcategory?.name || part.sub_category,
        "item": `https://asap-amatom.com/categories/${category?.slug || slugify(part.category)}/${subcategory?.slug || slugify(part.sub_category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": part.productname,
        "item": canonical
      }
    ]
  }

  // Combine schemas
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [productSchema, breadcrumbSchema]
  }

  return (
    <>
      <SEO
        title={partTitle}
        description={partDescription}
        canonical={canonical}
        ogType="product"
        ogImage={imageUrl}
        schema={combinedSchema}
        keywords={partKeywords}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/" },
            {
              label: category?.name || part.category,
              href: category ? `/categories/${category.slug}` : "#",
            },
            {
              label: subcategory?.name || part.sub_category,
              href:
                category && subcategory
                  ? `/categories/${category.slug}/${subcategory.slug}`
                  : "#",
            },
            { label: part.productname },
          ]}
        />

        <PartDetail part={part} />

        {/* Rich Programmatic Content */}
        <PartContent part={part} />

        {/* FAQs Section with Part Number */}
        <PartFAQs part={part} />

        <div className="mt-8">
          <RelatedParts currentPart={part} />
        </div>
      </div>
    </>
  )
}


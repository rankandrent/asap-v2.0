import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { searchParts } from "../lib/queries"
import PartCard from "../components/parts/PartCard"
import LoadingSpinner from "../components/common/LoadingSpinner"
import SEO from "../components/common/SEO"
import type { Part } from "../types/part"
import { useManufacturerContext } from "../contexts/ManufacturerContext"

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const { selectedManufacturer } = useManufacturerContext()

  const { data: parts, isLoading } = useQuery<Part[]>({
    queryKey: ["search", query, selectedManufacturer],
    queryFn: () => {
      if (!selectedManufacturer) {
        throw new Error('No manufacturer selected')
      }
      return searchParts(query, selectedManufacturer)
    },
    enabled: !!query && !!selectedManufacturer,
  })

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() })
    }
  }

  const searchTitle = query ? `Search Results for "${query}" | ASAP-Amatom.com` : "Search Parts | ASAP-Amatom.com"
  const searchDescription = query 
    ? `Search results for "${query}" in Amatom parts catalog. Found ${parts?.length || 0} matching parts. Browse aerospace and industrial parts from official Amatom manufacturer.`
    : "Search 500,000+ Amatom aerospace and industrial parts. Find specifications, pricing, and availability for standoffs, fasteners, and more."
  const canonical = `https://asap-amatom.com/search${query ? `?q=${encodeURIComponent(query)}` : ''}`
  const searchKeywords = query ? `${query}, Amatom ${query}, search ${query} parts, ${query} aerospace parts` : "search parts, Amatom search, find parts"

  // SearchAction Schema
  const searchActionSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ASAP-Amatom.com",
    "url": "https://asap-amatom.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://asap-amatom.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  // SearchResultsPage Schema (when there's a query)
  const searchResultsSchema = query && parts ? {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": searchTitle,
    "description": searchDescription,
    "url": canonical,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": parts.length,
      "itemListElement": parts.slice(0, 10).map((part, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": part.productname,
          "description": part.description,
          "url": `https://asap-amatom.com/parts/${encodeURIComponent(part.productname)}`
        }
      }))
    }
  } : null

  // Combine schemas
  const combinedSchema = searchResultsSchema ? {
    "@context": "https://schema.org",
    "@graph": [searchActionSchema, searchResultsSchema]
  } : searchActionSchema

  return (
    <>
      <SEO
        title={searchTitle}
        description={searchDescription}
        canonical={canonical}
        ogType="website"
        ogImage="https://asap-amatom.com/og-image.jpg"
        keywords={searchKeywords}
        schema={combinedSchema}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Parts</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-2xl">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part name or description..."
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <>
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <>
                {parts && parts.length > 0 ? (
                  <>
                    <p className="text-muted-foreground mb-6">
                      Found {parts.length} {parts.length === 1 ? "result" : "results"} for "
                      {query}"
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {parts.map((part) => (
                        <PartCard key={part.id} part={part} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No parts found matching "{query}"
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a search term to find parts
            </p>
          </div>
        )}
      </div>
    </>
  )
}


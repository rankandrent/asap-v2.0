import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import type { Subcategory } from "../../types/part"
import { SubcategoryListSkeleton } from "../common/SkeletonLoader"
import { usePagination, useInfiniteScroll } from "../../hooks/useInfiniteScroll"
import { Package, Loader2 } from "lucide-react"

interface SubcategoryListProps {
  subcategories: Subcategory[]
  categorySlug: string
  isLoading?: boolean
  error?: Error | null
}

export default function SubcategoryList({
  subcategories,
  categorySlug,
  isLoading,
  error,
}: SubcategoryListProps) {
  // Pagination with 9 items initially, load 6 more on scroll
  const {
    displayedItems,
    hasMore,
    isLoading: isPaginationLoading,
    loadMore,
    displayedCount,
    totalItems
  } = usePagination(subcategories, 9)

  // Infinite scroll
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isPaginationLoading,
    onLoadMore: loadMore,
    threshold: 200
  })

  if (isLoading) {
    return (
      <div className="py-8">
        <SubcategoryListSkeleton count={9} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-yellow-800">Unable to Load Subcategories</h3>
        <p className="text-muted-foreground mb-4">
          There was an error loading subcategories. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No subcategories found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((subcategory) => (
          <Link
            key={subcategory.slug}
            to={`/categories/${categorySlug}/${subcategory.slug}`}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {subcategory.partCount.toLocaleString()} {subcategory.partCount === 1 ? 'part' : 'parts'}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {isPaginationLoading && (
        <div className="flex justify-center items-center py-8 mt-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading more subcategories...</span>
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      {hasMore && !isPaginationLoading && (
        <div ref={sentinelRef} className="h-20 flex items-center justify-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {displayedCount} of {totalItems} subcategories
          </div>
        </div>
      )}

      {/* End message */}
      {!hasMore && totalItems > 9 && (
        <div className="text-center py-8 mt-6">
          <p className="text-gray-500 font-medium">
            ✅ All {totalItems} subcategories loaded
          </p>
        </div>
      )}
    </>
  )
}


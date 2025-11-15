import type { Category } from "../../types/part"
import CategoryCard from "./CategoryCard"
import { CategoryGridSkeleton } from "../common/SkeletonLoader"
import { usePagination, useInfiniteScroll } from "../../hooks/useInfiniteScroll"
import { Loader2 } from "lucide-react"

interface CategoryGridProps {
  categories: Category[]
  isLoading?: boolean
  error?: Error | null
}

export default function CategoryGrid({ categories, isLoading, error }: CategoryGridProps) {
  // Pagination with 8 items initially, load 4 more on scroll
  const {
    displayedItems,
    hasMore,
    isLoading: isPaginationLoading,
    loadMore,
    displayedCount,
    totalItems
  } = usePagination(categories, 8)

  // Infinite scroll
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isPaginationLoading,
    onLoadMore: loadMore,
    threshold: 200
  })

  // Show skeleton loader while initial loading
  if (isLoading) {
    return (
      <div className="py-8">
        <CategoryGridSkeleton count={8} />
      </div>
    )
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-yellow-800">Unable to Load Categories</h3>
        <p className="text-muted-foreground mb-4">
          There was an error loading categories. Please try refreshing the page.
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

  // Show empty state if no categories
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No categories found.</p>
      </div>
    )
  }

  // Show categories grid with infinite scroll
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedItems.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {isPaginationLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading more categories...</span>
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      {hasMore && !isPaginationLoading && (
        <div ref={sentinelRef} className="h-20 flex items-center justify-center">
          <div className="text-sm text-gray-500">
            Showing {displayedCount} of {totalItems} categories
          </div>
        </div>
      )}

      {/* End message */}
      {!hasMore && totalItems > 8 && (
        <div className="text-center py-8">
          <p className="text-gray-500 font-medium">
            ✅ All {totalItems} categories loaded
          </p>
        </div>
      )}
    </>
  )
}


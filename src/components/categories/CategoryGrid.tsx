import type { Category } from "../../types/part"
import CategoryCard from "./CategoryCard"
import { CategoryGridSkeleton } from "../common/SkeletonLoader"

interface CategoryGridProps {
  categories: Category[]
  isLoading?: boolean
  error?: Error | null
}

export default function CategoryGrid({ categories, isLoading, error }: CategoryGridProps) {
  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <div className="py-8">
        <CategoryGridSkeleton count={4} />
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

  // Show categories grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  )
}


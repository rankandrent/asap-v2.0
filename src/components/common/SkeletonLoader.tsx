import { Card, CardContent, CardHeader } from "../ui/card"

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </CardContent>
    </Card>
  )
}

interface CategoryGridSkeletonProps {
  count?: number
}

export function CategoryGridSkeleton({ count = 4 }: CategoryGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} className="h-full" />
      ))}
    </div>
  )
}

interface SubcategoryListSkeletonProps {
  count?: number
}

export function SubcategoryListSkeleton({ count = 6 }: SubcategoryListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} className="h-full" />
      ))}
    </div>
  )
}

interface PartsGridSkeletonProps {
  count?: number
}

export function PartsGridSkeleton({ count = 8 }: PartsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full">
          <CardHeader>
            <div className="h-5 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


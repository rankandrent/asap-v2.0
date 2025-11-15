import { useState, useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollProps {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  threshold?: number
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.8
}: UseInfiniteScrollProps) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Callback when sentinel enters viewport
  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0]
    setIsIntersecting(entry.isIntersecting)
    
    if (entry.isIntersecting && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [hasMore, isLoading, onLoadMore])

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: `${threshold * 100}px`, // Load before reaching the bottom
      threshold: 0.1
    })

    // Observe sentinel element
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersect, threshold])

  return {
    sentinelRef,
    isIntersecting
  }
}

// Paginated data hook
export function usePagination<T>(items: T[], itemsPerPage: number = 12) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with first page
  useEffect(() => {
    const firstPage = items.slice(0, itemsPerPage)
    setDisplayedItems(firstPage)
    setHasMore(items.length > itemsPerPage)
    setPage(1)
  }, [items, itemsPerPage])

  // Load more items
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate network delay for smooth UX
    setTimeout(() => {
      const nextPage = page + 1
      const endIndex = nextPage * itemsPerPage
      const nextItems = items.slice(0, endIndex)

      setDisplayedItems(nextItems)
      setPage(nextPage)
      setHasMore(endIndex < items.length)
      setIsLoading(false)
    }, 300)
  }, [items, page, itemsPerPage, hasMore, isLoading])

  // Reset pagination when items change
  const reset = useCallback(() => {
    const firstPage = items.slice(0, itemsPerPage)
    setDisplayedItems(firstPage)
    setHasMore(items.length > itemsPerPage)
    setPage(1)
  }, [items, itemsPerPage])

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    reset,
    totalItems: items.length,
    displayedCount: displayedItems.length
  }
}


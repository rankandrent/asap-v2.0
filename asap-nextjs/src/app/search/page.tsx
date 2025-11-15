'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { searchParts } from '@/lib/queries-client'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeQuery, setActiveQuery] = useState(initialQuery)

  const { data: parts, isLoading, error } = useQuery({
    queryKey: ['search', activeQuery],
    queryFn: () => searchParts(activeQuery, 'Amatom', 50),
    enabled: activeQuery.length > 2,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.length > 2) {
      setActiveQuery(searchQuery)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Parts</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter part number or description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Search
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Enter at least 3 characters to search
        </p>
      </form>

      {/* Search Results */}
      {activeQuery && (
        <div>
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              Error searching parts. Please try again.
            </div>
          )}

          {!isLoading && !error && parts && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">
                  {parts.length > 0 
                    ? `Found ${parts.length} results for "${activeQuery}"`
                    : `No results found for "${activeQuery}"`
                  }
                </h2>
              </div>

              {parts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {parts.map((part) => (
                    <Link
                      key={part.id}
                      href={`/parts/${encodeURIComponent(part.productname)}`}
                      className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                    >
                      <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors mb-2">
                        {part.productname}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {part.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {part.category} &gt; {part.sub_category}
                      </div>
                      {part.availability_status && (
                        <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                          part.availability_status === 'In Stock' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {part.availability_status}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Initial State */}
      {!activeQuery && (
        <div className="text-center py-12 text-gray-600">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p>Enter a search term to find parts</p>
        </div>
      )}
    </div>
  )
}


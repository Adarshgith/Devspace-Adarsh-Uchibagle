'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@/hooks/useDebounce'
import Pagination from '@/components/ui/Pagination'

interface SearchResult {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: {
    asset: {
      url: string
    }
    alt?: string
  }
  url: string
  publishedAt?: string
  startDate?: string
  author?: { name: string; slug: { current: string } }
  categories?: Array<{ title: string; slug: { current: string } }>
  location?: string
  isVirtual?: boolean
}

interface SearchResponse {
  query: string
  type: string
  total: number
  results: SearchResult[]
}

interface SearchResultsProps {
  searchParams: {
    q?: string
    type?: string
    page?: string
  }
}

const RESULTS_PER_PAGE = 12

export default function SearchResults({ searchParams }: SearchResultsProps) {
  const [query, setQuery] = useState(searchParams.q || '')
  const [selectedType, setSelectedType] = useState(searchParams.type || 'all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || '1'))
  const [showFilters, setShowFilters] = useState(false)
  
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  
  // Search function
  const performSearch = async (searchQuery: string, type: string = 'all', page: number = 1) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      setTotalResults(0)
      setError('')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type,
        limit: RESULTS_PER_PAGE.toString(),
        offset: ((page - 1) * RESULTS_PER_PAGE).toString()
      })
      
      const response = await fetch(`/api/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data: SearchResponse = await response.json()
      setResults(data.results)
      setTotalResults(data.total)
    } catch {
      setError('Search failed. Please try again.')
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Update URL when search parameters change
  const updateURL = useCallback((newQuery: string, newType: string, newPage: number = 1) => {
    const params = new URLSearchParams()
    if (newQuery) params.set('q', newQuery)
    if (newType !== 'all') params.set('type', newType)
    if (newPage > 1) params.set('page', newPage.toString())
    
    const newURL = `/search${params.toString() ? `?${params.toString()}` : ''}`
    router.push(newURL, { scroll: false })
  }, [router])
  
  // Effect for initial search and URL changes
  useEffect(() => {
    if (searchParams.q) {
      performSearch(searchParams.q, searchParams.type || 'all', parseInt(searchParams.page || '1'))
    }
  }, [searchParams.q, searchParams.type, searchParams.page])
  
  // Effect for debounced search
  useEffect(() => {
    if (debouncedQuery !== (searchParams.q || '')) {
      setCurrentPage(1)
      updateURL(debouncedQuery, selectedType, 1)
    }
  }, [debouncedQuery, searchParams.q, selectedType, updateURL])
  
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType)
    setCurrentPage(1)
    updateURL(query, newType, 1)
  }
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateURL(query, selectedType, newPage)
  }
  
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return '📝'
      case 'news':
        return '📰'
      case 'event':
        return '📅'
      case 'page':
        return '📄'
      default:
        return '🔍'
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE)
  
  return (
    <div className="space-y-6">
      {/* Search Input and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, news, events..."
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
        </div>
        
        {/* Type Filters */}
        <div className={`mt-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 py-2 pr-2">Filter by type:</span>
            {[
              { value: 'all', label: 'All Results' },
              { value: 'blog', label: 'Blog Posts' },
              { value: 'news', label: 'News' },
              { value: 'events', label: 'Events' },
              { value: 'pages', label: 'Pages' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleTypeChange(filter.value)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  selectedType === filter.value
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results Summary */}
      {!isLoading && !error && query && (
        <div className="text-sm text-gray-600">
          {totalResults > 0 ? (
            <p>
              Found <span className="font-semibold">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for 
              <span className="font-semibold">&ldquo;{query}&rdquo;</span>
              {selectedType !== 'all' && (
                <span> in <span className="font-semibold">{selectedType}</span></span>
              )}
            </p>
          ) : (
            <p>No results found for <span className="font-semibold">&ldquo;{query}&rdquo;</span></p>
          )}
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Searching...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* No Query State */}
      {!query && !isLoading && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
          <p className="text-gray-500">Enter a search term to find blog posts, news articles, events, and pages.</p>
        </div>
      )}
      
      {/* Search Results */}
      {!isLoading && !error && results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link href={result.url} className="block p-6">
                <div className="flex gap-4">
                  {/* Image or Icon */}
                  <div className="flex-shrink-0">
                    {result.featuredImage ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={result.featuredImage.asset.url}
                          alt={result.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                        {getResultIcon(result._type)}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {result.title}
                        </h3>
                        
                        {result.excerpt && (
                          <p className="text-gray-600 mt-2 line-clamp-2">
                            {result.excerpt}
                          </p>
                        )}
                        
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {result._type}
                          </span>
                          
                          {result.publishedAt && (
                            <span>{formatDate(result.publishedAt)}</span>
                          )}
                          
                          {result.startDate && (
                            <span>{formatDate(result.startDate)}</span>
                          )}
                          
                          {result.author && (
                            <span>by {result.author.name}</span>
                          )}
                          
                          {result.location && (
                            <span>📍 {result.location}</span>
                          )}
                          
                          {result.isVirtual && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Virtual
                            </span>
                          )}
                        </div>
                        
                        {/* Categories */}
                        {result.categories && result.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.categories.slice(0, 3).map((category) => (
                              <span
                                key={category.slug.current}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {category.title}
                              </span>
                            ))}
                            {result.categories.length > 3 && (
                              <span className="text-xs text-gray-500">+{result.categories.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
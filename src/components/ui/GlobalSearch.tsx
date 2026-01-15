'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@/hooks/useDebounce'
import Image from 'next/image'
import Link from 'next/link'

interface SearchResult {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: unknown
  url: string
  publishedAt?: string
  startDate?: string
  author?: { name: string }
  categories?: Array<{ title: string }>
}

interface SearchResponse {
  query: string
  type: string
  total: number
  results: SearchResult[]
}

interface GlobalSearchProps {
  placeholder?: string
  className?: string
  showFilters?: boolean
  onClose?: () => void
}

export default function GlobalSearch({ 
  placeholder = "Search articles, news, events...", 
  className = "",
  showFilters = true,
  onClose 
}: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('all')
  const [error, setError] = useState('')
  
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Search function
  const performSearch = async (searchQuery: string, type: string = 'all') => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      setError('')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type,
        limit: '8'
      })
      
      const response = await fetch(`/api/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data: SearchResponse = await response.json()
      setResults(data.results)
    } catch {
      setError('Search failed. Please try again.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Effect for debounced search
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery, selectedType)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery, selectedType])
  
  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
      
      // Escape to close
      if (event.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setError('')
  }
  
  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    onClose?.()
    router.push(result.url)
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
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        
        {/* Keyboard shortcut hint */}
        {!query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded">
              ⌘K
            </kbd>
          </div>
        )}
      </div>
      
      {/* Search Filters */}
      {showFilters && isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm z-50">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Filter by:</span>
            {[
              { value: 'all', label: 'All' },
              { value: 'blog', label: 'Blog' },
              { value: 'news', label: 'News' },
              { value: 'events', label: 'Events' },
              { value: 'pages', label: 'Pages' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedType(filter.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedType === filter.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results */}
      {isOpen && (query || isLoading || error) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {!isLoading && !error && results.length === 0 && query && (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          )}
          
          {!isLoading && !error && results.length > 0 && (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result._id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    {result.featuredImage ? (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={result.featuredImage.asset.url}
                          alt={result.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                        {getResultIcon(result._type)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      
                      {result.excerpt && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {result.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span className="capitalize">{result._type}</span>
                        
                        {result.publishedAt && (
                          <>
                            <span>•</span>
                            <span>{formatDate(result.publishedAt)}</span>
                          </>
                        )}
                        
                        {result.startDate && (
                          <>
                            <span>•</span>
                            <span>{formatDate(result.startDate)}</span>
                          </>
                        )}
                        
                        {result.author && (
                          <>
                            <span>•</span>
                            <span>{result.author.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              
              {results.length >= 8 && (
                <div className="p-3 border-t border-gray-100">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&type=${selectedType}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => {
                      setIsOpen(false)
                      onClose?.()
                    }}
                  >
                    View all results →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Compact version for mobile
export function CompactGlobalSearch({ onClose }: { onClose?: () => void }) {
  return (
    <GlobalSearch
      placeholder="Search..."
      className="w-full"
      showFilters={false}
      onClose={onClose}
    />
  )
}

// Search modal for mobile
export function SearchModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      
      <div className="relative bg-white h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Search</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <GlobalSearch
            placeholder="Search articles, news, events..."
            className="w-full"
            showFilters={true}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  )
}
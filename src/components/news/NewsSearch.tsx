'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Command } from 'lucide-react'

interface NewsSearchProps {
  initialQuery?: string
  placeholder?: string
  className?: string
}

export default function NewsSearch({ 
  initialQuery = '', 
  placeholder = 'Search news articles...', 
  className = '' 
}: NewsSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)
  
  // Update query when URL changes
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])
  
  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      const timeoutId = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (searchQuery.trim()) {
          params.set('q', searchQuery.trim())
        } else {
          params.delete('q')
        }
        
        // Reset to first page when searching
        params.delete('page')
        
        const queryString = params.toString()
        const newUrl = queryString ? `/news?${queryString}` : '/news'
        
        router.push(newUrl)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    },
    [router, searchParams]
  )
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }
  
  const clearSearch = () => {
    setQuery('')
    debouncedSearch('')
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSearch()
      e.currentTarget.blur()
    }
  }
  
  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById('news-search-input') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }
    
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])
  
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          id="news-search-input"
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500 text-gray-900"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {!isFocused && !query && (
            <div className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-400 bg-gray-50 rounded border mr-2">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Search Results Summary Component
interface SearchResultsSummaryProps {
  query: string
  totalResults: number
  currentPage: number
  itemsPerPage: number
}

export function SearchResultsSummary({ 
  query, 
  totalResults, 
  currentPage, 
  itemsPerPage 
}: SearchResultsSummaryProps) {
  if (!query) return null
  
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalResults)
  
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-800">
            <span className="font-medium">{totalResults}</span> news article{totalResults !== 1 ? 's' : ''} found for{' '}
            <span className="font-semibold">&ldquo;{query}&rdquo;</span>
          </p>
          {totalResults > 0 && (
            <p className="text-xs text-emerald-600 mt-1">
              Showing {startItem}-{endItem} of {totalResults} results
            </p>
          )}
        </div>
        
        {totalResults === 0 && (
          <div className="text-sm text-emerald-700">
            <p>Try adjusting your search terms or browse by category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Quick Search Component (for smaller spaces)
interface QuickSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function QuickSearch({ 
  onSearch, 
  placeholder = 'Quick search...', 
  className = '' 
}: QuickSearchProps) {
  const [query, setQuery] = useState('')
  
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      const timeoutId = setTimeout(() => {
        onSearch(searchQuery)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    },
    [onSearch]
  )
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }
  
  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="block w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500 text-gray-900"
      />
      
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
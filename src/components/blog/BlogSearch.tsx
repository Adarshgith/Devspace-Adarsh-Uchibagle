'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { debounce } from '@/lib/utils'

interface BlogSearchProps {
  initialValue?: string
  placeholder?: string
}

export default function BlogSearch({ 
  initialValue = '', 
  placeholder = 'Search articles...' 
}: BlogSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Debounced search function
  const debouncedSearch = useRef(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (term.trim()) {
        params.set('search', term.trim())
      } else {
        params.delete('search')
      }
      
      // Reset to first page when search changes
      params.delete('page')
      
      const queryString = params.toString()
      const newUrl = queryString ? `/blog?${queryString}` : '/blog'
      
      router.push(newUrl)
    }, 500)
  ).current
  
  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(initialValue)
  }, [initialValue])
  
  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    debouncedSearch(value)
  }
  
  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('')
    debouncedSearch('')
    inputRef.current?.focus()
  }, [debouncedSearch])
  
  // Handle form submission (for immediate search)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    debouncedSearch.cancel() // Cancel debounced search
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim())
    } else {
      params.delete('search')
    }
    
    // Reset to first page when search changes
    params.delete('page')
    
    const queryString = params.toString()
    const newUrl = queryString ? `/blog?${queryString}` : '/blog'
    
    router.push(newUrl)
  }
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      
      // Clear search on Escape
      if (e.key === 'Escape' && isFocused) {
        clearSearch()
        inputRef.current?.blur()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFocused, clearSearch])
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
        />
        
        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
        
        {/* Keyboard Shortcut Hint */}
        {!isFocused && !searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded">
              ⌘K
            </kbd>
          </div>
        )}
      </div>
      
      {/* Search Suggestions (if needed in the future) */}
      {isFocused && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {/* This can be expanded to show search suggestions */}
          <div className="p-3 text-sm text-gray-500">
            Press Enter to search for &ldquo;{searchTerm}&rdquo;
          </div>
        </div>
      )}
    </form>
  )
}

// Search Results Summary Component
export function SearchResultsSummary({ 
  searchTerm, 
  totalResults, 
  currentResults 
}: { 
  searchTerm: string
  totalResults: number
  currentResults: number
}) {
  if (!searchTerm) return null
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Search Results for &ldquo;{searchTerm}&rdquo;
          </span>
        </div>
        <div className="text-sm text-blue-700">
          {totalResults === 0 ? (
            'No results found'
          ) : (
            `${currentResults} of ${totalResults} result${totalResults !== 1 ? 's' : ''}`
          )}
        </div>
      </div>
      
      {totalResults === 0 && (
        <div className="mt-3 text-sm text-blue-700">
          <p>Try searching with different keywords or check your spelling.</p>
        </div>
      )}
    </div>
  )
}

// Quick Search Component (for header or sidebar)
export function QuickSearch({ onSearch }: { onSearch?: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (onSearch) {
      onSearch(searchTerm)
    } else {
      // Navigate to blog page with search
      const params = new URLSearchParams()
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim())
      }
      
      const queryString = params.toString()
      const newUrl = queryString ? `/blog?${queryString}` : '/blog'
      
      router.push(newUrl)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="relative max-w-sm">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Quick search..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>
    </form>
  )
}
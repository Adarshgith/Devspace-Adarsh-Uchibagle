'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, ChevronDown, X } from 'lucide-react'
import { Category, BlogAuthor } from '@/types/sanity'

interface BlogFiltersProps {
  categories: Category[]
  authors: BlogAuthor[]
  initialFilters: {
    category?: string
    author?: string
    sort?: string
  }
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'featured', label: 'Featured First' }
]

export default function BlogFilters({ categories, authors, initialFilters }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    author: initialFilters.author || '',
    sort: initialFilters.sort || 'newest'
  })
  
  const [isOpen, setIsOpen] = useState(false)
  
  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      category: initialFilters.category || '',
      author: initialFilters.author || '',
      sort: initialFilters.sort || 'newest'
    })
  }, [initialFilters])
  
  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove filter parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'newest') {
        params.set(key, value)
      } else if (key === 'sort' && value === 'newest') {
        params.delete(key) // Remove default sort
      } else {
        params.delete(key)
      }
    })
    
    // Reset to first page when filters change
    params.delete('page')
    
    const queryString = params.toString()
    const newUrl = queryString ? `/blog?${queryString}` : '/blog'
    
    router.push(newUrl)
  }
  
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
  }
  
  const clearFilters = () => {
    const newFilters = { category: '', author: '', sort: 'newest' }
    setFilters(newFilters)
    updateURL(newFilters)
  }
  
  const hasActiveFilters = filters.category || filters.author || filters.sort !== 'newest'
  
  return (
    <div className="relative">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Filters {hasActiveFilters && '(Active)'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 space-y-4">
            <MobileFilters 
              categories={categories}
              authors={authors}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}
      </div>
      
      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center space-x-4">
        <DesktopFilters 
          categories={categories}
          authors={authors}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  )
}

// Mobile Filters Component
function MobileFilters({ 
  categories, 
  authors, 
  filters, 
  onFilterChange, 
  onClearFilters, 
  hasActiveFilters 
}: {
  categories: Category[]
  authors: BlogAuthor[]
  filters: { category: string; author: string; sort: string }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}) {
  return (
    <>
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.slug.current}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      
      {/* Author Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author
        </label>
        <select
          value={filters.author}
          onChange={(e) => onFilterChange('author', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author._id} value={author.slug.current}>
              {author.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Sort Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
          <span>Clear Filters</span>
        </button>
      )}
    </>
  )
}

// Desktop Filters Component
function DesktopFilters({ 
  categories, 
  authors, 
  filters, 
  onFilterChange, 
  onClearFilters, 
  hasActiveFilters 
}: {
  categories: Category[]
  authors: BlogAuthor[]
  filters: { category: string; author: string; sort: string }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}) {
  return (
    <>
      {/* Category Filter */}
      <div className="min-w-0 flex-1">
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.slug.current}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      
      {/* Author Filter */}
      <div className="min-w-0 flex-1">
        <select
          value={filters.author}
          onChange={(e) => onFilterChange('author', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author._id} value={author.slug.current}>
              {author.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Sort Filter */}
      <div className="min-w-0 flex-1">
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap"
        >
          <X className="w-4 h-4" />
          <span>Clear</span>
        </button>
      )}
    </>
  )
}
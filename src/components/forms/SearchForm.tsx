'use client'

import React from 'react'
import { Controller } from 'react-hook-form'
import { Search, Filter, X } from 'lucide-react'
import { searchFormSchema, type SearchFormData, sanitizeSearchQuery } from '@/lib/validations'
import { Form, FormField, Input, Select, SubmitButton } from './FormComponents'
import { useSearch } from '@/hooks/useSearch'

interface SearchFormProps {
  onSubmit?: (data: SearchFormData) => void
  onClear?: () => void
  className?: string
  showAdvancedFilters?: boolean
  placeholder?: string
  categories?: { value: string; label: string }[]
}

const DEFAULT_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'blog', label: 'Blog Posts' },
  { value: 'news', label: 'News' },
  { value: 'events', label: 'Events' },
  { value: 'pages', label: 'Pages' }
]

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'date', label: 'Most Recent' },
  { value: 'title', label: 'Alphabetical' }
]

export function SearchForm({
  onSubmit,
  onClear,
  className,
  showAdvancedFilters = false,
  placeholder = 'Search...',
  categories = DEFAULT_CATEGORIES
}: SearchFormProps) {
  const [showFilters, setShowFilters] = React.useState(false)
  const { query, setQuery } = useSearch()

  const handleSubmit = (data: SearchFormData) => {
    // Sanitize search query
    const sanitizedData = {
      ...data,
      query: sanitizeSearchQuery(data.query)
    }
    
    if (onSubmit) {
      onSubmit(sanitizedData)
    } else {
      // Default search behavior - update URL
      const params = new URLSearchParams()
      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (value && value !== '') {
          params.set(key, value)
        }
      })
      
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.pushState({}, '', newUrl)
      
      // Trigger search
      setQuery(sanitizedData.query)
    }
  }

  const handleClear = () => {
    setQuery('')
    if (onClear) {
      onClear()
    } else {
      // Clear URL params
      window.history.pushState({}, '', window.location.pathname)
    }
  }

  return (
    <div className={`${className}`}>
      <Form 
        schema={searchFormSchema} 
        onSubmit={handleSubmit}
        sanitizeInputs={false} // We handle sanitization manually
      >
        {({ control, formState: { errors }, watch, reset }) => {
          const watchedQuery = watch('query')
          const hasQuery = watchedQuery && watchedQuery.length > 0
          
          return (
            <div className="space-y-4">
              {/* Main search input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                
                <Controller
                  name="query"
                  control={control}
                  defaultValue={query}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="search"
                      placeholder={placeholder}
                      error={errors.query}
                      className="pl-10 pr-20"
                      autoComplete="off"
                    />
                  )}
                />
                
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  {hasQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        reset({ query: '', category: '', dateFrom: '', dateTo: '', sortBy: 'relevance' })
                        handleClear()
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  
                  {showAdvancedFilters && (
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-1 transition-colors ${
                        showFilters 
                          ? 'text-blue-600 hover:text-blue-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      aria-label="Toggle filters"
                    >
                      <Filter className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced filters */}
              {showAdvancedFilters && showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField label="Category">
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={categories}
                            placeholder="All Categories"
                          />
                        )}
                      />
                    </FormField>

                    <FormField label="Date From">
                      <Controller
                        name="dateFrom"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="date"
                          />
                        )}
                      />
                    </FormField>

                    <FormField label="Date To">
                      <Controller
                        name="dateTo"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="date"
                          />
                        )}
                      />
                    </FormField>

                    <FormField label="Sort By">
                      <Controller
                        name="sortBy"
                        control={control}
                        defaultValue="relevance"
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={SORT_OPTIONS}
                          />
                        )}
                      />
                    </FormField>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        reset({ query: watchedQuery, category: '', dateFrom: '', dateTo: '', sortBy: 'relevance' })
                      }}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Clear Filters
                    </button>
                    
                    <SubmitButton className="w-auto px-6">
                      Apply Filters
                    </SubmitButton>
                  </div>
                </div>
              )}

              {/* Simple search button for basic form */}
              {!showAdvancedFilters && (
                <SubmitButton>
                  Search
                </SubmitButton>
              )}
            </div>
          )
        }}
      </Form>
    </div>
  )
}

// Compact search form for headers/sidebars
export function CompactSearchForm({ onSubmit, className, placeholder = 'Search...' }: Omit<SearchFormProps, 'showAdvancedFilters'>) {
  return (
    <SearchForm
      onSubmit={onSubmit}
      className={className}
      placeholder={placeholder}
      showAdvancedFilters={false}
    />
  )
}

export default SearchForm
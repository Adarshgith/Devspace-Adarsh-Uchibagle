import { useState, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface FilterOptions {
  category?: string
  author?: string
  dateRange?: {
    start?: string
    end?: string
  }
  featured?: boolean
  upcoming?: boolean // for events
  virtual?: boolean // for events
  tags?: string[]
  sortBy?: 'date' | 'title' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}

export interface UseContentFiltersReturn {
  filters: FilterOptions
  setFilter: (key: keyof FilterOptions, value: any) => void
  clearFilters: () => void
  clearFilter: (key: keyof FilterOptions) => void
  hasActiveFilters: boolean
  updateURL: (newFilters: Partial<FilterOptions>) => void
  resetToDefaults: () => void
}

const DEFAULT_FILTERS: FilterOptions = {
  sortBy: 'date',
  sortOrder: 'desc'
}

export function useContentFilters(initialFilters: FilterOptions = {}): UseContentFiltersReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize filters from URL params or defaults
  const getInitialFilters = useCallback((): FilterOptions => {
    const urlFilters: FilterOptions = { ...DEFAULT_FILTERS, ...initialFilters }
    
    // Parse URL parameters
    if (searchParams.get('category')) {
      urlFilters.category = searchParams.get('category') || undefined
    }
    if (searchParams.get('author')) {
      urlFilters.author = searchParams.get('author') || undefined
    }
    if (searchParams.get('featured')) {
      urlFilters.featured = searchParams.get('featured') === 'true'
    }
    if (searchParams.get('upcoming')) {
      urlFilters.upcoming = searchParams.get('upcoming') === 'true'
    }
    if (searchParams.get('virtual')) {
      urlFilters.virtual = searchParams.get('virtual') === 'true'
    }
    if (searchParams.get('sortBy')) {
      urlFilters.sortBy = searchParams.get('sortBy') as 'date' | 'title' | 'popularity'
    }
    if (searchParams.get('sortOrder')) {
      urlFilters.sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc'
    }
    if (searchParams.get('tags')) {
      urlFilters.tags = searchParams.get('tags')?.split(',').filter(Boolean)
    }
    if (searchParams.get('dateStart') || searchParams.get('dateEnd')) {
      urlFilters.dateRange = {
        start: searchParams.get('dateStart') || undefined,
        end: searchParams.get('dateEnd') || undefined
      }
    }
    
    return urlFilters
  }, [searchParams, initialFilters])
  
  const [filters, setFilters] = useState<FilterOptions>(getInitialFilters)
  
  // Update a specific filter
  const setFilter = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      
      if (value === undefined || value === null || value === '') {
        delete newFilters[key]
      } else {
        newFilters[key] = value
      }
      
      return newFilters
    })
  }, [])
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])
  
  // Clear a specific filter
  const clearFilter = useCallback((key: keyof FilterOptions) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }, [])
  
  // Check if any filters are active (excluding defaults)
  const hasActiveFilters = useMemo(() => {
    const activeKeys = Object.keys(filters).filter(key => {
      const filterKey = key as keyof FilterOptions
      const value = filters[filterKey]
      const defaultValue = DEFAULT_FILTERS[filterKey]
      
      // Skip if value is undefined or matches default
      if (value === undefined || value === defaultValue) return false
      
      // Handle arrays
      if (Array.isArray(value)) {
        return value.length > 0
      }
      
      // Handle objects (dateRange)
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== undefined && v !== '')
      }
      
      return true
    })
    
    return activeKeys.length > 0
  }, [filters])
  
  // Update URL with current filters
  const updateURL = useCallback((newFilters: Partial<FilterOptions> = {}) => {
    const updatedFilters = { ...filters, ...newFilters }
    const params = new URLSearchParams()
    
    // Add filters to URL params
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      
      switch (key) {
        case 'dateRange':
          if (typeof value === 'object' && value !== null) {
            const dateRange = value as { start?: string; end?: string }
            if (dateRange.start) params.set('dateStart', dateRange.start)
            if (dateRange.end) params.set('dateEnd', dateRange.end)
          }
          break
        case 'tags':
          if (Array.isArray(value) && value.length > 0) {
            params.set('tags', value.join(','))
          }
          break
        case 'featured':
        case 'upcoming':
        case 'virtual':
          if (typeof value === 'boolean') {
            params.set(key, value.toString())
          }
          break
        default:
          if (typeof value === 'string' && value !== '') {
            params.set(key, value)
          }
      }
    })
    
    // Update URL without page reload
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newURL, { scroll: false })
  }, [filters, router])
  
  // Reset to default filters
  const resetToDefaults = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    router.push(window.location.pathname, { scroll: false })
  }, [router])
  
  return {
    filters,
    setFilter,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    updateURL,
    resetToDefaults
  }
}

// Helper function to apply filters to content array
export function applyContentFilters<T extends Record<string, any>>(
  content: T[],
  filters: FilterOptions,
  getters: {
    getCategory?: (item: T) => string | undefined
    getAuthor?: (item: T) => string | undefined
    getDate?: (item: T) => string | undefined
    getFeatured?: (item: T) => boolean | undefined
    getUpcoming?: (item: T) => boolean | undefined
    getVirtual?: (item: T) => boolean | undefined
    getTags?: (item: T) => string[] | undefined
  } = {}
): T[] {
  let filtered = [...content]
  
  // Apply category filter
  if (filters.category && getters.getCategory) {
    filtered = filtered.filter(item => 
      getters.getCategory!(item)?.toLowerCase().includes(filters.category!.toLowerCase())
    )
  }
  
  // Apply author filter
  if (filters.author && getters.getAuthor) {
    filtered = filtered.filter(item => 
      getters.getAuthor!(item)?.toLowerCase().includes(filters.author!.toLowerCase())
    )
  }
  
  // Apply featured filter
  if (filters.featured !== undefined && getters.getFeatured) {
    filtered = filtered.filter(item => getters.getFeatured!(item) === filters.featured)
  }
  
  // Apply upcoming filter (for events)
  if (filters.upcoming !== undefined && getters.getUpcoming) {
    filtered = filtered.filter(item => getters.getUpcoming!(item) === filters.upcoming)
  }
  
  // Apply virtual filter (for events)
  if (filters.virtual !== undefined && getters.getVirtual) {
    filtered = filtered.filter(item => getters.getVirtual!(item) === filters.virtual)
  }
  
  // Apply tags filter
  if (filters.tags && filters.tags.length > 0 && getters.getTags) {
    filtered = filtered.filter(item => {
      const itemTags = getters.getTags!(item) || []
      return filters.tags!.some(tag => 
        itemTags.some(itemTag => 
          itemTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    })
  }
  
  // Apply date range filter
  if (filters.dateRange && getters.getDate) {
    const { start, end } = filters.dateRange
    if (start || end) {
      filtered = filtered.filter(item => {
        const itemDate = getters.getDate!(item)
        if (!itemDate) return false
        
        const date = new Date(itemDate)
        const startDate = start ? new Date(start) : null
        const endDate = end ? new Date(end) : null
        
        if (startDate && date < startDate) return false
        if (endDate && date > endDate) return false
        
        return true
      })
    }
  }
  
  // Apply sorting
  if (filters.sortBy && getters.getDate) {
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(getters.getDate!(a) || 0)
          bValue = new Date(getters.getDate!(b) || 0)
          break
        case 'title':
          aValue = a.title || ''
          bValue = b.title || ''
          break
        case 'popularity':
          // Assume popularity is based on featured status or view count
          aValue = getters.getFeatured ? (getters.getFeatured(a) ? 1 : 0) : 0
          bValue = getters.getFeatured ? (getters.getFeatured(b) ? 1 : 0) : 0
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return filtered
}
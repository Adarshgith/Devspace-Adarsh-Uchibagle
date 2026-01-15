'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, ChevronDown, X, Calendar, MapPin } from 'lucide-react'

interface EventFiltersProps {
  eventTypes: string[]
  locations: string[]
  initialFilters: {
    type?: string
    location?: string
    sort?: string
  }
}

const sortOptions = [
  { value: 'date', label: 'Date (Earliest First)' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'featured', label: 'Featured First' }
]

export default function EventFilters({ eventTypes, locations, initialFilters }: EventFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    type: initialFilters.type || '',
    location: initialFilters.location || '',
    sort: initialFilters.sort || 'date'
  })
  
  const [isOpen, setIsOpen] = useState(false)
  
  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      type: initialFilters.type || '',
      location: initialFilters.location || '',
      sort: initialFilters.sort || 'date'
    })
  }, [initialFilters])
  
  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove filter parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'date') {
        params.set(key, value)
      } else if (key === 'sort' && value === 'date') {
        params.delete(key) // Remove default sort
      } else {
        params.delete(key)
      }
    })
    
    // Reset to first page when filters change
    params.delete('page')
    
    const queryString = params.toString()
    const newUrl = queryString ? `/events?${queryString}` : '/events'
    
    router.push(newUrl)
  }
  
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
  }
  
  const clearFilters = () => {
    const newFilters = { type: '', location: '', sort: 'date' }
    setFilters(newFilters)
    updateURL(newFilters)
  }
  
  const hasActiveFilters = filters.type || filters.location || filters.sort !== 'date'
  
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
              eventTypes={eventTypes}
              locations={locations}
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
          eventTypes={eventTypes}
          locations={locations}
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
  eventTypes, 
  locations, 
  filters, 
  onFilterChange, 
  onClearFilters, 
  hasActiveFilters 
}: {
  eventTypes: string[]
  locations: string[]
  filters: { type: string; location: string; sort: string }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}) {
  return (
    <>
      {/* Event Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Event Type</span>
          </div>
        </label>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Location Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </div>
        </label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">All Locations</option>
          <option value="virtual">Virtual Events</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
  eventTypes, 
  locations, 
  filters, 
  onFilterChange, 
  onClearFilters, 
  hasActiveFilters 
}: {
  eventTypes: string[]
  locations: string[]
  filters: { type: string; location: string; sort: string }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}) {
  return (
    <>
      {/* Event Type Filter */}
      <div className="min-w-0 flex-1">
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="">All Types</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Location Filter */}
      <div className="min-w-0 flex-1">
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="">All Locations</option>
          <option value="virtual">Virtual Events</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
      
      {/* Sort Filter */}
      <div className="min-w-0 flex-1">
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
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
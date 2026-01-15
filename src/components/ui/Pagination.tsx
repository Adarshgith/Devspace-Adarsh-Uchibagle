'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
  className?: string
  showPageNumbers?: boolean
  maxVisiblePages?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
  className,
  showPageNumbers = true,
  maxVisiblePages = 5
}: PaginationProps) {
  if (totalPages <= 1) return null
  
  // Build URL with search params
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    
    // Add existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    })
    
    // Add page param if not page 1
    if (page > 1) {
      params.set('page', page.toString())
    }
    
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }
  
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate start and end of middle section
      const start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
      const end = Math.min(totalPages - 1, start + maxVisiblePages - 3)
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('ellipsis')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }
  
  const visiblePages = getVisiblePages()
  
  return (
    <nav 
      className={cn('flex items-center justify-center space-x-1', className)}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <PaginationButton
        href={currentPage > 1 ? buildUrl(currentPage - 1) : undefined}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
        className="mr-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </PaginationButton>
      
      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-500"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              )
            }
            
            return (
              <PaginationButton
                key={page}
                href={buildUrl(page)}
                active={page === currentPage}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </PaginationButton>
            )
          })}
        </div>
      )}
      
      {/* Next Button */}
      <PaginationButton
        href={currentPage < totalPages ? buildUrl(currentPage + 1) : undefined}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
        className="ml-2"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="w-4 h-4" />
      </PaginationButton>
    </nav>
  )
}

// Pagination Button Component
interface PaginationButtonProps {
  href?: string
  disabled?: boolean
  active?: boolean
  children: React.ReactNode
  className?: string
  'aria-label'?: string
  'aria-current'?: string
}

function PaginationButton({
  href,
  disabled = false,
  active = false,
  children,
  className,
  ...props
}: PaginationButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    {
      // Active state
      'bg-blue-600 text-white shadow-sm': active,
      // Normal state
      'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900': !active && !disabled,
      // Disabled state
      'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed': disabled,
    },
    className
  )
  
  if (disabled || !href) {
    return (
      <span className={baseClasses} {...props}>
        {children}
      </span>
    )
  }
  
  return (
    <Link href={href} className={baseClasses} {...props}>
      {children}
    </Link>
  )
}

// Compact Pagination (for mobile or tight spaces)
export function CompactPagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
  className
}: Omit<PaginationProps, 'showPageNumbers' | 'maxVisiblePages'>) {
  if (totalPages <= 1) return null
  
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    })
    
    if (page > 1) {
      params.set('page', page.toString())
    }
    
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }
  
  return (
    <nav 
      className={cn('flex items-center justify-between', className)}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <PaginationButton
        href={currentPage > 1 ? buildUrl(currentPage - 1) : undefined}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </PaginationButton>
      
      {/* Page Info */}
      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      
      {/* Next Button */}
      <PaginationButton
        href={currentPage < totalPages ? buildUrl(currentPage + 1) : undefined}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </PaginationButton>
    </nav>
  )
}

// Pagination Info Component
export function PaginationInfo({
  currentPage,
  totalItems,
  itemsPerPage,
  className
}: {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  className?: string
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  return (
    <div className={cn('text-sm text-gray-700', className)}>
      Showing {startItem} to {endItem} of {totalItems} results
    </div>
  )
}

// Load More Button (alternative to pagination)
export function LoadMoreButton({
  onLoadMore,
  loading = false,
  hasMore = true,
  className
}: {
  onLoadMore: () => void
  loading?: boolean
  hasMore?: boolean
  className?: string
}) {
  if (!hasMore) return null
  
  return (
    <div className={cn('text-center', className)}>
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  )
}
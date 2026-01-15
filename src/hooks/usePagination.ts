import { useState, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface PaginationOptions {
  initialPage?: number
  pageSize?: number
  totalItems?: number
  maxVisiblePages?: number
  updateURL?: boolean
}

export interface UsePaginationReturn {
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startIndex: number
  endIndex: number
  visiblePages: number[]
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  setPageSize: (size: number) => void
  getPageItems: <T>(items: T[]) => T[]
  updateURL: (page?: number, size?: number) => void
}

const DEFAULT_OPTIONS: Required<PaginationOptions> = {
  initialPage: 1,
  pageSize: 10,
  totalItems: 0,
  maxVisiblePages: 5,
  updateURL: true
}

export function usePagination(
  totalItems: number,
  options: PaginationOptions = {}
): UsePaginationReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mergedOptions = { ...DEFAULT_OPTIONS, totalItems, ...options }
  
  // Initialize from URL params or defaults
  const getInitialPage = useCallback((): number => {
    if (!mergedOptions.updateURL) return mergedOptions.initialPage
    
    const pageParam = searchParams.get('page')
    const page = pageParam ? parseInt(pageParam, 10) : mergedOptions.initialPage
    return Math.max(1, page)
  }, [searchParams, mergedOptions.initialPage, mergedOptions.updateURL])
  
  const getInitialPageSize = useCallback((): number => {
    if (!mergedOptions.updateURL) return mergedOptions.pageSize
    
    const sizeParam = searchParams.get('pageSize')
    const size = sizeParam ? parseInt(sizeParam, 10) : mergedOptions.pageSize
    return Math.max(1, size)
  }, [searchParams, mergedOptions.pageSize, mergedOptions.updateURL])
  
  const [currentPage, setCurrentPage] = useState(getInitialPage)
  const [pageSize, setPageSizeState] = useState(getInitialPageSize)
  
  // Calculate derived values
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize))
  }, [totalItems, pageSize])
  
  const hasNextPage = useMemo(() => {
    return currentPage < totalPages
  }, [currentPage, totalPages])
  
  const hasPreviousPage = useMemo(() => {
    return currentPage > 1
  }, [currentPage])
  
  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize
  }, [currentPage, pageSize])
  
  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize - 1, totalItems - 1)
  }, [startIndex, pageSize, totalItems])
  
  // Calculate visible page numbers
  const visiblePages = useMemo(() => {
    const { maxVisiblePages } = mergedOptions
    const pages: number[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Calculate range around current page
      const halfVisible = Math.floor(maxVisiblePages / 2)
      let startPage = Math.max(1, currentPage - halfVisible)
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }, [currentPage, totalPages, mergedOptions.maxVisiblePages])
  
  // Update URL with pagination params
  const updateURL = useCallback((page?: number, size?: number) => {
    if (!mergedOptions.updateURL) return
    
    const params = new URLSearchParams(searchParams.toString())
    const newPage = page ?? currentPage
    const newSize = size ?? pageSize
    
    if (newPage > 1) {
      params.set('page', newPage.toString())
    } else {
      params.delete('page')
    }
    
    if (newSize !== DEFAULT_OPTIONS.pageSize) {
      params.set('pageSize', newSize.toString())
    } else {
      params.delete('pageSize')
    }
    
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newURL, { scroll: false })
  }, [currentPage, pageSize, searchParams, router, mergedOptions.updateURL])
  
  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
    updateURL(validPage)
  }, [totalPages, updateURL])
  
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1)
    }
  }, [hasNextPage, currentPage, goToPage])
  
  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1)
    }
  }, [hasPreviousPage, currentPage, goToPage])
  
  const goToFirstPage = useCallback(() => {
    goToPage(1)
  }, [goToPage])
  
  const goToLastPage = useCallback(() => {
    goToPage(totalPages)
  }, [goToPage, totalPages])
  
  const setPageSize = useCallback((size: number) => {
    const validSize = Math.max(1, size)
    setPageSizeState(validSize)
    
    // Adjust current page if necessary
    const newTotalPages = Math.ceil(totalItems / validSize)
    const newCurrentPage = Math.min(currentPage, newTotalPages)
    
    setCurrentPage(newCurrentPage)
    updateURL(newCurrentPage, validSize)
  }, [currentPage, totalItems, updateURL])
  
  // Get paginated items from array
  const getPageItems = useCallback(<T>(items: T[]): T[] => {
    const start = startIndex
    const end = start + pageSize
    return items.slice(start, end)
  }, [startIndex, pageSize])
  
  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    visiblePages,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    setPageSize,
    getPageItems,
    updateURL
  }
}

// Helper hook for infinite scroll pagination
export function useInfiniteScroll<T>(
  items: T[],
  options: {
    pageSize?: number
    threshold?: number
    hasMore?: boolean
    onLoadMore?: () => void
  } = {}
) {
  const { pageSize = 10, threshold = 100, hasMore = true, onLoadMore } = options
  const [visibleCount, setVisibleCount] = useState(pageSize)
  
  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount)
  }, [items, visibleCount])
  
  const loadMore = useCallback(() => {
    if (hasMore && visibleCount < items.length) {
      setVisibleCount(prev => Math.min(prev + pageSize, items.length))
      onLoadMore?.()
    }
  }, [hasMore, visibleCount, items.length, pageSize, onLoadMore])
  
  const reset = useCallback(() => {
    setVisibleCount(pageSize)
  }, [pageSize])
  
  // Auto-load when scrolling near bottom
  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    
    if (distanceFromBottom < threshold && hasMore && visibleCount < items.length) {
      loadMore()
    }
  }, [threshold, hasMore, visibleCount, items.length, loadMore])
  
  return {
    visibleItems,
    visibleCount,
    hasMore: hasMore && visibleCount < items.length,
    loadMore,
    reset,
    handleScroll
  }
}
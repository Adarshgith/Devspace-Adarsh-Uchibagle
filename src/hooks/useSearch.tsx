import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from './useDebounce'

export interface SearchOptions {
  query: string
  searchFields?: string[]
  minLength?: number
  debounceMs?: number
  caseSensitive?: boolean
  exactMatch?: boolean
  highlightMatches?: boolean
}

export interface SearchResult<T> {
  item: T
  score: number
  matches: {
    field: string
    indices: [number, number][]
    value: string
  }[]
}

export interface UseSearchReturn<T> {
  query: string
  setQuery: (query: string) => void
  results: SearchResult<T>[]
  isSearching: boolean
  hasResults: boolean
  clearSearch: () => void
  updateURL: (query: string) => void
  highlightText: (text: string, className?: string) => React.ReactNode
}

const DEFAULT_OPTIONS: Required<Omit<SearchOptions, 'query'>> = {
  searchFields: ['title', 'excerpt', 'content'],
  minLength: 2,
  debounceMs: 300,
  caseSensitive: false,
  exactMatch: false,
  highlightMatches: true
}

export function useSearch<T extends Record<string, any>>(
  data: T[] = [],
  options: SearchOptions = {}
): UseSearchReturn<T> {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  
  // Initialize query from URL or provided query
  const initialQuery = searchParams.get('q') || options?.query || ''
  const [query, setQueryState] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  
  // Debounce the search query
  const debouncedQuery = useDebounce(query, mergedOptions.debounceMs)
  
  // Set query with URL update option
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery)
  }, [])
  
  // Clear search
  const clearSearch = useCallback(() => {
    setQueryState('')
    router.push(window.location.pathname, { scroll: false })
  }, [router])
  
  // Update URL with search query
  const updateURL = useCallback((searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    } else {
      params.delete('q')
    }
    
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newURL, { scroll: false })
  }, [router, searchParams])
  
  // Perform search with scoring and highlighting
  const results = useMemo((): SearchResult<T>[] => {
    if (!debouncedQuery || debouncedQuery.length < mergedOptions.minLength) {
      return []
    }
    
    setIsSearching(true)
    
    const searchTerm = mergedOptions.caseSensitive 
      ? debouncedQuery 
      : debouncedQuery.toLowerCase()
    
    const searchResults: SearchResult<T>[] = []
    
    data.forEach(item => {
      let totalScore = 0
      const matches: SearchResult<T>['matches'] = []
      
      mergedOptions.searchFields.forEach(field => {
        const fieldValue = getNestedValue(item, field)
        if (!fieldValue) return
        
        const textValue = String(fieldValue)
        const searchText = mergedOptions.caseSensitive ? textValue : textValue.toLowerCase()
        
        let fieldScore = 0
        const fieldMatches: [number, number][] = []
        
        if (mergedOptions.exactMatch) {
          // Exact match scoring
          if (searchText === searchTerm) {
            fieldScore = 100
            fieldMatches.push([0, textValue.length])
          } else if (searchText.includes(searchTerm)) {
            fieldScore = 50
            let index = searchText.indexOf(searchTerm)
            while (index !== -1) {
              fieldMatches.push([index, index + searchTerm.length])
              index = searchText.indexOf(searchTerm, index + 1)
            }
          }
        } else {
          // Fuzzy matching with word boundaries
          const words = searchTerm.split(/\s+/).filter(Boolean)
          let matchedWords = 0
          
          words.forEach(word => {
            if (searchText.includes(word)) {
              matchedWords++
              let index = searchText.indexOf(word)
              while (index !== -1) {
                fieldMatches.push([index, index + word.length])
                index = searchText.indexOf(word, index + 1)
              }
            }
          })
          
          // Calculate score based on matched words and field importance
          if (matchedWords > 0) {
            const wordMatchRatio = matchedWords / words.length
            const fieldWeight = getFieldWeight(field)
            fieldScore = wordMatchRatio * fieldWeight * 100
            
            // Bonus for exact phrase match
            if (searchText.includes(searchTerm)) {
              fieldScore += 25
            }
            
            // Bonus for match at beginning
            if (searchText.startsWith(searchTerm)) {
              fieldScore += 15
            }
          }
        }
        
        if (fieldScore > 0) {
          totalScore += fieldScore
          matches.push({
            field,
            indices: fieldMatches,
            value: textValue
          })
        }
      })
      
      if (totalScore > 0) {
        searchResults.push({
          item,
          score: totalScore,
          matches
        })
      }
    })
    
    // Sort by score (highest first)
    searchResults.sort((a, b) => b.score - a.score)
    
    setIsSearching(false)
    return searchResults
  }, [data, debouncedQuery, mergedOptions])
  
  // Highlight text function
  const highlightText = useCallback((text: string, className = 'bg-yellow-200 font-medium') => {
    if (!mergedOptions.highlightMatches || !debouncedQuery || debouncedQuery.length < mergedOptions.minLength) {
      return text
    }
    
    const searchTerm = mergedOptions.caseSensitive ? debouncedQuery : debouncedQuery.toLowerCase()
    const searchText = mergedOptions.caseSensitive ? text : text.toLowerCase()
    
    if (!searchText.includes(searchTerm)) {
      return text
    }
    
    // Create highlighted version
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    
    const words = searchTerm.split(/\s+/).filter(Boolean)
    const allMatches: { start: number; end: number }[] = []
    
    words.forEach(word => {
      let index = searchText.indexOf(word)
      while (index !== -1) {
        allMatches.push({ start: index, end: index + word.length })
        index = searchText.indexOf(word, index + 1)
      }
    })
    
    // Sort and merge overlapping matches
    allMatches.sort((a, b) => a.start - b.start)
    const mergedMatches: { start: number; end: number }[] = []
    
    allMatches.forEach(match => {
      if (mergedMatches.length === 0) {
        mergedMatches.push(match)
      } else {
        const lastMatch = mergedMatches[mergedMatches.length - 1]
        if (match.start <= lastMatch.end) {
          lastMatch.end = Math.max(lastMatch.end, match.end)
        } else {
          mergedMatches.push(match)
        }
      }
    })
    
    mergedMatches.forEach((match, index) => {
      // Add text before match
      if (match.start > lastIndex) {
        parts.push(text.slice(lastIndex, match.start))
      }
      
      // Add highlighted match
      parts.push(
        <span key={index} className={className}>
          {text.slice(match.start, match.end)}
        </span>
      )
      
      lastIndex = match.end
    })
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }
    
    return parts
  }, [debouncedQuery, mergedOptions])
  
  // Update URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== initialQuery) {
      updateURL(debouncedQuery)
    }
  }, [debouncedQuery, updateURL, initialQuery])
  
  return {
    query,
    setQuery,
    results,
    isSearching,
    hasResults: results.length > 0,
    clearSearch,
    updateURL,
    highlightText
  }
}

// Helper function to get nested object values
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

// Helper function to determine field importance for scoring
function getFieldWeight(field: string): number {
  const weights: Record<string, number> = {
    title: 3,
    name: 3,
    heading: 2.5,
    excerpt: 2,
    description: 2,
    content: 1,
    body: 1,
    tags: 1.5,
    category: 1.5,
    author: 1.2
  }
  
  return weights[field.toLowerCase()] || 1
}

// Search suggestions hook
export function useSearchSuggestions<T extends Record<string, any>>(
  data: T[],
  query: string,
  options: {
    maxSuggestions?: number
    fields?: string[]
    minLength?: number
  } = {}
) {
  const { maxSuggestions = 5, fields = ['title'], minLength = 1 } = options
  
  return useMemo(() => {
    if (!query || query.length < minLength) return []
    
    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()
    
    data.forEach(item => {
      fields.forEach(field => {
        const value = getNestedValue(item, field)
        if (value && typeof value === 'string') {
          const words = value.toLowerCase().split(/\s+/)
          words.forEach(word => {
            if (word.startsWith(queryLower) && word !== queryLower) {
              suggestions.add(word)
            }
          })
        }
      })
    })
    
    return Array.from(suggestions).slice(0, maxSuggestions)
  }, [data, query, maxSuggestions, fields, minLength])
}
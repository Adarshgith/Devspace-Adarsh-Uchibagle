import { useState, useEffect } from 'react'

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timer if the value changes before the delay is complete
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for debouncing search queries with additional features
 * @param value - The search query to debounce
 * @param delay - The delay in milliseconds
 * @param minLength - Minimum length before debouncing starts
 * @returns Object with debounced value and loading state
 */
export function useSearchDebounce(
  value: string,
  delay: number = 300,
  minLength: number = 2
) {
  const [debouncedValue, setDebouncedValue] = useState('')
  const [isDebouncing, setIsDebouncing] = useState(false)

  useEffect(() => {
    // Don't debounce if value is too short
    if (value.length < minLength) {
      setDebouncedValue('')
      setIsDebouncing(false)
      return
    }

    setIsDebouncing(true)

    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsDebouncing(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, minLength])

  return {
    debouncedValue,
    isDebouncing
  }
}
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Format date to readable string
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Date not available'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return 'Invalid date'
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format date for SEO (ISO format)
export function formatDateISO(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString()
}

// Check if event is upcoming
export function isUpcomingEvent(startDate: string): boolean {
  return new Date(startDate) > new Date()
}

// Check if event is past
export function isPastEvent(endDate: string | undefined, startDate: string): boolean {
  const compareDate = endDate || startDate
  return new Date(compareDate) < new Date()
}

// Generate excerpt from content
export function generateExcerpt(content: string | undefined | null, maxLength: number = 160): string {
  if (!content) return ''
  // Ensure content is a string
  const textContent = typeof content === 'string' ? content : String(content)
  if (textContent.length <= maxLength) return textContent
  return textContent.substring(0, maxLength).trim() + '...'
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Get reading time estimate
export function getReadingTime(content: string | undefined | null): number {
  if (!content) return 0
  // Ensure content is a string
  const textContent = typeof content === 'string' ? content : String(content)
  const wordsPerMinute = 200
  const words = textContent.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate meta description
export function generateMetaDescription(content: string, fallback: string = ''): string {
  if (!content && !fallback) return ''
  const text = content || fallback
  return generateExcerpt(text.replace(/<[^>]*>/g, ''), 160)
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Generate breadcrumbs
export function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs = [
    { label: 'Home', href: '/' }
  ]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
    breadcrumbs.push({
      label,
      href: currentPath,
      isLast: index === paths.length - 1
    })
  })
  
  return breadcrumbs
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Generate random ID
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Check if URL is external
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname !== window.location.hostname
  } catch {
    return false
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
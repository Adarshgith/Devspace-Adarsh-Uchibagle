import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

const Skeleton = React.memo<SkeletonProps>(({ 
  className, 
  variant = 'rectangular', 
  width, 
  height, 
  animation = 'pulse' 
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg'
  }
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could be enhanced with custom wave animation
    none: ''
  }
  
  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  )
})

Skeleton.displayName = 'Skeleton'

// Content Card Skeleton
interface ContentCardSkeletonProps {
  featured?: boolean
  showImage?: boolean
  showAuthor?: boolean
  className?: string
}

const ContentCardSkeleton = React.memo<ContentCardSkeletonProps>(({ 
  featured = false, 
  showImage = true, 
  showAuthor = false,
  className 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-lg overflow-hidden",
      featured && "lg:col-span-2",
      className
    )}>
      {/* Image Skeleton */}
      {showImage && (
        <Skeleton 
          className={cn(
            "w-full",
            featured ? "h-64 lg:h-80" : "h-48"
          )}
          variant="rectangular"
        />
      )}
      
      {/* Content Skeleton */}
      <div className={cn("p-6", featured && "lg:p-8")}>
        {/* Meta Information Skeleton */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Skeleton className="w-4 h-4" variant="circular" />
            <Skeleton className="w-20 h-4" variant="text" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="w-4 h-4" variant="circular" />
            <Skeleton className="w-16 h-4" variant="text" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="w-4 h-4" variant="circular" />
            <Skeleton className="w-24 h-4" variant="text" />
          </div>
        </div>
        
        {/* Title Skeleton */}
        <div className="mb-3">
          <Skeleton 
            className={cn(
              "w-full mb-2",
              featured ? "h-6 lg:h-8" : "h-5"
            )} 
            variant="text" 
          />
          <Skeleton 
            className={cn(
              "w-3/4",
              featured ? "h-6 lg:h-8" : "h-5"
            )} 
            variant="text" 
          />
        </div>
        
        {/* Excerpt Skeleton */}
        <div className="mb-4 space-y-2">
          <Skeleton className="w-full h-4" variant="text" />
          <Skeleton className="w-full h-4" variant="text" />
          <Skeleton className="w-2/3 h-4" variant="text" />
        </div>
        
        {/* Author Skeleton (for featured blog posts) */}
        {featured && showAuthor && (
          <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <Skeleton className="w-12 h-12" variant="circular" />
            <div className="flex-1">
              <Skeleton className="w-32 h-4 mb-1" variant="text" />
              <Skeleton className="w-48 h-3" variant="text" />
            </div>
          </div>
        )}
        
        {/* Action Buttons Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Skeleton className="w-20 h-4" variant="text" />
            <Skeleton className="w-4 h-4" variant="circular" />
          </div>
          <Skeleton className="w-20 h-8" variant="rounded" />
        </div>
      </div>
    </div>
  )
})

ContentCardSkeleton.displayName = 'ContentCardSkeleton'

// Grid Skeleton for multiple cards
interface ContentGridSkeletonProps {
  count?: number
  featured?: boolean
  showImage?: boolean
  showAuthor?: boolean
  className?: string
}

const ContentGridSkeleton = React.memo<ContentGridSkeletonProps>(({ 
  count = 6, 
  featured = false, 
  showImage = true, 
  showAuthor = false,
  className 
}) => {
  return (
    <div className={cn(
      "grid gap-6",
      featured ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <ContentCardSkeleton
          key={index}
          featured={featured && index === 0}
          showImage={showImage}
          showAuthor={showAuthor}
        />
      ))}
    </div>
  )
})

ContentGridSkeleton.displayName = 'ContentGridSkeleton'

// List Item Skeleton
interface ListItemSkeletonProps {
  showAvatar?: boolean
  showSecondaryText?: boolean
  className?: string
}

const ListItemSkeleton = React.memo<ListItemSkeletonProps>(({ 
  showAvatar = false, 
  showSecondaryText = true,
  className 
}) => {
  return (
    <div className={cn("flex items-center space-x-3 p-4", className)}>
      {showAvatar && (
        <Skeleton className="w-10 h-10" variant="circular" />
      )}
      <div className="flex-1">
        <Skeleton className="w-3/4 h-4 mb-1" variant="text" />
        {showSecondaryText && (
          <Skeleton className="w-1/2 h-3" variant="text" />
        )}
      </div>
      <Skeleton className="w-6 h-6" variant="circular" />
    </div>
  )
})

ListItemSkeleton.displayName = 'ListItemSkeleton'

// Table Row Skeleton
interface TableRowSkeletonProps {
  columns?: number
  className?: string
}

const TableRowSkeleton = React.memo<TableRowSkeletonProps>(({ 
  columns = 4,
  className 
}) => {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton className="w-full h-4" variant="text" />
        </td>
      ))}
    </tr>
  )
})

TableRowSkeleton.displayName = 'TableRowSkeleton'

// Search Results Skeleton
const SearchResultsSkeleton = React.memo(() => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border-b border-gray-200 pb-4">
          <Skeleton className="w-3/4 h-5 mb-2" variant="text" />
          <Skeleton className="w-full h-4 mb-1" variant="text" />
          <Skeleton className="w-5/6 h-4 mb-2" variant="text" />
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-3" variant="text" />
            <Skeleton className="w-20 h-3" variant="text" />
            <Skeleton className="w-12 h-3" variant="text" />
          </div>
        </div>
      ))}
    </div>
  )
})

SearchResultsSkeleton.displayName = 'SearchResultsSkeleton'

// Form Skeleton
interface FormSkeletonProps {
  fields?: number
  showSubmitButton?: boolean
  className?: string
}

const FormSkeleton = React.memo<FormSkeletonProps>(({ 
  fields = 3, 
  showSubmitButton = true,
  className 
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index}>
          <Skeleton className="w-24 h-4 mb-2" variant="text" />
          <Skeleton className="w-full h-10" variant="rounded" />
        </div>
      ))}
      {showSubmitButton && (
        <Skeleton className="w-32 h-10 mt-6" variant="rounded" />
      )}
    </div>
  )
})

FormSkeleton.displayName = 'FormSkeleton'

export {
  Skeleton,
  ContentCardSkeleton,
  ContentGridSkeleton,
  ListItemSkeleton,
  TableRowSkeleton,
  SearchResultsSkeleton,
  FormSkeleton
}

export type {
  SkeletonProps,
  ContentCardSkeletonProps,
  ContentGridSkeletonProps,
  ListItemSkeletonProps,
  TableRowSkeletonProps,
  FormSkeletonProps
}
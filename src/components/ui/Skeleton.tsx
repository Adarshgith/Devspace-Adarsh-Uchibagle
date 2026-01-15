import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
      {...props}
    />
  )
}

// Specific skeleton components for common UI patterns
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-6 space-y-4', className)}>
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <SkeletonText lines={2} />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

export function SkeletonHeader({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white shadow-sm', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Skeleton className="w-32 h-8" />
          <div className="hidden lg:flex space-x-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-16 h-4" />
            ))}
          </div>
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-8 space-y-6', className)}>
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <SkeletonText lines={3} />
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

export function SkeletonBlogPost({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm overflow-hidden', className)}>
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-full" />
        <SkeletonText lines={3} />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonEvent({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-6 space-y-4', className)}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <SkeletonText lines={2} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function SkeletonForm({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-6 space-y-6', className)}>
      <Skeleton className="h-6 w-1/3" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm overflow-hidden', className)}>
      <div className="p-6">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonNavigation({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white border-b', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex space-x-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
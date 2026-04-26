import React from 'react'

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-slate-200/80 ${className ?? ''}`} />
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full rounded-md" />
      ))}
    </div>
  )
}

function SkeletonHeader() {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

function SkeletonBlogPost() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

function SkeletonEvent() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <div className="mt-5 flex flex-wrap gap-3">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  )
}

function SkeletonForm() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <Skeleton className="h-6 w-36" />
      <Skeleton className="mt-4 h-10 w-full" />
      <Skeleton className="mt-3 h-10 w-full" />
      <Skeleton className="mt-3 h-10 w-3/4" />
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-3 h-4 w-5/6" />
    </div>
  )
}

function SkeletonTable({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <Skeleton className="h-6 w-40" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-3">
            {Array.from({ length: cols }).map((__, colIndex) => (
              <Skeleton key={colIndex} className="h-10 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Blog page skeleton
export function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          
          {/* Featured Post */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-8 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <SkeletonText lines={3} />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonBlogPost key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Events page skeleton
export function EventsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
          
          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          
          {/* Events List */}
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonEvent key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// News page skeleton
export function NewsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            
            {/* News Articles */}
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex space-x-6">
                    <Skeleton className="h-24 w-32 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-full" />
                      <SkeletonText lines={2} />
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            
            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <Skeleton className="h-12 w-16 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Search page skeleton
export function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Header */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-12 w-full max-w-2xl mx-auto" />
          </div>
          
          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          {/* Search Results */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <SkeletonText lines={2} />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Forms demo page skeleton
export function FormsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-56 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          
          {/* Forms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonForm key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Article/Post detail skeleton
export function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Hero Image */}
            <Skeleton className="h-64 md:h-96 w-full" />
            
            {/* Article Content */}
            <div className="p-8 space-y-6">
              {/* Meta Info */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              
              {/* Title */}
              <Skeleton className="h-10 w-full" />
              
              {/* Author */}
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <SkeletonText lines={4} />
                <Skeleton className="h-48 w-full" />
                <SkeletonText lines={6} />
                <Skeleton className="h-32 w-full" />
                <SkeletonText lines={4} />
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-16" />
                ))}
              </div>
            </div>
          </article>
          
          {/* Related Articles */}
          <div className="mt-12 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-6" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
          
          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-64 w-full" />
            </div>
            <SkeletonTable rows={6} cols={3} />
          </div>
        </div>
      </div>
    </div>
  )
}
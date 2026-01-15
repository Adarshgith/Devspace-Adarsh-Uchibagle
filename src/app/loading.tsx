import { SkeletonCard, SkeletonHero } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section Skeleton */}
          <SkeletonHero />

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Legacy component - use PageSkeletons instead
export function PageLoading() {
  return <Loading />
}

// Compact loading component for smaller sections
export function CompactLoading() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  )
}

// Inline loading component
export function InlineLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}

// Button loading state
export function ButtonLoading() {
  return (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  )
}

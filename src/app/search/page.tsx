import { Suspense } from 'react'
import { Metadata } from 'next/metadata'
import SearchResults from '@/components/search/SearchResults'
import { getSiteSettings } from '@/lib/queries'
import { client } from '@/lib/sanity'

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: string
    page?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const siteSettings = await client.fetch(getSiteSettings)
  const query = searchParams.q || ''
  
  const title = query 
    ? `Search results for "${query}" | ${siteSettings?.title || 'Agency Website'}`
    : `Search | ${siteSettings?.title || 'Agency Website'}`
    
  const description = query
    ? `Search results for "${query}" across our blog posts, news articles, events, and pages.`
    : 'Search our website for blog posts, news articles, events, and pages.'
  
  return {
    title,
    description,
    robots: {
      index: false, // Don't index search result pages
      follow: true
    },
    openGraph: {
      title,
      description,
      type: 'website'
    }
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Search Results
            </h1>
            {searchParams.q && (
              <p className="mt-4 text-lg text-gray-600">
                Showing results for <span className="font-semibold">&ldquo;{searchParams.q}&rdquo;</span>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

// Loading skeleton for search results
function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search filters skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
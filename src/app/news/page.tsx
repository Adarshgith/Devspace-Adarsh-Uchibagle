import { Metadata } from 'next'
import { Suspense } from 'react'
import { Search, Filter, Calendar, Newspaper } from 'lucide-react'
import { client } from '@/lib/sanity'
import { allNewsQuery, newsCategoriesQuery } from '@/lib/queries'
import { News, Category } from '@/types/sanity'
import NewsCard, { NewsCardSkeleton } from '@/components/news/NewsCard'
import NewsFilters from '@/components/news/NewsFilters'
import NewsSearch from '@/components/news/NewsSearch'
import Pagination from '@/components/ui/Pagination'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'News',
  description: 'Stay updated with the latest news, announcements, and industry updates. Get insights into our company developments and market trends.',
  keywords: 'news, announcements, updates, industry news, company news, press releases',
}

interface NewsPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    sort?: string
  }>
}

interface NewsPageData {
  news: News[]
  categories: Category[]
  totalNews: number
}

const NEWS_PER_PAGE = 12

async function getNewsPageData(searchParams: NewsPageProps['searchParams']): Promise<NewsPageData> {
  try {
    const page = parseInt(searchParams.page || '1')
    const offset = (page - 1) * NEWS_PER_PAGE
    
    // Build query filters
    let filters = []
    
    if (searchParams.search) {
      filters.push(`title match "${searchParams.search}*" || excerpt match "${searchParams.search}*"`)
    }
    
    if (searchParams.category) {
      filters.push(`"${searchParams.category}" in categories[]->slug.current`)
    }
    
    const filterString = filters.length > 0 ? `[${filters.join(' && ')}]` : ''
    
    // Sort options
    const sortOptions = {
      'newest': 'publishDate desc',
      'oldest': 'publishDate asc',
      'title': 'title asc',
      'featured': 'featuredNews desc, publishDate desc'
    }
    
    const sortBy = sortOptions[searchParams.sort as keyof typeof sortOptions] || 'publishDate desc'
    
    // Build the complete query
    const newsQuery = `
      {
        "news": *[_type == "news"${filterString}] | order(${sortBy}) [${offset}...${offset + NEWS_PER_PAGE}] {
          _id,
          _createdAt,
          title,
          slug,
          excerpt,
          mainImage,
          publishDate,
          isSticky,
          featuredNews,
          categories[]-> {
            _id,
            title,
            slug,
            description
          },
          mainContent
        },
        "totalNews": count(*[_type == "news"${filterString}])
      }
    `
    
    const [newsData, categories] = await Promise.all([
      client.fetch(newsQuery),
      client.fetch(newsCategoriesQuery)
    ])
    
    return {
      news: newsData.news || [],
      categories: categories || [],
      totalNews: newsData.totalNews || 0
    }
  } catch (error) {
    console.error('Error fetching news page data:', error)
    return {
      news: [],
      categories: [],
      totalNews: 0
    }
  }
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const resolvedSearchParams = await searchParams
  const { news, categories, totalNews } = await getNewsPageData(resolvedSearchParams)
  
  const currentPage = parseInt(resolvedSearchParams.page || '1')
  const totalPages = Math.ceil(totalNews / NEWS_PER_PAGE)
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} className="mb-8" showHome={false} />
          
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Latest News
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Stay informed with our latest announcements, company updates, and industry insights. 
              Get the most recent news and developments from our organization.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 pt-8 border-t border-emerald-500/30">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-yellow-400">{totalNews}</div>
              <div className="text-emerald-200 text-sm">Total News Articles</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-yellow-400">{categories.length}</div>
              <div className="text-emerald-200 text-sm">News Categories</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse"></div>}>
                  <NewsSearch initialValue={resolvedSearchParams.search} />
                </Suspense>
              </div>
              
              {/* Filters */}
              <div className="lg:col-span-1">
                <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse"></div>}>
                  <NewsFilters 
                    categories={categories}
                    initialFilters={{
                      category: resolvedSearchParams.category,
                      sort: resolvedSearchParams.sort
                    }}
                  />
                </Suspense>
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-gray-600">
              {resolvedSearchParams.search || resolvedSearchParams.category ? (
                <span>
                  Showing {news.length} of {totalNews} results
                  {resolvedSearchParams.search && (
                    <span> for "{resolvedSearchParams.search}"</span>
                  )}
                  {resolvedSearchParams.category && (
                    <span> in category "{categories.find(c => c.slug.current === resolvedSearchParams.category)?.title}"</span>
                  )}
                </span>
              ) : (
                <span>Showing {news.length} of {totalNews} news articles</span>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
          
          {/* News Grid */}
          {news.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {news.map((newsItem, index) => (
                  <NewsCard 
                    key={newsItem._id} 
                    news={newsItem} 
                    featured={index === 0 && currentPage === 1}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/news"
                  searchParams={resolvedSearchParams}
                />
              )}
            </>
          ) : (
            /* No Results */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No news articles found
              </h3>
              <p className="text-gray-600 mb-6">
                {resolvedSearchParams.search || resolvedSearchParams.category
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No news articles have been published yet.'}
              </p>
              {(resolvedSearchParams.search || resolvedSearchParams.category) && (
                <a
                  href="/news"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                >
                  View All News
                </a>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Browse by Category
              </h2>
              <p className="text-xl text-gray-600">
                Explore news articles organized by different topics and categories.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <a
                  key={category._id}
                  href={`/news?category=${category.slug.current}`}
                  className="group bg-gray-50 rounded-xl p-6 hover:bg-emerald-50 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-200">
                      <Newspaper className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                      {category.title}
                    </h3>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// Loading component
export function NewsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 bg-white/20 rounded w-48 mb-8"></div>
          <div className="max-w-3xl">
            <div className="h-12 bg-white/20 rounded w-64 mb-6"></div>
            <div className="space-y-2">
              <div className="h-6 bg-white/20 rounded"></div>
              <div className="h-6 bg-white/20 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-10 bg-gray-200 rounded"></div>
              <div className="lg:col-span-1 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Results Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
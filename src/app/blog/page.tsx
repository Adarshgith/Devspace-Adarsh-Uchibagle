import { Metadata } from 'next'
import { Suspense } from 'react'
import { Search, Filter, Calendar, User } from 'lucide-react'
import { client } from '@/lib/sanity'
import { allBlogsQuery, blogCategoriesQuery, blogAuthorsQuery } from '@/lib/queries'
import { Blog, Category, BlogAuthor } from '@/types/sanity'
import BlogCard, { BlogCardSkeleton } from '@/components/blog/BlogCard'
import BlogFilters from '@/components/blog/BlogFilters'
import BlogSearch from '@/components/blog/BlogSearch'
import Pagination from '@/components/ui/Pagination'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Discover our latest insights, tutorials, and industry thoughts. Stay updated with the latest trends in web development, digital marketing, and technology.',
  keywords: 'blog, insights, tutorials, web development, digital marketing, technology, tips',
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    author?: string
    sort?: string
  }>
}

interface BlogPageData {
  blogs: Blog[]
  categories: Category[]
  authors: BlogAuthor[]
  totalBlogs: number
}

const BLOGS_PER_PAGE = 9

async function getBlogPageData(searchParams: Awaited<BlogPageProps['searchParams']>): Promise<BlogPageData> {
  try {
    const page = parseInt(searchParams.page || '1')
    const search = searchParams.search
    const category = searchParams.category
    const author = searchParams.author
    const offset = (page - 1) * BLOGS_PER_PAGE
    
    // Build query filters
    let filters = []
    
    if (search) {
      filters.push(`title match "${search}*" || excerpt match "${search}*"`)
    }
    
    if (category) {
      filters.push(`"${category}" in categories[]->slug.current`)
    }
    
    if (author) {
      filters.push(`blogsAuthor->slug.current == "${author}"`)
    }
    
    const filterString = filters.length > 0 ? `[${filters.join(' && ')}]` : ''
    
    // Sort options
    const sortOptions = {
      'newest': 'publishDate desc',
      'oldest': 'publishDate asc',
      'title': 'title asc',
      'featured': 'featuredBlog desc, publishDate desc'
    }
    
    const sortBy = sortOptions[searchParams.sort as keyof typeof sortOptions] || 'publishDate desc'
    
    // Build the complete query
    const blogsQuery = `
      {
        "blogs": *[_type == "blogs"${filterString}] | order(${sortBy}) [${offset}...${offset + BLOGS_PER_PAGE}] {
          _id,
          _createdAt,
          title,
          slug,
          excerpt,
          mainImage,
          publishDate,
          isSticky,
          featuredBlog,
          blogsAuthor-> {
            _id,
            name,
            slug,
            bio,
            image
          },
          mainContent
        },
        "totalBlogs": count(*[_type == "blogs"${filterString}])
      }
    `
    
    const [blogData, categories, authors] = await Promise.all([
      client.fetch(blogsQuery),
      client.fetch(blogCategoriesQuery),
      client.fetch(blogAuthorsQuery)
    ])
    
    return {
      blogs: blogData.blogs || [],
      categories: categories || [],
      authors: authors || [],
      totalBlogs: blogData.totalBlogs || 0
    }
  } catch (error) {
    console.error('Error fetching blog page data:', error)
    return {
      blogs: [],
      categories: [],
      authors: [],
      totalBlogs: 0
    }
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const { blogs, categories, authors, totalBlogs } = await getBlogPageData(resolvedSearchParams)
  
  const currentPage = parseInt(resolvedSearchParams.page || '1')
  const totalPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE)
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} className="mb-8" showHome={false} />
          
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Discover insights, tutorials, and industry thoughts from our team of experts. 
              Stay updated with the latest trends in web development, digital marketing, and technology.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-blue-500/30">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-yellow-400">{totalBlogs}</div>
              <div className="text-blue-200 text-sm">Total Articles</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-yellow-400">{categories.length}</div>
              <div className="text-blue-200 text-sm">Categories</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-yellow-400">{authors.length}</div>
              <div className="text-blue-200 text-sm">Authors</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse"></div>}>
                  <BlogSearch initialValue={resolvedSearchParams.search} />
                </Suspense>
              </div>
              
              {/* Filters */}
              <div className="lg:col-span-2">
                <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse"></div>}>
                  <BlogFilters 
                    categories={categories}
                    authors={authors}
                    initialFilters={{
                      category: resolvedSearchParams.category,
                      author: resolvedSearchParams.author,
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
              {resolvedSearchParams.search || resolvedSearchParams.category || resolvedSearchParams.author ? (
                <span>
                  Showing {blogs.length} of {totalBlogs} results
                  {resolvedSearchParams.search && (
                    <span> for "{resolvedSearchParams.search}"</span>
                  )}
                  {resolvedSearchParams.category && (
                    <span> in category "{categories.find(c => c.slug.current === resolvedSearchParams.category)?.title}"</span>
                  )}
                  {resolvedSearchParams.author && (
                    <span> by "{authors.find(a => a.slug.current === resolvedSearchParams.author)?.name}"</span>
                  )}
                </span>
              ) : (
                <span>Showing {blogs.length} of {totalBlogs} articles</span>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
          
          {/* Blog Grid */}
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogs.map((blog, index) => (
                  <BlogCard 
                    key={blog._id} 
                    blog={blog} 
                    featured={index === 0 && currentPage === 1}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/blog"
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
                No articles found
              </h3>
              <p className="text-gray-600 mb-6">
                {resolvedSearchParams.search || resolvedSearchParams.category || resolvedSearchParams.author
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No blog articles have been published yet.'}
              </p>
              {(resolvedSearchParams.search || resolvedSearchParams.category || resolvedSearchParams.author) && (
                <a
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  View All Articles
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
                Explore by Category
              </h2>
              <p className="text-xl text-gray-600">
                Discover articles organized by topics that interest you most.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <a
                  key={category._id}
                  href={`/blog?category=${category.slug.current}`}
                  className="group bg-gray-50 rounded-xl p-6 hover:bg-blue-50 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                      <Filter className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
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
export function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2 h-10 bg-gray-200 rounded"></div>
              <div className="lg:col-span-2 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Results Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
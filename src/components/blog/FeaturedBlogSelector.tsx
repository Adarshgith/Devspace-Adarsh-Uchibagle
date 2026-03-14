'use client'

import React, { useState, useEffect } from 'react'
import { Blog } from '@/types/sanity'
import { client } from '@/lib/sanity'
import BlogCard, { BlogCardSkeleton } from './BlogCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FeaturedBlogSelectorProps {
  moduleTitle: string
  blogIds: Array<{ _ref: string; _type: string }>
  layoutType: 'card' | 'slider'
}

const FeaturedBlogSelector: React.FC<FeaturedBlogSelectorProps> = ({
  moduleTitle,
  blogIds,
  layoutType,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true)
        console.log('🚀 Fetching blogs with IDs:', blogIds)

        if (!blogIds || blogIds.length === 0) {
          console.log('⚠️ No blog IDs provided')
          setBlogs([])
          setIsLoading(false)
          return
        }

        // Extract IDs and remove duplicates
        const ids = blogIds.map((blog) => blog._ref)
        const uniqueIds = [...new Set(ids)]

        console.log('📝 Unique IDs:', uniqueIds)

        // ✅ CORRECT WAY - Use Sanity parameters
        const query = `
          *[_type == "blogs" && _id in $ids] | order(publishDate desc) {
            _id,
            title,
            slug,
            excerpt,
            mainImage,
            publishDate,
            _createdAt,
            _updatedAt,
            mainContent,
            blogsAuthor->{
              _id,
              name,
              bio,
              image
            }
          }
        `

        // Pass IDs as parameters (Sanity handles encoding automatically)
        const fetchedBlogs = await client.fetch<Blog[]>(query, { ids: uniqueIds })

        console.log(`✅ Successfully fetched ${fetchedBlogs.length} blogs`)
        setBlogs(fetchedBlogs || [])
        setError(null)
      } catch (err) {
        console.error('❌ Error fetching featured blogs:', err)
        setError('Failed to load featured blogs: ' + (err instanceof Error ? err.message : 'Unknown error'))
        setBlogs([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchBlogs()
  }, [blogIds])

  // Handle slider navigation
  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? blogs.length - 1 : prev - 1))
  }

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === blogs.length - 1 ? 0 : prev + 1))
  }

  // Keyboard navigation for slider
  useEffect(() => {
    if (layoutType !== 'slider' || blogs.length <= 1) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevSlide()
      if (e.key === 'ArrowRight') handleNextSlide()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [layoutType, blogs.length])

  if (isLoading) {
    return (
      <div className="w-full py-12">
        {moduleTitle && (
          <h2 className="mb-8 text-4xl font-semibold text-gray-900 lg:text-5xl">
            {moduleTitle}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <BlogCardSkeleton key={i} featured={false} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-12">
        {moduleTitle && (
          <h2 className="mb-8 text-4xl font-semibold text-gray-900 lg:text-5xl">
            {moduleTitle}
          </h2>
        )}
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-red-900">
            Unable to load blogs
          </h3>
          <p className="text-sm text-red-800">{error}</p>
          <p className="mt-2 text-xs text-red-600">
            Check the browser console for detailed error information.
          </p>
        </div>
      </div>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="w-full py-12">
        {moduleTitle && (
          <h2 className="mb-8 text-4xl font-semibold text-gray-900 lg:text-5xl">
            {moduleTitle}
          </h2>
        )}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-600">No blogs selected for this section.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-12">
      {/* Module Title */}
      {moduleTitle && (
        <h2 className="mb-8 text-4xl font-semibold text-gray-900 lg:text-5xl">
          {moduleTitle}
        </h2>
      )}

      {/* Card Layout */}
      {layoutType === 'card' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} featured={false} />
          ))}
        </div>
      )}

      {/* Slider Layout */}
      {layoutType === 'slider' && (
        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlideIndex * 100}%)`,
              }}
            >
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="w-full flex-shrink-0"
                >
                  <div className="px-4 py-8 md:px-8">
                    <BlogCard blog={blog} featured={true} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          {blogs.length > 1 && (
            <>
              <button
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handlePrevSlide}
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </button>
              <button
                aria-label="Next slide"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleNextSlide}
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </button>

              {/* Slide Indicators */}
              <div className="mt-4 flex justify-center gap-2">
                {blogs.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      index === currentSlideIndex 
                        ? 'w-8 bg-blue-600' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => setCurrentSlideIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default FeaturedBlogSelector
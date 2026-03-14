import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import PortableTextRenderer from './PortableTextRenderer'

interface Blog {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  content?: any[]
  mainImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  publishedAt?: string
  author?: {
    name: string
    image?: {
      asset: {
        _id: string
        url: string
      }
    }
  }
  categories?: Array<{
    title: string
    slug: {
      current: string
    }
  }>
}

interface BlogsListingProps {
  sectionTitle?: string
  sectionDescription?: any[]
  selectedBlogs: Blog[]
  layout?: 'grid' | 'list'
  showExcerpt?: boolean
  showAuthor?: boolean
  showDate?: boolean
  showCategories?: boolean
  numberOfBlogs?: number
  CTA?: Array<{
    buttonText?: string
    buttonLink?: string
    buttonStyle?: string
    openInNewTab?: boolean
  }>
}

export default function BlogsListing({
  sectionTitle,
  sectionDescription,
  selectedBlogs,
  layout = 'grid',
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showCategories = true,
  numberOfBlogs,
  CTA
}: BlogsListingProps) {
  
  // Debug logging - Remove this after debugging
  console.log('BlogsListing Debug:', {
    sectionTitle,
    selectedBlogs,
    selectedBlogsType: typeof selectedBlogs,
    isArray: Array.isArray(selectedBlogs),
    blogsCount: selectedBlogs?.length,
    firstBlog: selectedBlogs?.[0]
  })
  
  // Ensure selectedBlogs is an array
  const blogsArray = Array.isArray(selectedBlogs) ? selectedBlogs : []
  
  // Limit blogs if numberOfBlogs is specified
  const blogsToDisplay = numberOfBlogs 
    ? blogsArray.slice(0, numberOfBlogs)
    : blogsArray
  
  console.log('Blogs to display:', blogsToDisplay.length)

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {(sectionTitle || sectionDescription) && (
          <div className="text-center mb-12">
            {sectionTitle && (
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {sectionTitle}
              </h2>
            )}
            
            {sectionDescription && (
              <div className="prose prose-lg mx-auto max-w-3xl text-gray-600">
                <PortableTextRenderer content={sectionDescription} />
              </div>
            )}
          </div>
        )}

        {/* Blogs Grid/List */}
        <div className={`
          ${layout === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-8 max-w-4xl mx-auto'
          }
        `}>
          {blogsToDisplay.map((blog) => {
            // Skip blog if slug is missing
            if (!blog?.slug?.current) {
              console.warn('Blog missing slug:', blog)
              return null
            }

            return (
              <article 
                key={blog._id}
                className={`
                  bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300
                  ${layout === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col'}
                `}
              >
                {/* Blog Image */}
                {blog.mainImage && (
                  <Link 
                    href={`/blog/${blog.slug.current}`}
                    className={`
                      relative overflow-hidden
                      ${layout === 'list' ? 'md:w-1/3 h-64 md:h-auto' : 'w-full h-64'}
                    `}
                  >
                    <Image
                      src={urlFor(blog.mainImage).width(800).height(600).url()}
                      alt={blog.mainImage.alt || blog.title || 'Blog image'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                )}

                {/* Blog Content */}
                <div className={`
                  p-6 flex flex-col flex-1
                  ${layout === 'list' ? 'md:w-2/3' : ''}
                `}>
                  {/* Categories */}
                  {showCategories && blog.categories && blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.categories.map((category, index) => (
                        category?.slug?.current ? (
                          <Link
                            key={index}
                            href={`/blog/category/${category.slug.current}`}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full"
                          >
                            {category.title}
                          </Link>
                        ) : (
                          <span
                            key={index}
                            className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                          >
                            {category.title}
                          </span>
                        )
                      ))}
                    </div>
                  )}

                  {/* Blog Title */}
                  <Link href={`/blog/${blog.slug.current}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>

                  {/* Blog Excerpt */}
                  {showExcerpt && blog.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {/* Author */}
                      {showAuthor && blog.author && (
                        <div className="flex items-center space-x-2">
                          {blog.author.image && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={urlFor(blog.author.image).width(40).height(40).url()}
                                alt={blog.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium text-gray-700">
                            {blog.author.name}
                          </span>
                        </div>
                      )}

                      {/* Published Date */}
                      {showDate && blog.publishedAt && (
                        <time className="text-gray-500">
                          {formatDate(blog.publishedAt)}
                        </time>
                      )}
                    </div>
                  </div>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${blog.slug.current}`}
                    className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Read More
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {/* Empty State */}
        {blogsToDisplay.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No blogs found. Check back soon for new content!
            </p>
          </div>
        )}

        {/* CTA Button */}
        {CTA && CTA.length > 0 && CTA[0].buttonText && (
          <div className="mt-12 text-center">
            {CTA[0].buttonLink ? (
              <Link
                href={CTA[0].buttonLink}
                target={CTA[0].openInNewTab ? '_blank' : '_self'}
                rel={CTA[0].openInNewTab ? 'noopener noreferrer' : undefined}
                className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 ${
                  CTA[0].buttonStyle === 'secondary'
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {CTA[0].buttonText}
              </Link>
            ) : (
              <button
                className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 ${
                  CTA[0].buttonStyle === 'secondary'
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {CTA[0].buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
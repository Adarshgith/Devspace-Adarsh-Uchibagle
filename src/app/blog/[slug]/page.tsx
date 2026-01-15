import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Calendar, Clock, User, Share2, Tag, ArrowLeft } from 'lucide-react'
import { client } from '@/lib/sanity'
import { blogBySlugQuery, featuredBlogsQuery } from '@/lib/queries'
import { Blog } from '@/types/sanity'
import { formatDate, getReadingTime, generateMetaDescription } from '@/lib/utils'
import { urlFor } from '@/lib/sanity'
import BlogCard from '@/components/blog/BlogCard'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SocialShare from '@/components/ui/SocialShare'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import Image from 'next/image'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

interface BlogPostData {
  blog: Blog | null
  relatedBlogs: Blog[]
}

async function getBlogPostData(slug: string): Promise<BlogPostData> {
  try {
    const [blog, relatedBlogs] = await Promise.all([
      client.fetch(blogBySlugQuery, { slug }),
      client.fetch(featuredBlogsQuery, { slug, limit: 3 })
    ])
    
    return {
      blog: blog || null,
      relatedBlogs: relatedBlogs || []
    }
  } catch (error) {
    console.error('Error fetching blog post data:', error)
    return {
      blog: null,
      relatedBlogs: []
    }
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { blog } = await getBlogPostData(resolvedParams.slug)
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }
  
  const metaDescription = blog.seo?.metaDescription || 
    generateMetaDescription(blog.excerpt || '', 160)
  
  const imageUrl = blog.mainImage 
    ? urlFor(blog.mainImage).width(1200).height(630).url()
    : undefined
  
  return {
    title: blog.seo?.metaTitle || blog.title,
    description: metaDescription,
    keywords: blog.seo?.metaKeywords,
    authors: blog.blogsAuthor ? [{ name: blog.blogsAuthor.name }] : undefined,
    publishedTime: blog.publishDate,
    modifiedTime: blog._updatedAt,
    openGraph: {
      title: blog.seo?.metaTitle || blog.title,
      description: metaDescription,
      type: 'article',
      publishedTime: blog.publishDate,
      modifiedTime: blog._updatedAt,
      authors: blog.blogsAuthor ? [blog.blogsAuthor.name] : undefined,
      tags: blog.categories?.map(cat => cat.title) || undefined,
      ...(imageUrl && {
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.mainImage?.alt || blog.title
        }]
      })
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seo?.metaTitle || blog.title,
      description: metaDescription,
      ...(imageUrl && {
        images: [imageUrl]
      })
    },
    alternates: {
      canonical: `/blog/${blog.slug.current}`
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const { blog, relatedBlogs } = await getBlogPostData(resolvedParams.slug)
  
  if (!blog) {
    notFound()
  }
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: blog.title }
  ]
  
  const readingTime = getReadingTime(blog.mainContent)
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug.current}`
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': blog.title,
            'description': blog.excerpt,
            'image': blog.mainImage ? urlFor(blog.mainImage).width(1200).height(630).url() : undefined,
            'author': blog.blogsAuthor ? {
              '@type': 'Person',
              'name': blog.blogsAuthor.name,
              'url': `/blog/author/${blog.blogsAuthor.slug.current}`
            } : undefined,
            'publisher': {
              '@type': 'Organization',
              'name': process.env.NEXT_PUBLIC_SITE_NAME || 'Website',
              'url': process.env.NEXT_PUBLIC_SITE_URL
            },
            'datePublished': blog.publishDate,
            'dateModified': blog._updatedAt,
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': shareUrl
            },
            'keywords': blog.categories?.map(cat => cat.title).join(', ') || undefined
          })
        }}
      />
      
      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white py-16 lg:py-24">
          {/* Background Image */}
          {blog.mainImage && (
            <div className="absolute inset-0">
              <Image
                src={urlFor(blog.mainImage).width(1920).height(1080).url()}
                alt={blog.mainImage.alt || blog.title}
                fill
                className="object-cover opacity-30"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            </div>
          )}
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbs} className="mb-8 text-white/80" showHome={false} />
            
            {/* Back Button */}
            <a
              href="/blog"
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </a>
            
            <div className="max-w-4xl">
              {/* Categories */}
              {blog.categories && blog.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.categories.map((category) => (
                    <a
                      key={category._id}
                      href={`/blog?category=${category.slug.current}`}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {category.title}
                    </a>
                  ))}
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                {blog.title}
              </h1>
              
              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8">
                  {blog.excerpt}
                </p>
              )}
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                {/* Author */}
                {blog.blogsAuthor && (
                  <div className="flex items-center space-x-3">
                    {blog.blogsAuthor.image && (
                      <Image
                        src={urlFor(blog.blogsAuthor.image).width(40).height(40).url()}
                        alt={blog.blogsAuthor.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{blog.blogsAuthor.name}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Publish Date */}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.publishDate)}</span>
                </div>
                
                {/* Reading Time */}
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Article Content */}
                <div className="lg:col-span-3">
                  <div className="prose prose-lg max-w-none">
                    <Suspense fallback={<ContentSkeleton />}>
                      <PortableTextRenderer content={blog.mainContent} />
                    </Suspense>
                  </div>
                  
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <a
                            key={tag._id}
                            href={`/blog?tag=${tag.slug.current}`}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Author Bio */}
                  {blog.blogsAuthor && blog.blogsAuthor.bio && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          {blog.blogsAuthor.image && (
                            <Image
                              src={urlFor(blog.blogsAuthor.image).width(80).height(80).url()}
                              alt={blog.blogsAuthor.name}
                              width={80}
                              height={80}
                              className="rounded-full flex-shrink-0"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              About {blog.blogsAuthor.name}
                            </h3>
                            <div className="prose prose-sm text-gray-600">
                              <PortableTextRenderer content={blog.blogsAuthor.bio} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-8">
                    {/* Social Share */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Article
                      </h3>
                      <SocialShare 
                        url={shareUrl}
                        title={blog.title}
                        description={blog.excerpt}
                      />
                    </div>
                    
                    {/* Table of Contents (if needed) */}
                    {/* This can be implemented based on the content structure */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Related Articles
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedBlogs.map((relatedBlog) => (
                    <BlogCard key={relatedBlog._id} blog={relatedBlog} />
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <a
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    View All Articles
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  )
}

// Content Loading Skeleton
function ContentSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      ))}
    </div>
  )
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const blogs = await client.fetch(`
      *[_type == "blogs" && defined(slug.current)] {
        "slug": slug.current
      }
    `)
    
    return blogs.map((blog: { slug: string }) => ({
      slug: blog.slug
    }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return []
  }
}
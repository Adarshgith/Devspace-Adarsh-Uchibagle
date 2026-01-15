import React from 'react'
import { Blog } from '@/types/sanity'
import ContentCard from '@/components/ui/ContentCard'
import { ContentCardSkeleton } from '@/components/ui/SkeletonLoader'

interface BlogCardProps {
  blog: Blog
  featured?: boolean
  showAuthor?: boolean
  className?: string
}

const BlogCard = React.memo<BlogCardProps>(({ 
  blog, 
  featured = false, 
  showAuthor = false,
  className 
}) => {
  // Transform Blog type to ContentCard's expected format
  const transformedBlog = {
    ...blog,
    _type: 'blogs' as const,
    blogsAuthor: blog.blogsAuthor ? {
      name: blog.blogsAuthor.name,
      bio: blog.blogsAuthor.bio,
      image: blog.blogsAuthor.image
    } : undefined
  }

  return (
    <ContentCard
      content={transformedBlog}
      type="blog"
      featured={featured}
      showAuthor={showAuthor}
      className={className}
    />
  )
})

BlogCard.displayName = 'BlogCard'

// Loading skeleton component
export function BlogCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <ContentCardSkeleton 
      featured={featured}
      showAuthor={featured}
    />
  )
}

export default BlogCard
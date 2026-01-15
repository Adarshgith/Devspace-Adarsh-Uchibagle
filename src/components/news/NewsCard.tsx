import React from 'react'
import { News } from '@/types/sanity'
import ContentCard from '@/components/ui/ContentCard'
import { ContentCardSkeleton } from '@/components/ui/SkeletonLoader'

interface NewsCardProps {
  news: News
  featured?: boolean
  showCategory?: boolean
  className?: string
}

const NewsCard = React.memo<NewsCardProps>(({ 
  news, 
  featured = false, 
  showCategory = true,
  className 
}) => {
  // Transform News type to ContentCard's expected format
  const transformedNews = {
    ...news,
    _type: 'news' as const,
    publishDate: news._createdAt,
    category: news.category ? {
      title: news.category.title,
      description: news.category.description
    } : undefined
  }

  return (
    <ContentCard
      content={transformedNews}
      type="news"
      featured={featured}
      showCategory={showCategory}
      className={className}
    />
  )
})

NewsCard.displayName = 'NewsCard'

// Loading skeleton component
export function NewsCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <ContentCardSkeleton 
      featured={featured}
      showCategory={true}
    />
  )
}

export default NewsCard
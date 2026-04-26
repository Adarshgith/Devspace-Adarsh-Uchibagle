import React from 'react'
import Link from 'next/link'
import { Blog } from '@/types/sanity'

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
  return (
    <article className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg ${featured ? 'lg:col-span-2' : ''} ${className ?? ''}`}>
      <Link href={`/blog/${blog.slug.current}`} className="block">
        {blog.mainImage?.asset && (
          <div className="h-64 w-full overflow-hidden bg-slate-100" />
        )}

        <div className="p-6">
          {featured && (
            <span className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Featured
            </span>
          )}

          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{blog.title}</h2>
          {blog.excerpt && (
            <p className="mt-3 text-sm leading-6 text-slate-600">{blog.excerpt}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
            {showAuthor && <span>By the author team</span>}
          </div>
        </div>
      </Link>
    </article>
  )
})

BlogCard.displayName = 'BlogCard'

export function BlogCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <article className={`animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white ${featured ? 'lg:col-span-2' : ''}`}>
      <div className="h-64 w-full bg-slate-200" />
      <div className="p-6 space-y-4">
        <div className="h-5 w-3/4 rounded-md bg-slate-200" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded-md bg-slate-200" />
          <div className="h-4 w-5/6 rounded-md bg-slate-200" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-4 w-24 rounded-md bg-slate-200" />
          {featured && <div className="h-4 w-32 rounded-md bg-slate-200" />}
        </div>
      </div>
    </article>
  )
}

export default BlogCard
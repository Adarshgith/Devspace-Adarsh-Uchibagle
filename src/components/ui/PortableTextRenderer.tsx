'use client'

import { urlFor } from '@/lib/sanity'
import { cn } from '@/lib/utils'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import Link from 'next/link'

interface PortableTextRendererProps {
  content: any[]
  className?: string
}

// Custom components for rendering different block types
const components: PortableTextComponents = {
  // Block-level elements
  block: {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-gray-900 mb-5 mt-8 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-gray-900 mb-3 mt-5 first:mt-0">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-bold text-gray-900 mb-3 mt-4 first:mt-0">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-bold text-gray-900 mb-2 mt-4 first:mt-0">
        {children}
      </h6>
    ),

    // Paragraphs
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">
        {children}
      </p>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-blue-50 rounded-r-lg">
        <div className="text-gray-700 italic text-lg">
          {children}
        </div>
      </blockquote>
    )
  },

  // List elements
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">
        {children}
      </ol>
    )
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="text-gray-700 leading-relaxed">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-gray-700 leading-relaxed">
        {children}
      </li>
    )
  },

  // Inline elements
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic">
        {children}
      </em>
    ),
    underline: ({ children }) => (
      <span className="underline">
        {children}
      </span>
    ),
    'strike-through': ({ children }) => (
      <span className="line-through">
        {children}
      </span>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith('http') || value?.href?.startsWith('mailto:')

      if (isExternal) {
        return (
          <a
            href={value?.href}
            target={value?.blank ? '_blank' : '_self'}
            rel={value?.blank ? 'noopener noreferrer' : undefined}
            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
          >
            {children}
          </a>
        )
      }

      return (
        <Link
          href={value?.href || '#'}
          className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
        >
          {children}
        </Link>
      )
    }
  },

  // Custom types
  types: {
    // Image blocks
    image: ({ value }) => {
      if (!value?.asset) return null

      return (
        <figure className="my-8">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={urlFor(value as SanityImageSource).width(800).height(600).url()}
              alt={value.alt || 'Image'}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              unoptimized
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-gray-600 text-center mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // Code blocks
    code: ({ value }) => (
      <div className="my-6">
        <div className="bg-gray-900 rounded-t-lg px-4 py-2 flex items-center justify-between">
          <span className="text-gray-300 text-sm font-medium">
            {value.language || 'Code'}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(value.code)}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded transition-colors duration-200"
          >
            Copy
          </button>
        </div>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
          <code className="text-sm font-mono">
            {value.code}
          </code>
        </pre>
      </div>
    ),

    // Video embeds
    video: ({ value }) => {
      if (!value?.url) return null

      return (
        <div className="my-8">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={value.url}
              title={value.title || 'Video'}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              loading="lazy"
            />
          </div>
          {value.caption && (
            <p className="text-sm text-gray-600 text-center mt-3 italic">
              {value.caption}
            </p>
          )}
        </div>
      )
    },

    // Call-to-action blocks
    callToAction: ({ value }) => (
      <div className="my-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
        {value.title && (
          <h3 className="text-2xl font-bold mb-4">
            {value.title}
          </h3>
        )}
        {value.description && (
          <p className="text-blue-100 mb-6 text-lg">
            {value.description}
          </p>
        )}
        {value.buttonText && value.buttonUrl && (
          <Link
            href={value.buttonUrl}
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
            target={value.newTab ? '_blank' : '_self'}
            rel={value.newTab ? 'noopener noreferrer' : undefined}
          >
            {value.buttonText}
          </Link>
        )}
      </div>
    ),

    // Alert/Notice blocks
    alert: ({ value }) => {
      const alertStyles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800'
      }

      const alertStyle = alertStyles[value.type as keyof typeof alertStyles] || alertStyles.info

      return (
        <div className={cn('border-l-4 p-4 my-6 rounded-r-lg', alertStyle)}>
          {value.title && (
            <h4 className="font-semibold mb-2">
              {value.title}
            </h4>
          )}
          {value.message && (
            <p className="leading-relaxed">
              {value.message}
            </p>
          )}
        </div>
      )
    },

    // Table blocks
    table: ({ value }) => {
      if (!value?.rows || value.rows.length === 0) return null

      return (
        <div className="my-8 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            {value.rows.map((row: { cells?: string[] }, rowIndex: number) => (
              <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50' : 'bg-white'}>
                {row.cells?.map((cell: string, cellIndex: number) => {
                  const Tag = rowIndex === 0 ? 'th' : 'td'
                  return (
                    <Tag
                      key={cellIndex}
                      className={cn(
                        'px-4 py-3 border-b border-gray-200 text-left',
                        rowIndex === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'
                      )}
                    >
                      {cell}
                    </Tag>
                  )
                })}
              </tr>
            ))}
          </table>
        </div>
      )
    }
  }
}

export default function PortableTextRenderer({ content, className }: PortableTextRendererProps) {
  if (!content || !Array.isArray(content)) {
    return null
  }

  return (
    <div className={cn('prose prose-lg max-w-none', className)}>
      <PortableText
        value={content}
        components={components}
      />
    </div>
  )
}

// Simplified renderer for excerpts or short content
export function SimplePortableTextRenderer({ content, className }: PortableTextRendererProps) {
  if (!content || !Array.isArray(content)) {
    return null
  }

  const simpleComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-gray-700 leading-relaxed">
          {children}
        </p>
      )
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold">
          {children}
        </strong>
      ),
      em: ({ children }) => (
        <em className="italic">
          {children}
        </em>
      )
    }
  }

  return (
    <div className={className}>
      <PortableText
        value={content}
        components={simpleComponents}
      />
    </div>
  )
}

// Plain text renderer (for meta descriptions, etc.)
export function PlainTextRenderer({ content }: { content: unknown[] }) {
  if (!content || !Array.isArray(content)) {
    return ''
  }

  return content
    .filter((block: any) => block._type === 'block')
    .map((block: any) =>
      block.children
        ?.filter((child: { _type: string }) => child._type === 'span')
        .map((span: { text: string }) => span.text)
        .join('')
    )
    .join(' ')
}

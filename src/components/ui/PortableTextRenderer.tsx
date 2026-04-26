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

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem', marginTop: '2rem', lineHeight: '1.2' }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.25rem', marginTop: '2rem', lineHeight: '1.3' }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem', marginTop: '1.5rem', lineHeight: '1.4' }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.75rem', marginTop: '1.25rem', lineHeight: '1.4' }}>
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.75rem', marginTop: '1rem', lineHeight: '1.5' }}>
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem', marginTop: '1rem', lineHeight: '1.5' }}>
        {children}
      </h6>
    ),
    normal: ({ children }) => (
      <p style={{ color: '#9ca3af', lineHeight: '1.75', marginBottom: '1rem', textAlign: 'left' }}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', margin: '1.5rem 0', backgroundColor: '#1e3a5f', borderRadius: '0 0.5rem 0.5rem 0' }}>
        <div style={{ color: '#93c5fd', fontStyle: 'italic', fontSize: '1.125rem' }}>
          {children}
        </div>
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li style={{ color: '#9ca3af', lineHeight: '1.75' }}>
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li style={{ color: '#9ca3af', lineHeight: '1.75' }}>
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong style={{ fontWeight: '600', color: '#ffffff' }}>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em style={{ fontStyle: 'italic' }}>
        {children}
      </em>
    ),
    underline: ({ children }) => (
      <span style={{ textDecoration: 'underline' }}>
        {children}
      </span>
    ),
    'strike-through': ({ children }) => (
      <span style={{ textDecoration: 'line-through' }}>
        {children}
      </span>
    ),
    code: ({ children }) => (
      <code style={{ backgroundColor: '#1f2937', color: '#e5e7eb', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>
        {children}
      </code>
    ),
    left: ({ children }) => (
      <span style={{ display: 'block', textAlign: 'left' }}>
        {children}
      </span>
    ),
    center: ({ children }) => (
      <span style={{ display: 'block', textAlign: 'center' }}>
        {children}
      </span>
    ),
  right: ({ children }) => (
    <span style={{ display: 'block', textAlign: 'right' }}>
      {children}
    </span>
  ),
  link: ({ children, value }) => {
    const href = value && value.href ? value.href : '#'
    const isExternal = href.startsWith('http') || href.startsWith('mailto:')
    const isBlank = value && value.blank ? true : false

    if (isExternal) {
      return (
        <a
          href={href}
          target={isBlank ? '_blank' : '_self'}
          rel={isBlank ? 'noopener noreferrer' : undefined}
          style={{ color: '#60a5fa', textDecoration: 'underline' }}
        >
          {children}
        </a>
      )
    }
    return (
      <Link
        href={href}
        style={{ color: '#60a5fa', textDecoration: 'underline' }}
      >
        {children}
      </Link>
    )
  },
},

types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure style={{ margin: '2rem 0' }}>
          <div style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#1f2937' }}>
            <Image
              src={urlFor(value as SanityImageSource).width(800).height(600).url()}
              alt={value.alt || 'Image'}
              width={800}
              height={600}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              unoptimized
            />
          </div>
          {value.caption && (
            <figcaption style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', marginTop: '0.75rem', fontStyle: 'italic' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    code: ({ value }) => (
      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ backgroundColor: '#111827', borderRadius: '0.5rem 0.5rem 0 0', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500' }}>
            {value.language || 'Code'}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(value.code)}
            style={{ color: '#9ca3af', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Copy
          </button>
        </div>
        <pre style={{ backgroundColor: '#1f2937', color: '#f3f4f6', padding: '1rem', borderRadius: '0 0 0.5rem 0.5rem', overflowX: 'auto' }}>
          <code style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
            {value.code}
          </code>
        </pre>
      </div>
    ),

    video: ({ value }) => {
      if (!value?.url) return null
      return (
        <div style={{ margin: '2rem 0' }}>
          <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#1f2937' }}>
            <iframe
              src={value.url}
              title={value.title || 'Video'}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              allowFullScreen
              loading="lazy"
            />
          </div>
          {value.caption && (
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', marginTop: '0.75rem', fontStyle: 'italic' }}>
              {value.caption}
            </p>
          )}
        </div>
      )
    },

    callToAction: ({ value }) => (
      <div style={{ margin: '2rem 0', background: 'linear-gradient(to right, #2563eb, #4338ca)', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
        {value.title && (
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem' }}>
            {value.title}
          </h3>
        )}
        {value.description && (
          <p style={{ color: '#bfdbfe', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
            {value.description}
          </p>
        )}
        {value.buttonText && value.buttonUrl && (
          <Link
            href={value.buttonUrl}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem', backgroundColor: '#ffffff', color: '#2563eb', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none' }}
            target={value.newTab ? '_blank' : '_self'}
            rel={value.newTab ? 'noopener noreferrer' : undefined}
          >
            {value.buttonText}
          </Link>
        )}
      </div>
    ),

    alert: ({ value }) => {
      const alertStyles: Record<string, { border: string; background: string; color: string }> = {
        info:    { border: '#3b82f6', background: '#1e3a5f', color: '#93c5fd' },
        warning: { border: '#f59e0b', background: '#451a03', color: '#fcd34d' },
        error:   { border: '#ef4444', background: '#450a0a', color: '#fca5a5' },
        success: { border: '#22c55e', background: '#052e16', color: '#86efac' },
      }
      const s = alertStyles[value.type] || alertStyles.info
      return (
        <div style={{ borderLeft: `4px solid ${s.border}`, padding: '1rem', margin: '1.5rem 0', borderRadius: '0 0.5rem 0.5rem 0', backgroundColor: s.background }}>
          {value.title && (
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: s.color }}>
              {value.title}
            </h4>
          )}
          {value.message && (
            <p style={{ lineHeight: '1.75', color: s.color }}>
              {value.message}
            </p>
          )}
        </div>
      )
    },

    table: ({ value }) => {
      if (!value?.rows || value.rows.length === 0) return null
      return (
        <div style={{ margin: '2rem 0', overflowX: 'auto' }}>
          <table style={{ minWidth: '100%', border: '1px solid #374151', borderRadius: '0.5rem', overflow: 'hidden', borderCollapse: 'collapse' }}>
            {value.rows.map((row: { cells?: string[] }, rowIndex: number) => (
              <tr key={rowIndex} style={{ backgroundColor: rowIndex === 0 ? '#1f2937' : '#111827' }}>
                {row.cells?.map((cell: string, cellIndex: number) => {
                  const Tag = rowIndex === 0 ? 'th' : 'td'
                  return (
                    <Tag
                      key={cellIndex}
                      style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #374151', textAlign: 'left', color: rowIndex === 0 ? '#ffffff' : '#d1d5db', fontWeight: rowIndex === 0 ? '600' : '400' }}
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
    },
  },
}

export default function PortableTextRenderer({ content, className }: PortableTextRendererProps) {
  if (!content || !Array.isArray(content)) return null

  return (
    <div className={cn('max-w-none', className)}>
      <PortableText value={content} components={components} />
    </div>
  )
}

export function SimplePortableTextRenderer({ content, className }: PortableTextRendererProps) {
  if (!content || !Array.isArray(content)) return null

  const simpleComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p style={{ color: '#374151', lineHeight: '1.75' }}>
          {children}
        </p>
      ),
    },
    marks: {
      strong: ({ children }) => <strong style={{ fontWeight: '600' }}>{children}</strong>,
      em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    },
  }

  return (
    <div className={className}>
      <PortableText value={content} components={simpleComponents} />
    </div>
  )
}

export function PlainTextRenderer({ content }: { content: unknown[] }) {
  if (!content || !Array.isArray(content)) return ''

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
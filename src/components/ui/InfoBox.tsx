import { urlFor } from '@/lib/sanity'
import Link from 'next/link'
import PortableTextRenderer from './PortableTextRenderer'

interface InfoBoxProps {
  title?: string
  image?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  imagePosition?: 'top' | 'bottom' | 'left' | 'right'
  video?: string
  textSectionPadding?: string
  sectionTitle?: string
  content?: any[]
  button?: {
    buttonText?: string
    buttonLink?: string
    buttonStyle?: string
    openInNewTab?: boolean
  }
}

export default function InfoBox({
  title,
  image,
  imagePosition = 'top',
  video,
  textSectionPadding,
  sectionTitle,
  content,
  button
}: InfoBoxProps) {

  const imageUrl = image
    ? (image.asset?.url || urlFor(image).width(600).height(400).url())
    : ''

  const renderMedia = () => {
    if (video) {
      return (
        <div className="w-full">
          <iframe
            src={video}
            title={title || 'Video'}
            className="w-full h-[240px] sm:h-[280px] rounded-xl border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    if (image && imageUrl) {
      return (
        <div className="relative w-full">
          {/* Decorative background blob */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-[#00BCD4]/10 rounded-[2rem] blur-2xl scale-95 pointer-events-none" />

          {/* Decorative border ring */}
          <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/30 via-transparent to-[#00BCD4]/30 rounded-[2rem] pointer-events-none" />

          {/* Main image */}
          <div className="relative z-10 rounded-[1.75rem] overflow-hidden border border-white/10">
            <img
              src={imageUrl}
              alt={image.alt || title || 'InfoBox image'}
              className="w-full h-auto object-contain block"
            />
            {/* Subtle overlay gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0a1a]/60 to-transparent pointer-events-none" />
          </div>
        </div>
      )
    }

    return null
  }

  const renderContent = () => (
    <div className={textSectionPadding ? `p-${textSectionPadding}` : ''}>
      {sectionTitle && (
        <h3 className="text-2xl font-bold text-white mb-4">
          {sectionTitle}
        </h3>
      )}
      {title && !sectionTitle && (
        <h3 className="text-xl font-semibold text-white mb-4">
          {title}
        </h3>
      )}
      {content && (
        <div className="mb-4">
          <PortableTextRenderer content={content} />
        </div>
      )}
      {button && button.buttonText && (
        <div className="mt-6">
          {button.buttonLink ? (
            <Link
              href={button.buttonLink}
              target={button.openInNewTab ? '_blank' : '_self'}
              rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                button.buttonStyle === 'secondary'
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {button.buttonText}
            </Link>
          ) : (
            <button
              className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                button.buttonStyle === 'secondary'
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {button.buttonText}
            </button>
          )}
        </div>
      )}
    </div>
  )

  const mediaComponent = renderMedia()
  const isHorizontal = imagePosition === 'left' || imagePosition === 'right'

  // ── Vertical layouts (top / bottom) ──────────────────────────────
  if (!isHorizontal) {
    return (
      <div className="w-full flex flex-col gap-4">
        {imagePosition === 'bottom' ? (
          <>
            {renderContent()}
            {mediaComponent}
          </>
        ) : (
          <>
            {mediaComponent}
            {renderContent()}
          </>
        )}
      </div>
    )
  }

  // ── Horizontal layouts (left / right) ────────────────────────────
  // Mobile: image always on top, content below
  // Desktop: image left/right with 3fr/7fr split
  return (
    <div className="w-full">

      {/* ── Mobile — image first, content below ── */}
      <div className="flex flex-col gap-5 md:hidden">
        {mediaComponent}
        {renderContent()}
      </div>

      {/* ── Desktop — side by side ── */}
      <div
        className={`hidden md:flex items-start gap-6 lg:gap-8 ${
          imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Image — 3/10 width */}
        {mediaComponent && (
          <div className="w-[30%] flex-shrink-0">
            {mediaComponent}
          </div>
        )}

        {/* Content — 7/10 width */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>

    </div>
  )
}
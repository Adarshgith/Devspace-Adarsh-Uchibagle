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
    ? (image.asset?.url || urlFor(image).width(900).height(600).url())
    : ''

  const renderMedia = () => {
    if (video) {
      return (
        <div className="w-full mb-4">
          <iframe
            src={video}
            title={title || 'Video'}
            className="w-full h-[400px] rounded-lg border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    if (image && imageUrl) {
      return (
        <div className="w-full mb-4 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={image.alt || title || 'InfoBox image'}
            className="w-full h-auto block object-top object-contain"
          />
        </div>
      )
    }

    return null
  }

  const renderContent = () => (
    <div className={textSectionPadding ? `p-${textSectionPadding}` : 'p-6'}>
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

  const getFlexClass = () => {
    switch (imagePosition) {
      case 'left': return 'flex-row'
      case 'right': return 'flex-row-reverse'
      case 'bottom': return 'flex-col-reverse'
      default: return 'flex-col'
    }
  }

  return (
    <div className="w-full">
      <div className={`flex ${getFlexClass()} ${isHorizontal ? 'items-center gap-8' : ''}`}>
        {mediaComponent && (
          <div className={isHorizontal ? 'flex-1' : 'w-full'}>
            {mediaComponent}
          </div>
        )}
        <div className={isHorizontal ? 'flex-1' : 'w-full'}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
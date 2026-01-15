import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
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
  const renderMedia = () => {
    if (video) {
      return (
        <div className="relative w-full h-full mb-4">
          <iframe
            src={video}
            title={title || 'Video'}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    if (image) {
      return (
        <div className="relative w-full h-64 mb-4">
          <Image
            src={urlFor(image).width(600).height(400).url()}
            alt={image.alt || title || 'InfoBox image'}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )
    }

    return null
  }

  const renderContent = () => (
    <div className={`flex-1 ${textSectionPadding ? `p-${textSectionPadding}` : 'p-6'}`}>
      {sectionTitle && (
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {sectionTitle}
        </h3>
      )}

      {title && !sectionTitle && (
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {title}
        </h3>
      )}

      {content && (
        <div className="prose prose-lg max-w-none mb-4">
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
  const contentComponent = renderContent()

  // Layout based on image position
  const getLayoutClass = () => {
    switch (imagePosition) {
      case 'left':
        return 'flex-row'
      case 'right':
        return 'flex-row-reverse'
      case 'top':
        return 'flex-col'
      case 'bottom':
        return 'flex-col-reverse'
      default:
        return 'flex-col'
    }
  }

  const isHorizontal = imagePosition === 'left' || imagePosition === 'right'

  return (
    <div className="">
      <div className={`flex ${getLayoutClass()} ${isHorizontal ? 'items-center' : ''}`}>
        {mediaComponent && (
          <div className={`${isHorizontal ? 'flex-1' : 'w-full'}`}>
            {mediaComponent}
          </div>
        )}
        <div className={`${isHorizontal ? 'flex-1' : 'w-full'}`}>
          {contentComponent}
        </div>
      </div>
    </div>
  )
}

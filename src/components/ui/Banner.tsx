import Link from 'next/link'
import PortableTextRenderer from './PortableTextRenderer'

// Button interface based on the button schema
interface ButtonProps {
  text?: string
  url?: string
  openInNewTab?: boolean
  style?: 'primaryBtn' | 'secondaryBtn' | 'tertiarybtn'
}

// Regular Banner interface
interface BannerProps {
  heading: string
  subheading?: string
  content?: any[]
  button?: ButtonProps[]
  className?: string
}

// Button component
const Button = ({ text, url, openInNewTab, style }: ButtonProps) => {
  const getButtonStyles = (buttonStyle?: string) => {
    const baseStyles = 'inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-center'

    switch (buttonStyle) {
      case 'primaryBtn':
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
      case 'secondaryBtn':
        return `${baseStyles} bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`
      case 'tertiarybtn':
        return `${baseStyles} border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
    }
  }

  if (!text) return null

  if (url) {
    return (
      <Link
        href={url}
        target={openInNewTab ? '_blank' : '_self'}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={getButtonStyles(style)}
      >
        {text}
      </Link>
    )
  }

  return (
    <button className={getButtonStyles(style)}>
      {text}
    </button>
  )
}

// Regular Banner Component
export const Banner = ({ heading, subheading, content, button, className }: BannerProps) => {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-100 py-12 px-6 rounded-lg ${className || ''}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {heading}
        </h1>

        {subheading && (
          <p className="text-xl text-heading-color-1 mb-6">
            {subheading}
          </p>
        )}

        {content && (
          <div className="prose prose-lg max-w-none mb-8 text-gray-700">
            <PortableTextRenderer content={content} />
          </div>
        )}

        {button && button.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {button.map((btn, index) => (
              <Button
                key={index}
                text={btn.text}
                url={btn.url}
                openInNewTab={btn.openInNewTab}
                style={btn.style}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Default export for regular banner
export default Banner

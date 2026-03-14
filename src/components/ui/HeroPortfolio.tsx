'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ButtonType {
  text?: string
  url?: string
  openInNewTab?: boolean
  style?: 'primaryBtn' | 'secondaryBtn' | 'tertiarybtn'
}

interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'youtube' | 'other'
  url: string
  label?: string
}

interface HeroPortfolioProps {
  greeting?: string
  name?: string
  description?: string
  buttons?: ButtonType[]
  profileImage?: {
    asset: { _id?: string; url?: string; _ref?: string }
    alt?: string
    hotspot?: object
  }
  profileImageAlt?: string
  socialLinks?: SocialLink[]
}

// ── Social Icons (inline SVG — zero extra deps) ───────────────────────────────

const SocialIcon = ({ platform }: { platform: string }) => {
  const cls = 'w-5 h-5'
  switch (platform) {
    case 'github':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
        </svg>
      )
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
  }
}

// ── Button renderer ───────────────────────────────────────────────────────────

const HeroButton = ({ text, url, openInNewTab, style }: ButtonType) => {
  if (!text) return null

  const base =
    'inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent'

  const variants: Record<string, string> = {
    primaryBtn:   `${base} bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg hover:shadow-xl focus:ring-white`,
    secondaryBtn: `${base} bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-700 focus:ring-white`,
    tertiarybtn:  `${base} bg-indigo-800 text-white border border-indigo-500 hover:bg-indigo-700 focus:ring-indigo-400`,
  }

  const className = variants[style || 'primaryBtn']

  if (url) {
    return (
      <Link
        href={url}
        target={openInNewTab ? '_blank' : '_self'}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {text}
      </Link>
    )
  }

  return <button className={className}>{text}</button>
}

// ── Decorative dot-grid (matches Figma reference) ────────────────────────────

const DotGrid = ({ className }: { className?: string }) => (
  <div className={`grid grid-cols-6 gap-[6px] ${className ?? ''}`}>
    {Array.from({ length: 36 }).map((_, i) => (
      <span
        key={i}
        className="w-[5px] h-[5px] rounded-full bg-white opacity-40"
      />
    ))}
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────

export default function HeroPortfolio({
  greeting = "Hi!, I'm a",
  name = 'Software Developer',
  description = '',
  buttons = [],
  profileImage,
  profileImageAlt = 'Profile photo',
  socialLinks = [],
}: HeroPortfolioProps) {

  // Resolve image URL — prefer direct asset.url, fall back to urlFor
  const imageUrl =
    profileImage?.asset?.url ||
    (profileImage ? urlFor(profileImage).width(520).height(520).url() : null)

  return (
    <div className="relative w-full min-h-[90vh] flex items-center">

      {/* ── Background decorative blobs ── */}
      <div className="absolute top-[-80px] right-[-80px] w-[340px] h-[340px] rounded-full bg-purple-500 opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full bg-indigo-400 opacity-20 blur-3xl pointer-events-none" />

      {/* ── Content container ── */}
      <div className="container mx-auto px-6 lg:px-16 py-20 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-14">

          {/* ── LEFT — Text content ─────────────────────────────── */}
          <div className="flex-1 text-white text-center lg:text-left max-w-xl">

            {/* Greeting */}
            <p className="text-indigo-200 text-lg font-medium mb-2 tracking-wide">
              {greeting}
            </p>

            {/* Name / Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {name}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-indigo-100 text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
                {description}
              </p>
            )}

            {/* CTA Buttons */}
            {buttons.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                {buttons.map((btn, i) => (
                  <HeroButton key={i} {...btn} />
                ))}
              </div>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <span className="text-indigo-300 text-sm font-medium">Follow me</span>
                <div className="w-8 h-px bg-indigo-400" />
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label || social.platform}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT — Profile image ───────────────────────────── */}
          <div className="relative flex-shrink-0 flex items-center justify-center">

            {/* Dot grid — top right (decorative, from Figma) */}
            <DotGrid className="absolute -top-6 -right-6 z-0" />

            {/* Dot grid — bottom left (decorative, from Figma) */}
            <DotGrid className="absolute -bottom-6 -left-6 z-0" />

            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-300 opacity-30 blur-2xl scale-110 pointer-events-none" />

            {/* Image container */}
            <div className="relative z-10 w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={profileImageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 420px"
                  priority
                  unoptimized
                />
              ) : (
                /* Placeholder when no image is set */
                <div className="w-full h-full bg-indigo-500/40 flex flex-col items-center justify-center gap-3">
                  <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                  <span className="text-white/50 text-sm">Add profile image</span>
                </div>
              )}
            </div>
          </div>
          {/* ── END RIGHT ── */}

        </div>
      </div>
    </div>
  )
}
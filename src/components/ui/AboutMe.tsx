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

interface AboutMeProps {
  sectionLabel?: string
  heading?: string
  profileImage?: {
    asset: { _id?: string; url?: string; _ref?: string }
    alt?: string
    hotspot?: object
  }
  profileImageAlt?: string
  shortBio?: string
  yearsOfExperience?: number
  location?: string
  knowMoreButton?: ButtonType
}

// ── Know More Button ──────────────────────────────────────────────────────────

const KnowMoreButton = ({ text, url, openInNewTab, style }: ButtonType) => {
  if (!text) return null

  const base =
    'inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants: Record<string, string> = {
    primaryBtn:   `${base} bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg focus:ring-indigo-500`,
    secondaryBtn: `${base} bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500`,
    tertiarybtn:  `${base} bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400`,
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    )
  }

  return <button className={className}>{text}</button>
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-indigo-50 rounded-2xl px-6 py-4 min-w-[120px]">
    <span className="text-3xl font-bold text-indigo-600">{value}</span>
    <span className="text-sm text-gray-500 mt-1 text-center">{label}</span>
  </div>
)

// ── Main Component ────────────────────────────────────────────────────────────

export default function AboutMe({
  sectionLabel = 'About Me',
  heading = 'Who I Am',
  profileImage,
  profileImageAlt = 'Profile photo',
  shortBio = '',
  yearsOfExperience,
  location,
  knowMoreButton,
}: AboutMeProps) {

  const imageUrl =
    profileImage?.asset?.url ||
    (profileImage ? urlFor(profileImage).width(600).height(700).url() : null)

  return (
    <div className="w-full mx-auto items-center">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* ── LEFT — Profile Image ─────────────────────────────── */}
        <div className="relative flex-shrink-0 w-full lg:w-auto flex justify-center">

          {/* Decorative background blob */}
          <div className="absolute inset-0 bg-indigo-100 rounded-3xl rotate-3 scale-105 pointer-events-none" />

          {/* Image wrapper */}
          <div className="relative w-[280px] h-[340px] md:w-[340px] md:h-[420px] lg:w-[380px] lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={profileImageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 340px, 380px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-indigo-100 flex flex-col items-center justify-center gap-3">
                <svg className="w-20 h-20 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <span className="text-indigo-300 text-sm">Add profile image</span>
              </div>
            )}
          </div>

          {/* Floating experience badge */}
          {yearsOfExperience && (
            <div className="absolute -bottom-4 -right-4 lg:bottom-6 lg:-right-6 bg-white rounded-2xl shadow-xl px-5 py-4 flex flex-col items-center z-10 border border-indigo-50">
              <span className="text-3xl font-bold text-indigo-600">{yearsOfExperience}+</span>
              <span className="text-xs text-gray-500 mt-1 text-center leading-tight">Years of<br/>Experience</span>
            </div>
          )}
        </div>

        {/* ── RIGHT — Content ──────────────────────────────────── */}
        <div className="flex-1 text-center lg:text-left">

          {/* Section label */}
          {sectionLabel && (
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-indigo-600" />
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
                {sectionLabel}
              </span>
              <div className="w-8 h-[2px] bg-indigo-600" />
            </div>
          )}

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {heading}
          </h2>

          {/* Short bio */}
          {shortBio && (
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              {shortBio}
            </p>
          )}

          {/* Stats row */}
          {(yearsOfExperience || location) && (
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              {yearsOfExperience && (
                <StatCard value={`${yearsOfExperience}+`} label="Years Experience" />
              )}
              {location && (
                <div className="flex items-center gap-2 bg-indigo-50 rounded-2xl px-6 py-4">
                  <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700 font-medium text-sm">{location}</span>
                </div>
              )}
            </div>
          )}

          {/* Know More button */}
          {knowMoreButton?.text && (
            <KnowMoreButton {...knowMoreButton} />
          )}
        </div>
        {/* ── END RIGHT ── */}

      </div>
    </div>
  )
}
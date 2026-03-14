'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import PortableTextRenderer from './PortableTextRenderer'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  jobTitle: string
  companyName: string
  companyLogo?: {
    asset: { _id?: string; url?: string; _ref?: string }
    alt?: string
  }
  employmentType?: string
  startDate: string
  endDate?: string
  description?: any[]
}

interface ExperienceSectionProps {
  sectionLabel?: string
  heading?: string
  experiences?: ExperienceEntry[]
}

// ── Dot Grid Decoration ───────────────────────────────────────────────────────

const DotGrid = ({ className }: { className?: string }) => (
  <div className={`grid grid-cols-[repeat(8,1fr)] gap-[6px] ${className ?? ''}`}>
    {Array.from({ length: 64 }).map((_, i) => (
      <span key={i} className="w-[3px] h-[3px] rounded-full bg-white opacity-10" />
    ))}
  </div>
)

// ── Single Experience Row ─────────────────────────────────────────────────────

const ExperienceRow = ({
  entry,
  isLast,
  isOpen,
  onToggle,
}: {
  entry: ExperienceEntry
  isLast: boolean
  isOpen: boolean
  onToggle: () => void
}) => {
  const logoUrl =
    entry.companyLogo?.asset?.url ||
    (entry.companyLogo
      ? urlFor(entry.companyLogo).width(96).height(96).url()
      : null)

  const dateRange = `${entry.startDate} - ${entry.endDate || 'Present'}`
  const hasDescription = entry.description && entry.description.length > 0

  return (
    <div className="flex gap-3 sm:gap-5 w-full min-w-0">

      {/* ── Left: logo + vertical line ── */}
      <div className="flex flex-col items-center flex-shrink-0">

        {/* Company logo */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex items-center justify-center bg-gray-800 border border-gray-700 flex-shrink-0 z-10">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={entry.companyName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2"
              />
            </svg>
          )}
        </div>

        {/* Vertical connector line */}
        {!isLast && (
          <div className="w-[1px] flex-1 bg-gray-700 mt-2 min-h-[32px]" />
        )}
      </div>

      {/* ── Right: content ── */}
      <div className="flex-1 min-w-0 pb-6 sm:pb-8">

        {/* Clickable title row */}
        <button
          onClick={onToggle}
          className="w-full min-w-0 flex items-center gap-2 mb-1 text-left group cursor-pointer"
        >
          {/* Job title — truncate on very small screens */}
          <h3 className="text-white font-bold text-xs sm:text-sm md:text-base tracking-wider sm:tracking-widest uppercase font-mono flex-shrink-0 group-hover:text-indigo-400 transition-colors duration-200">
            {entry.jobTitle}
          </h3>

          {/* Dashed line — fills remaining space */}
          <div className="flex-1 border-t border-dashed border-gray-600 min-w-[8px]" />

          {/* Date — hidden on xs, shown from sm */}
          <span className="hidden sm:block text-gray-400 text-xs sm:text-sm font-mono whitespace-nowrap flex-shrink-0">
            {dateRange}
          </span>

          {/* Chevron */}
          <svg
            className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Date — shown only on xs below title */}
        <p className="block sm:hidden text-gray-500 text-xs font-mono mb-1">
          {dateRange}
        </p>

        {/* Company name + employment type */}
        <p className="text-gray-400 text-xs sm:text-sm font-mono mb-2 truncate">
          {entry.companyName}
          {entry.employmentType && (
            <span className="ml-2 text-gray-600 text-xs">
              · {entry.employmentType}
            </span>
          )}
        </p>

        {/* Accordion content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {hasDescription && (
            <div className="text-white text-xs sm:text-sm font-mono leading-relaxed experience-description pb-2">
              <PortableTextRenderer content={entry.description!} />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ExperienceSection({
  sectionLabel,
  heading = 'EXPERIENCE',
  experiences = [],
}: ExperienceSectionProps) {

  // First entry open by default
  const [openIndex, setOpenIndex] = useState<number>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div className="relative w-full overflow-hidden">

      {/* Dot grid decorations — hidden on mobile to avoid overflow */}
      <DotGrid className="absolute top-0 right-0 pointer-events-none hidden sm:grid" />
      <DotGrid className="absolute bottom-10 right-20 pointer-events-none hidden md:grid" />

      {/* ── Heading ── */}
      <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest uppercase font-mono mb-8 sm:mb-10">
        {heading}
      </h2>

      {/* ── Timeline entries ── */}
      {experiences.length === 0 ? (
        <p className="text-gray-500 font-mono text-sm">
          No experience entries added yet.
        </p>
      ) : (
        <div className="flex flex-col w-full">
          {experiences.map((entry, index) => (
            <ExperienceRow
              key={index}
              entry={entry}
              isLast={index === experiences.length - 1}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      )}

      {/* Global styles for PortableText inside experience */}
      <style jsx global>{`
        .experience-description p {
          margin: 0 0 4px 0;
          color: #ffffff;
        }
        .experience-description ul {
          list-style: disc;
          padding-left: 1.2rem;
          margin: 0;
        }
        .experience-description li {
          margin-bottom: 4px;
          color: #ffffff;
        }
        .experience-description strong {
          color: #ffffff;
        }
        .experience-description a {
          color: #818cf8;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
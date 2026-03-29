'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

interface TechTag {
  name: string
  icon?: {
    asset: { _id?: string; url?: string; _ref?: string }
  }
}

interface Project {
  _id: string
  slug?: { current: string }
  name: string
  date: string
  isWIP?: boolean
  image?: {
    asset: { _id?: string; url?: string; _ref?: string }
    alt?: string
  }
  description: string
  techStack?: TechTag[]
  liveLink?: string
  githubLink?: string
}

interface ProjectsSectionProps {
  heading?: string
  subheading?: string
  projects?: Project[]
}

// ── Dot Grid ──────────────────────────────────────────────────────────────────

const DotGrid = ({ className }: { className?: string }) => (
  <div className={`grid grid-cols-[repeat(8,1fr)] gap-[6px] ${className ?? ''}`}>
    {Array.from({ length: 64 }).map((_, i) => (
      <span key={i} className="w-[3px] h-[3px] rounded-full bg-white opacity-10" />
    ))}
  </div>
)

// ── Tech Tag Badge ────────────────────────────────────────────────────────────

const TechBadge = ({ tag }: { tag: TechTag }) => {
  const iconUrl = tag.icon?.asset?.url || null

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-mono whitespace-nowrap">
      {iconUrl && (
        <Image
          src={iconUrl}
          alt={tag.name}
          width={14}
          height={14}
          className="w-3.5 h-3.5 object-contain flex-shrink-0"
          unoptimized
        />
      )}
      {tag.name}
    </span>
  )
}

// ── Project Card ──────────────────────────────────────────────────────────────

const ProjectCard = ({ project }: { project: Project }) => {
  const imageUrl =
    project.image?.asset?.url ||
    (project.image ? urlFor(project.image).width(800).height(500).url() : null)

  return (
<Link
  href={`/projects/${project.slug?.current}`}
  className="flex flex-col rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 hover:border-gray-600 transition-all duration-300 group cursor-pointer"
>

      {/* ── Project image ── */}
      <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden bg-gray-800 flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Card content ── */}
      <div className="flex flex-col flex-1 p-5">

        {/* Name + WIP + date row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold !text-xl sm:text-base tracking-widest uppercase font-mono">
              {project.name}
            </h3>
            {project.isWIP && (
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-gray-700 text-gray-300 border border-gray-600 tracking-widest">
                WIP
              </span>
            )}
          </div>
          <span className="text-gray-500 text-xs font-mono whitespace-nowrap flex-shrink-0 mt-0.5">
            {project.date}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 !text-lg sm:text-sm font-mono leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech stack tags */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {project.techStack.map((tag, i) => (
              <TechBadge key={i} tag={tag} />
            ))}
          </div>
        )}

        {/* Links */}
        {(project.liveLink || project.githubLink) && (
          <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
            {project.liveLink && (
              <Link
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-gray-300 text-md font-mono hover:text-white transition-colors duration-200 py-1"
              >
                Live link
              </Link>
            )}
            {project.liveLink && project.githubLink && (
              <div className="w-[1px] h-4 bg-gray-700" />
            )}
            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-gray-300 text-xs font-mono hover:text-white transition-colors duration-200 py-1 flex items-center justify-center gap-1.5"
              >
                GitHub
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProjectsSection({
  heading = 'PROJECTS',
  subheading,
  projects = [],
}: ProjectsSectionProps) {

  return (
    <div className="relative w-full overflow-hidden">

      {/* Dot grid decorations */}
      <DotGrid className="absolute top-0 right-0 pointer-events-none hidden sm:grid" />
      <DotGrid className="absolute bottom-0 left-0 pointer-events-none hidden md:grid" />

      {/* ── Section header ── */}
      <div className="mb-10">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest uppercase font-mono">
          {heading}
        </h2>
        {subheading && (
          <p className="text-gray-400 font-mono text-sm mt-2">{subheading}</p>
        )}
      </div>

      {/* ── Empty state ── */}
      {projects.length === 0 && (
        <p className="text-gray-500 font-mono text-sm">No projects added yet.</p>
      )}

      {/* ── Projects grid ── */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {projects.map((project, index) => (
        <ProjectCard key={project._id || index} project={project} />
        ))}
        </div>
      )}
    </div>
  )
}   
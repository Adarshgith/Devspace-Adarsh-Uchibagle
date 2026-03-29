import { client, urlFor } from '@/lib/sanity'
import { projectBySlugQuery } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import { Metadata } from 'next'

interface ProjectPageProps {
  params: { slug: string }
}

// ── Generate Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const project = await client.fetch(projectBySlugQuery, { slug: resolvedParams.slug })

  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.name} | Projects`,
    description: project.description,
  }
}

// ── Tech Badge ────────────────────────────────────────────────────────────────

const TechBadge = ({ name, icon }: { name: string; icon?: any }) => {
  const iconUrl = icon?.asset?.url || null
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-mono">
      {iconUrl && (
        <Image src={iconUrl} alt={name} width={14} height={14} className="w-3.5 h-3.5 object-contain" unoptimized />
      )}
      {name}
    </span>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params
  const project = await client.fetch(projectBySlugQuery, { slug: resolvedParams.slug })

  if (!project) notFound()

  const imageUrl =
    project.image?.asset?.url ||
    (project.image ? urlFor(project.image).width(1200).height(700).url() : null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">

        {/* ── Back button ── */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm mb-10 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest uppercase font-mono">
              {project.name}
            </h1>
            {project.isWIP && (
              <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-gray-700 text-gray-300 border border-gray-600 tracking-widest">
                WIP
              </span>
            )}
          </div>
          <p className="text-gray-400 font-mono text-sm">{project.date}</p>
        </div>

        {/* ── Project image ── */}
        {imageUrl && (
          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-2xl overflow-hidden mb-10 border border-gray-700">
            <Image
              src={imageUrl}
              alt={project.name}
              fill
              className="object-cover object-top"
              priority
              unoptimized
            />
          </div>
        )}

        {/* ── Tech stack ── */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {project.techStack.map((tag: any, i: number) => (
              <TechBadge key={i} name={tag.name} icon={tag.icon} />
            ))}
          </div>
        )}

        {/* ── Links ── */}
        {(project.liveLink || project.githubLink) && (
          <div className="flex flex-wrap gap-4 mb-12">
            {project.liveLink && (
              <Link
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-mono font-bold text-sm hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Link
              </Link>
            )}
            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800 text-white font-mono font-bold text-sm border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </Link>
            )}
          </div>
        )}

        {/* ── Short description ── */}
        <div className="mb-10">
          <p className="text-gray-300 font-mono text-sm sm:text-base leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* ── Full rich text description ── */}
        {project.fullDescription && project.fullDescription.length > 0 && (
          <div className="prose-invert max-w-none border-t border-gray-700 pt-10">
            <PortableTextRenderer content={project.fullDescription} />
          </div>
        )}

      </div>
    </main>
  )
}
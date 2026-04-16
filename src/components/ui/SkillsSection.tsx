// components/SkillsSection.tsx
'use client'

import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Skill {
  name: string
  logo?: {
    asset?: { _ref?: string; url?: string }
  }
  proficiency?: 'expert' | 'proficient' | 'familiar'
}

interface SkillCategory {
  categoryName: string
  categoryIcon?: string
  skills: Skill[]
}

interface SkillsSectionProps {
  sectionTitle?: string
  sectionSubtitle?: string
  categories?: SkillCategory[]
}

// ── Proficiency badge ─────────────────────────────────────────────────────────

const proficiencyConfig = {
  expert:     { label: 'Expert',     className: 'bg-[#00BCD4]/15 text-[#00BCD4] border-[#00BCD4]/25' },
  proficient: { label: 'Proficient', className: 'bg-purple-500/15 text-purple-300 border-purple-500/25' },
  familiar:   { label: 'Familiar',   className: 'bg-slate-500/15 text-slate-400 border-slate-500/25' },
}

// ── Skill Card ────────────────────────────────────────────────────────────────

const SkillCard = ({ skill }: { skill: Skill }) => {
  const logoUrl =
    skill.logo?.asset?.url ||
    (skill.logo?.asset?._ref ? urlFor(skill.logo).width(48).height(48).url() : null)

  const badge = skill.proficiency ? proficiencyConfig[skill.proficiency] : null

  return (
    <div className="group relative flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/8 hover:border-[#00BCD4]/30 hover:bg-white/[0.07] transition-all duration-300">

      {/* Logo */}
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={skill.name}
            width={32}
            height={32}
            className="object-contain"
            unoptimized
          />
        ) : (
          // Fallback — first 2 letters
          <span className="text-sm font-bold text-[#00BCD4] font-mono">
            {skill.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="text-md font-medium text-slate-200 text-center leading-tight">
        {skill.name}
      </span>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl bg-[#00BCD4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SkillsSection({
  sectionTitle = 'Technical Skills',
  sectionSubtitle = 'Technologies I work with',
  categories = [],
}: SkillsSectionProps) {

  return (
    <section className="relative w-full overflow-hidden">

      {/* ── Background blobs ── */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-600 opacity-[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#00BCD4] opacity-[0.05] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">

        {/* ── Section header ── */}
        <div className="mb-16">
          <p className="text-[#00BCD4] text-sm font-medium tracking-widest uppercase mb-3">
            {sectionSubtitle}
          </p>
          <div className="flex items-end gap-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {sectionTitle}
            </h2>
            <div className="hidden md:flex items-center gap-2 mb-2">
              <div className="w-16 h-[2px] bg-gradient-to-r from-[#00BCD4] to-transparent rounded-full" />
            </div>
          </div>
          {/* Accent dots */}
          <div className="flex items-center gap-1.5 mt-4">
            <div className="w-8 h-[2px] bg-[#00BCD4] rounded-full" />
            <div className="w-3 h-[2px] bg-purple-400 rounded-full" />
            <div className="w-1.5 h-[2px] bg-indigo-400 rounded-full" />
          </div>
        </div>

        {/* ── Categories ── */}
        <div className="flex flex-col gap-12">
          {categories.map((category, ci) => (
            <div key={ci}>

              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                {category.categoryIcon && (
                  <span className="text-xl">{category.categoryIcon}</span>
                )}
                <h3 className="text-lg font-semibold text-white tracking-wide">
                  {category.categoryName}
                </h3>
                <div className="flex-1 h-px bg-white/8 ml-2" />
                <span className="text-xs text-slate-500 font-mono">
                  {category.skills?.length ?? 0} skills
                </span>
              </div>

              {/* Skills grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {category.skills?.map((skill, si) => (
                  <SkillCard key={si} skill={skill} />
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
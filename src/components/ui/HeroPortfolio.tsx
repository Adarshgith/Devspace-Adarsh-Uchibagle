'use client'

import Link from 'next/link'
import PortableTextRenderer from './PortableTextRenderer'
import { PortableTextBlock } from 'next-sanity'

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
  availableForWork?: boolean
  greeting?: string
  name?: string
  description?: PortableTextBlock[]
  yearsOfExperience?: number
  projectsCount?: number
  techTags?: string[]
  resumeUrl?: {
    asset?: { url?: string }
  }
  buttons?: ButtonType[]
  socialLinks?: SocialLink[]
}

// ── Social Icons ──────────────────────────────────────────────────────────────

const SocialIcon = ({ platform }: { platform: string }) => {
  const cls = 'w-4 h-4'
  switch (platform) {
    case 'github':
      return <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
    case 'linkedin':
      return <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
    case 'twitter':
      return <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
    case 'instagram':
      return <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
    case 'youtube':
      return <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" /></svg>
    default:
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
  }
}

// ── Button renderer ───────────────────────────────────────────────────────────

const HeroButton = ({ text, url, openInNewTab, style }: ButtonType) => {
  if (!text) return null
  const base = 'inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300'
  const variants: Record<string, string> = {
    primaryBtn:   `${base} bg-[#00BCD4] text-white hover:bg-[#00ACC1] shadow-lg hover:shadow-[#00BCD4]/30 hover:shadow-xl`,
    secondaryBtn: `${base} bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40`,
    tertiarybtn:  `${base} bg-indigo-800 text-white border border-indigo-500/50 hover:bg-indigo-700`,
  }
  const className = variants[style || 'primaryBtn']
  if (url) {
    return (
      <Link href={url} target={openInNewTab ? '_blank' : '_self'} rel={openInNewTab ? 'noopener noreferrer' : undefined} className={className}>
        {text}
      </Link>
    )
  }
  return <button className={className}>{text}</button>
}

// ── Download Icon ─────────────────────────────────────────────────────────────

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

// ── Decorative dot grid ───────────────────────────────────────────────────────

const DotGrid = ({ className }: { className?: string }) => (
  <div className={`grid grid-cols-8 gap-[6px] pointer-events-none ${className ?? ''}`}>
    {Array.from({ length: 64 }).map((_, i) => (
      <span key={i} className="w-[3px] h-[3px] rounded-full bg-white/20" />
    ))}
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────

export default function HeroPortfolio({
  availableForWork,
  greeting,
  name,
  description,
  yearsOfExperience,
  projectsCount,
  techTags,
  resumeUrl,
  buttons,
  socialLinks,
}: HeroPortfolioProps) {

  const resumeFileUrl = resumeUrl?.asset?.url

  return (
    <div className="relative w-full min-h-[100vh] flex items-center overflow-hidden">

      {/* ── Two column layout ── */}
      <div className="container mx-auto px-6 lg:px-16 py-24 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* ── LEFT ── */}
          <div className="flex-1 flex flex-col items-start text-left">

            {/* Available badge */}
            {availableForWork && (
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 mb-8">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
                </span>
                <span className="text-emerald-300 text-xs font-medium tracking-widest uppercase">
                  Available for work
                </span>
              </div>
            )}

            {/* Name */}
            {name && (
              <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold leading-none mb-6 tracking-tight">
                <span className="text-white">{name.split(' ')[0]} </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCD4] to-purple-400">
                  {name.split(' ').slice(1).join(' ')}
                </span>
              </h1>
            )}
            
            {/* Greeting / role */}
            {greeting && (
              <p className="text-indigo-300/80 text-base md:text-lg font-medium mb-3 tracking-wide">
                {greeting}
              </p>
            )}

            {/* Accent line */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-[2px] bg-[#00BCD4] rounded-full" />
              <div className="w-3 h-[2px] bg-purple-400 rounded-full" />
              <div className="w-1.5 h-[2px] bg-indigo-400 rounded-full" />
            </div>

            {/* Description */}
            {(description?.length ?? 0) > 0 && (
              <div className="text-slate-300/80 text-base md:text-lg leading-relaxed mb-10 max-w-xl [&_strong]:text-white [&_strong]:font-semibold [&_p]:mb-2">
                <PortableTextRenderer content={description!} />
              </div>
            )}

            {/* Actions */}
            {(resumeFileUrl || (buttons?.length ?? 0) > 0) && (
              <div className="flex flex-wrap items-center gap-3 mb-10">
                {resumeFileUrl && (
                  <a
                    href={resumeFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-6 py-3 rounded-full font-semibold text-sm tracking-wide shadow-lg shadow-[#00BCD4]/20 hover:shadow-[#00BCD4]/40 transition-all duration-300"
                  >
                    <DownloadIcon />
                    Download Resume
                  </a>
                )}
                {buttons?.map((btn, i) => (
                  <HeroButton key={i} {...btn} />
                ))}
              </div>
            )}

            {/* Social links */}
            {(socialLinks?.length ?? 0) > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-xs tracking-widest uppercase">Follow</span>
                <div className="w-6 h-px bg-slate-600" />
                <div className="flex gap-2">
                  {socialLinks!.map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label || social.platform}
                      className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#00BCD4]/20 border border-white/10 hover:border-[#00BCD4]/40 flex items-center justify-center text-slate-400 hover:text-[#00BCD4] transition-all duration-200"
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── RIGHT — Stats + Tech card ── */}
          <div className="flex-shrink-0 flex flex-col gap-4 w-full lg:w-[320px]">

            {/* Stats card */}
            {(yearsOfExperience || projectsCount) && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-around gap-4">
                  {yearsOfExperience && (
                    <div className="text-center">
                      <div className="text-4xl font-extrabold text-[#00BCD4] leading-none mb-1">
                        {yearsOfExperience}<span className="text-2xl">+</span>
                      </div>
                      <div className="text-slate-400 text-xs tracking-widest uppercase mt-1">Years Exp.</div>
                    </div>
                  )}
                  {yearsOfExperience && projectsCount && (
                    <div className="w-px h-12 bg-white/10" />
                  )}
                  {projectsCount && (
                    <div className="text-center">
                      <div className="text-4xl font-extrabold text-[#00BCD4] leading-none mb-1">
                        {projectsCount}<span className="text-2xl">+</span>
                      </div>
                      <div className="text-slate-400 text-xs tracking-widest uppercase mt-1">Projects</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tech tags card */}
            {(techTags?.length ?? 0) > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-slate-500 text-xs tracking-widest uppercase mb-4">Core Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {techTags!.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs text-[#00BCD4] bg-[#00BCD4]/10 border border-[#00BCD4]/20 rounded-md px-3 py-1 font-mono hover:bg-[#00BCD4]/15 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Decorative code-style card */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 backdrop-blur-sm font-mono text-xs">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="space-y-1.5">
                <p><span className="text-purple-400">const</span> <span className="text-[#00BCD4]">developer</span> <span className="text-white/40">=</span> <span className="text-white/40">{'{'}</span></p>
                <p className="pl-4"><span className="text-indigo-300">passion</span><span className="text-white/40">:</span> <span className="text-emerald-400">"building great products"</span><span className="text-white/40">,</span></p>
                <p className="pl-4"><span className="text-indigo-300">status</span><span className="text-white/40">:</span> <span className="text-emerald-400">{availableForWork ? '"open to work 🚀"' : '"currently busy 🔥"'}</span><span className="text-white/40">,</span></p>
                <p className="pl-4"><span className="text-indigo-300">coffee</span><span className="text-white/40">:</span> <span className="text-orange-400">Infinity</span></p>
                <p><span className="text-white/40">{'}'}</span></p>
              </div>
            </div>

          </div>
          {/* ── END RIGHT ── */}

        </div>
      </div>
    </div>
  )
}
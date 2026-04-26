import Link from "next/link";
import { client } from "@/lib/sanity";
import { siteSettingsQuery, footerMenuQuery } from "@/lib/queries";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteSettings, navMenu] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(footerMenuQuery),
  ]);

  const quickLinks =
    navMenu?.items
      ?.filter((item: any) => item.text && item.link)
      .map((item: any) => ({
        text: item.text,
        url: item.link,
      })) || [];

  const socialLinks = [
    {
      label: "GitHub",
      url: siteSettings?.githubLink,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      url: siteSettings?.linkedInLink,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      url: siteSettings?.youtubeLink,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: "Email",
      url: siteSettings?.email ? `mailto:${siteSettings.email}` : null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ].filter((s) => s.url);

  return (
    <footer className="relative bg-[#0d0a1a] overflow-hidden">

      {/* ── Top gradient border ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      {/* ── Decorative blobs ── */}
      <div className="absolute bottom-0 left-[-100px] w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-[-50px] w-[300px] h-[300px] rounded-full bg-[#00BCD4]/5 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10 pt-12 pb-8">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 mb-10">

          {/* ── Brand col ── */}
          <div className="md:col-span-4">
            <span className="text-[11px] text-indigo-500 font-mono tracking-[0.2em] uppercase">
              Portfolio
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-mono mt-1 mb-1">
              {siteSettings?.title}
            </h2>
            {siteSettings?.footerTagline && (
              <p className="text-[#00BCD4] text-sm font-mono mb-3 tracking-wide">
                {siteSettings.footerTagline}
              </p>
            )}
            <div className="w-10 h-0.5 bg-gradient-to-r from-purple-500 to-[#00BCD4] rounded-full mb-3" />
            {siteSettings?.description && (
              <p className="text-indigo-400/50 text-sm leading-relaxed line-clamp-3 mb-5">
                {siteSettings.description}
              </p>
            )}
            {/* ── Social icons — mobile only (inside brand) ── */}
            <div className="md:hidden">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-[#00BCD4] rounded-full" />
                <h3 className="text-[11px] text-indigo-400/80 uppercase tracking-[0.18em] font-mono">
                  Follow Me
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.url!}
                    target={social.label !== "Email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="w-9 h-9 rounded-xl hover:bg-indigo-500/15 border border-white/[0.08] hover:border-indigo-500/40 flex items-center justify-center text-indigo-400/70 hover:text-[#00BCD4] transition-all duration-300 hover:scale-105"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* ── END Brand col ── */}

          {/* ── Social Icons — desktop only, separate grid col ── */}
          <div className="hidden md:block md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-[#00BCD4] rounded-full" />
              <h3 className="text-[11px] text-indigo-400/80 uppercase tracking-[0.18em] font-mono">
                Follow Me
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url!}
                  target={social.label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="w-9 h-9 rounded-xl hover:bg-indigo-500/15 border border-white/[0.08] hover:border-indigo-500/40 flex items-center justify-center text-indigo-400/70 hover:text-[#00BCD4] transition-all duration-300 hover:scale-105"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          {/* ── END Social col ── */}

          {/* ── Quick Links ── */}
          {quickLinks.length > 0 && (
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-[#00BCD4] rounded-full" />
                <h3 className="text-[11px] text-indigo-400/80 uppercase tracking-[0.18em] font-mono">
                  Quick Links
                </h3>
              </div>
              <div className={`grid gap-y-3 gap-x-4 ${quickLinks.length > 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {quickLinks.map((link: any, i: number) => (
                  <Link
                    key={i}
                    href={link.url}
                    className="group flex items-center gap-2.5 text-indigo-300/60 hover:text-white text-sm font-mono transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600/50 group-hover:bg-[#00BCD4] transition-all duration-200 flex-shrink-0" />
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* ── END Quick Links ── */}

          {/* ── Contact Info ── */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-[#00BCD4] rounded-full" />
              <h3 className="text-[11px] text-indigo-400/80 uppercase tracking-[0.18em] font-mono">
                Get In Touch
              </h3>
            </div>
            <div className="space-y-3">
              {siteSettings?.email && (
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="group flex items-start gap-3 text-indigo-300/60 hover:text-white text-sm font-mono transition-all duration-200"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-indigo-500/15 border border-white/[0.06] group-hover:border-indigo-500/30 flex items-center justify-center flex-shrink-0 transition-all duration-200 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="break-all">{siteSettings.email}</span>
                </a>
              )}
              {siteSettings?.phone && (
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="group flex items-center gap-3 text-indigo-300/60 hover:text-white text-sm font-mono transition-all duration-200"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-indigo-500/15 border border-white/[0.06] group-hover:border-indigo-500/30 flex items-center justify-center flex-shrink-0 transition-all duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  {siteSettings.phone}
                </a>
              )}
              {siteSettings?.address && (
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(siteSettings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-indigo-300/60 hover:text-white text-sm font-mono transition-all duration-200"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-indigo-500/15 border border-white/[0.06] group-hover:border-indigo-500/30 flex items-center justify-center flex-shrink-0 transition-all duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  {siteSettings.address}
                </a>
              )}
            </div>
          </div>
          {/* ── END Contact ── */}

        </div>
        {/* ── END Main grid ── */}

        {/* ── Divider ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-6" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-indigo-500/40 text-[11px] font-mono tracking-wide text-center md:text-left">
            {siteSettings?.copyright ||
              `© ${currentYear} ${siteSettings?.title} · All Rights Reserved`}
          </p>
          <div className="flex items-center gap-1.5 text-indigo-500/30 text-[11px] font-mono">
            <span>Built with</span>
            <span className="text-[#00BCD4]/40">Next.js</span>
            <span>&</span>
            <span className="text-[#00BCD4]/40">Sanity CMS</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";

const SERVICE_ID = "service_oaelfbq";
const TEMPLATE_ID = "template_f366uh9";
const PUBLIC_KEY = "-BuAVhWGCrxyjQx7O";

interface ContactSectionProps {
  heading?: string
  subheading?: string
  description?: string
  email?: string
  phone?: string
  location?: string
}

export default function ContactSection({
  heading,
  subheading,
  description,
  email,
  phone,
  location,
}: ContactSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current);
      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-[#00BCD4]/10 blur-[60px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* ── Left — Contact Info ── */}
        <div className="flex flex-col justify-center">

          {subheading && (
            <span className="text-[11px] text-indigo-500 font-mono tracking-[0.2em] uppercase mb-3">
              {subheading}
            </span>
          )}

          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-white font-mono mb-3">
              {heading.split(' ').map((word, i) => (
                i === 1 ? (
                  <span key={i} className="text-[#00BCD4]">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              ))}
            </h2>
          )}

          <div className="w-10 h-0.5 bg-gradient-to-r from-purple-500 to-[#00BCD4] rounded-full mb-6" />

          {description && (
            <p className="text-indigo-300/70 text-sm leading-relaxed mb-10 max-w-sm">
              {description}
            </p>
          )}

          {/* ── Contact cards ── */}
          <div className="space-y-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-indigo-500/10 border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300"
              >
                <span className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/25 transition-all duration-300">
                  <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] text-indigo-400/60 font-mono uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-indigo-200 text-sm font-mono group-hover:text-white transition-colors">{email}</p>
                </div>
              </a>
            )}

            {phone && (
              <a
                href={`tel:${phone}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-indigo-500/10 border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300"
              >
                <span className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/25 transition-all duration-300">
                  <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] text-indigo-400/60 font-mono uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-indigo-200 text-sm font-mono group-hover:text-white transition-colors">{phone}</p>
                </div>
              </a>
            )}

            {location && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] text-indigo-400/60 font-mono uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-indigo-200 text-sm font-mono">{location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right — Contact Form ── */}
        <div className="relative">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 max-md:p-5">
            <h3 className="text-lg font-bold text-white font-mono mb-6">
              Send a Message
            </h3>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] text-indigo-400/70 font-mono uppercase tracking-wider mb-2">Your Name</label>
                <input type="text" name="name" required placeholder="John Doe"
                  className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-indigo-500/50 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder:text-indigo-400/30 outline-none transition-all duration-200 focus:bg-white/[0.07]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-indigo-400/70 font-mono uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" name="email" required placeholder="john@example.com"
                  className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-indigo-500/50 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder:text-indigo-400/30 outline-none transition-all duration-200 focus:bg-white/[0.07]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-indigo-400/70 font-mono uppercase tracking-wider mb-2">Message</label>
                <textarea name="message" required rows={6} placeholder="Tell me about the opportunity or project..."
                  className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-indigo-500/50 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder:text-indigo-400/30 outline-none transition-all duration-200 focus:bg-white/[0.07] resize-none"
                />
              </div>

              <button type="submit" disabled={status === "sending"}
                className="w-full bg-gradient-to-r from-indigo-600 to-[#00BCD4] hover:from-indigo-500 hover:to-[#00ACC1] text-white font-mono font-semibold text-sm py-3.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "sending" ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 12 0 12 0v4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>

              {status === "success" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-400 text-sm font-mono">Message sent! I'll get back to you soon.</p>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 text-sm font-mono">Something went wrong. Please try again.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { SiteSettings } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { formatPhoneNumber } from '@/lib/utils'

interface FooterProps {
  siteSettings: SiteSettings | null
}

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' }
  ],
  services: [
    { label: 'Web Development', href: '/services/web-development' },
    { label: 'Digital Marketing', href: '/services/digital-marketing' },
    { label: 'SEO Services', href: '/services/seo' },
    { label: 'Consulting', href: '/services/consulting' }
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'News', href: '/news' },
    { label: 'Events', href: '/events' },
    { label: 'Case Studies', href: '/case-studies' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Sitemap', href: '/sitemap.xml' }
  ]
}

export default function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'Facebook',
      href: siteSettings?.facebookLink,
      icon: Facebook
    },
    {
      name: 'Twitter',
      href: siteSettings?.twitterLink,
      icon: Twitter
    },
    {
      name: 'LinkedIn',
      href: siteSettings?.linkedInLink,
      icon: Linkedin
    },
    {
      name: 'Instagram',
      href: siteSettings?.instagramLink,
      icon: Instagram
    }
  ].filter(link => link.href)

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="mb-6">
                {siteSettings?.footerLogo ? (
                  <Image
                    src={urlFor(siteSettings.footerLogo).width(150).height(50).url()}
                    alt={siteSettings.title || 'Logo'}
                    width={150}
                    height={50}
                    className="h-10 w-auto"
                  />
                ) : (
                  <div className="text-2xl font-bold">
                    {siteSettings?.title || 'Agency'}
                  </div>
                )}
              </div>

              {/* Description */}
              {siteSettings?.description && (
                <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                  {siteSettings.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="space-y-3">
                {siteSettings?.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      {siteSettings.address}
                    </span>
                  </div>
                )}
                
                {siteSettings?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {formatPhoneNumber(siteSettings.phone)}
                    </a>
                  </div>
                )}
                
                {siteSettings?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {siteSettings.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors duration-200"
                          aria-label={`Follow us on ${social.name}`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        {siteSettings?.footerSubscribeForm && (
          <div className="border-t border-gray-800 py-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="text-lg font-semibold text-white mb-2">
                Stay Updated
              </h4>
              <p className="text-gray-300 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and insights.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              {siteSettings?.copyright ? (
                <span dangerouslySetInnerHTML={{ __html: siteSettings.copyright }} />
              ) : (
                <span>
                  © {currentYear} {siteSettings?.title || 'Agency'}. All rights reserved.
                </span>
              )}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Button */}
          {siteSettings?.footerButton && (
            <div className="mt-6 text-center">
              <Link
                href={siteSettings.footerButton.link || '#'}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {siteSettings.footerButton.text || 'Get Started'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import { SiteSettings } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { cn } from '@/lib/utils'
import GlobalSearch, { SearchModal } from '@/components/ui/GlobalSearch'

interface HeaderProps {
  siteSettings: SiteSettings | null
}

interface NavigationItem {
  label: string
  href: string
  children?: NavigationItem[]
}

// Main navigation items
const navigationItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'About',
    href: '/about'
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Web Development', href: '/services/web-development' },
      { label: 'Digital Marketing', href: '/services/digital-marketing' },
      { label: 'SEO Services', href: '/services/seo' },
      { label: 'Consulting', href: '/services/consulting' }
    ]
  },
  {
    label: 'Resources',
    href: '#',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'News', href: '/news' },
      { label: 'Events', href: '/events' },
      { label: 'Case Studies', href: '/case-studies' }
    ]
  },
  {
    label: 'Contact',
    href: '/contact'
  }
]

export default function Header({ siteSettings }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
    // Set initial scroll state after hydration
    setIsScrolled(window.scrollY > 10)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    if (!isClient) return
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-white shadow-sm'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              {siteSettings?.siteLogo ? (
                <Image
                  src={urlFor(siteSettings.siteLogo).width(120).height(40).url()}
                  alt={siteSettings.title || 'Logo'}
                  width={120}
                  height={40}
                  className="h-8 lg:h-10 w-auto"
                  priority
                  unoptimized
                />
              ) : (
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {siteSettings?.title || 'Agency'}
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <>
                    <button
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div
                      className={cn(
                        'absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transition-all duration-200',
                        activeDropdown === item.label
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible translate-y-2'
                      )}
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Search and CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="w-64">
              <GlobalSearch 
                placeholder="Search..."
                className="w-full"
                showFilters={false}
              />
            </div>
            
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Get Started
              
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden mobile-menu fixed inset-0 top-16 bg-white z-40 transition-all duration-300',
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        )}
      >
        <div className="px-4 py-6 space-y-4 max-h-screen overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    className="flex items-center justify-between w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                    onClick={() => handleDropdownToggle(item.label)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        activeDropdown === item.label ? 'rotate-180' : ''
                      )}
                    />
                  </button>
                  
                  {/* Mobile Dropdown */}
                  <div
                    className={cn(
                      'pl-4 space-y-2 transition-all duration-200',
                      activeDropdown === item.label
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0 overflow-hidden'
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 py-1"
                        onClick={closeMobileMenu}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          
          {/* Mobile CTA */}
          <div className="pt-4 border-t border-gray-200">
            <Link
              href="/contact"
              className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              onClick={closeMobileMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </header>
  )
}
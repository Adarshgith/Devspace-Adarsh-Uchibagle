import { groq } from 'next-sanity'

// Site Settings Query
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    noIndex,
    robotsTxt,
    sitemapXml,
    title,
    description,
    footerLogo {
      asset-> {
        _id,
        url
      }
    },
    copyright,
    footerButton {
      footerButtonText,
      footerButtonLink
    },
    footerSubscribeForm,
    address,
    phone,
    email,
    linkedInLink,
    twitterLink,
    facebookLink,
    instagramLink,
    githubLink,
    youtubeLink,
    footerTagline,
    privacyLinks,
    announcementBannerActive,
    announcementBannerText,
    announcementBannerLink
  }
`

// Navigation Menu Query
export const navigationMenuQuery = groq`
  *[_type == "navigationMenu"][0] {
    _id,
    title,
    menuItems[] {
      _type,
      title,
      link,
      page->{
        title,
        slug
      },
      subNavItems[] {
        _type,
        title,
        link,
        page->{
          title,
          slug
        }
      }
    }
  }
`

// Header Menu Query with nested navigation structure
const headerQueryString = groq`
  *[_type == 'navigationMenu' && title == $menuTitle] {
    items[] {
      text,
      "link": select(
        defined(navigationItemUrl.internalLink) => navigationItemUrl.internalLink->seo.pagePath,
        navigationItemUrl.externalUrl
      ),
      "openInNewTab": openInNewTab,
      subNavigationItems[] {
        text,
        "subUrl": select(
          defined(navigationItemUrl.internalLink) => navigationItemUrl.internalLink->seo.pagePath,
          navigationItemUrl.externalUrl
        ),
        "openInNewTab": openInNewTab,
        isMegaMenu,
        megaMenuContent,
        "icon": icon.asset->url,
        "hoverIcon": hoverIcon.asset->url,
        subNavigationItems[] {
          text,
          "subUrl": select(
            defined(navigationItemUrl.internalLink) => navigationItemUrl.internalLink->seo.pagePath,
            navigationItemUrl.externalUrl
          ),
          "openInNewTab": navigationItemUrl.openInNewTab,
          subNavigationItems[] {
            text,
            "subUrl": select(
              defined(navigationItemUrl.internalLink) => navigationItemUrl.internalLink->seo.pagePath,
              navigationItemUrl.externalUrl
            ),
            "openInNewTab": navigationItemUrl.openInNewTab,
            subNavigationItems[] {
              text,
              "subUrl": select(
                defined(navigationItemUrl.internalLink) => navigationItemUrl.internalLink->seo.pagePath,
                navigationItemUrl.externalUrl
              ),
              "openInNewTab": navigationItemUrl.openInNewTab,
              subNavigationItems[] {
                text,
                "subUrl": select(
                  defined(navigationItemUrl.internalLink) => navigationItemUrl.internalLink->seo.pagePath,
                  navigationItemUrl.externalUrl
                ),
                "openInNewTab": navigationItemUrl.openInNewTab,
                subNavigationItems[] {
                  text,
                  "subUrl": select(
                    defined(navigationItemUrl.internalLink) => navigationItemUrl.internalLink->seo.pagePath,
                    navigationItemUrl.externalUrl
                  ),
                  "openInNewTab": navigationItemUrl.openInNewTab
                }
              }
            }
          }
        }
      }
    }
  }
`

// Header Menu Query Function
export const headerQuery = async (client: any, menuTitle: string) => {
  return await client.fetch(headerQueryString, { menuTitle });
}

// Blog Queries
export const blogsQuery = groq`
  *[_type == "blogs"] | order(publishDate desc, _createdAt desc) {
    _id,
    title,
    slug,
    resourceId,
    excerpt,
    mainImage,
    publishDate,
    isSticky,
    featuredBlog,
    blogsAuthor->{
      name,
      slug,
      image
    }
  }
`

export const featuredBlogsQuery = groq`
  *[_type == "blogs" && featuredBlog == true] | order(publishDate desc, _createdAt desc) {
    _id,
    title,
    slug,
    resourceId,
    excerpt,
    mainImage,
    publishDate,
    blogsAuthor->{
      name,
      slug,
      image
    }
  }
`

export const blogBySlugQuery = groq`
  *[_type == "blogs" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    resourceId,
    excerpt,
    mainImage,
    publishDate,
    mainContent,
    content,
    isSticky,
    featuredBlog,
    blogsAuthor->{
      name,
      slug,
      image,
      bio
    }
  }
`

export const blogSlugsQuery = groq`
  *[_type == "blogs" && defined(slug.current)]{
    "slug": slug.current
  }
`

// Event Queries
export const eventsQuery = groq`
  *[_type == "events"] | order(startDate desc, _createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    startDate,
    endDate,
    eventTime,
    location,
    isVirtual,
    registrationLink,
    isSticky,
    featuredEvent
  }
`

export const upcomingEventsQuery = groq`
  *[_type == "events" && startDate >= now()] | order(startDate asc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    startDate,
    endDate,
    eventTime,
    location,
    isVirtual,
    registrationLink,
    featuredEvent
  }
`

export const pastEventsQuery = groq`
  *[_type == "events" && startDate < now()] | order(startDate desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    startDate,
    endDate,
    eventTime,
    location,
    isVirtual,
    registrationLink,
    featuredEvent
  }
`

export const eventBySlugQuery = groq`
  *[_type == "events" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    startDate,
    endDate,
    eventTime,
    location,
    isVirtual,
    registrationLink,
    mainContent,
    isSticky,
    featuredEvent
  }
`

export const eventSlugsQuery = groq`
  *[_type == "events" && defined(slug.current)]{
    "slug": slug.current
  }
`

// News Queries
export const newsQuery = groq`
  *[_type == "news"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    isSticky,
    featuredNews,
    category->{
      title,
      slug
    }
  }
`

export const featuredNewsQuery = groq`
  *[_type == "news" && featuredNews == true] | order(_createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category->{
      title,
      slug
    }
  }
`

export const newsBySlugQuery = groq`
  *[_type == "news" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    mainContent,
    isSticky,
    featuredNews,
    category->{
      title,
      slug,
      description
    }
  }
`

export const newsSlugsQuery = groq`
  *[_type == "news" && defined(slug.current)]{
    "slug": slug.current
  }
`

export const relatedNewsQuery = groq`
  *[_type == "news" && _id != $currentId && category._ref in $categories] | order(_createdAt desc) [0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category->{
      title,
      slug
    }
  }
`

// Page Queries
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    "featuredImage": heroSection.backgroundImage,
    "content": mainContent,
    sections,
    heroSection,
    mainContent {
      rows[] {
        ...,
        column1[] {
          ...,
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        },
        column2[] {
          ...,
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        },
        column3[] {
          ...,
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        }
      }
    },
    seo {
      ...,
      parentPage->{
        _id,
        title,
        slug,
        seo {
          parentPage->{
            _id,
            title,
            slug,
            seo {
              parentPage->{
                _id,
                title,
                slug
              }
            }
          }
        }
      }
    },
    showSocialShare,
    noIndex,
    include_in_sitemap
  }
`

// projectBySlugQuery 

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    date,
    isWIP,
    image { asset-> { _id, url } },
    description,
    fullDescription,
    techStack[] {
      name,
      icon { asset-> { _id, url } }
    },
    liveLink,
    githubLink
  }
`

export const pageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)]{
    slug,
    seo {
      pagePath
    }
  }
`

export const allPagesQuery = groq`
  *[_type == "page"] {
    _id,
    title,
    slug,
    include_in_sitemap,
    noIndex,
    _updatedAt,
    seo {
      pagePath,
      parentPage->{
        _id,
        title,
        slug
      }
    }
  }
`

// Category Queries
export const categoriesQuery = groq`
  *[_type == "categories"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    assignTo
  }
`

export const blogCategoriesQuery = groq`
  *[_type == "categories" && assignTo == "blog"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

export const newsCategoriesQuery = groq`
  *[_type == "categories" && assignTo == "news"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

// Tag Queries
export const tagsQuery = groq`
  *[_type == "tags"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

// FAQ Queries
export const faqsQuery = groq`
  *[_type == "faqs"] | order(isSticky desc, _createdAt desc) {
    _id,
    question,
    answer,
    isSticky,
    featuredFaq,
    category->{
      title,
      slug
    }
  }
`

export const faqCategoriesQuery = groq`
  *[_type == "faqCategories"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

// Author Queries
export const blogAuthorsQuery = groq`
  *[_type == "blogsAuthor" && assignTo == "blog"] | order(name asc) {
    _id,
    name,
    slug,
    image,
    bio
  }
`

export const authorBySlugQuery = groq`
  *[_type == "blogsAuthor" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio
  }
`

// Search Queries
export const getSearchQuery = groq`
  {
    "blogs": *[
      _type == "blogs" &&
      (
        title match "*" + $query + "*" ||
        excerpt match "*" + $query + "*" ||
        pt::text(content) match "*" + $query + "*" ||
        pt::text(mainContent) match "*" + $query + "*"
      )
    ] | order(_score desc, publishDate desc) [0...$limit] {
      _id,
      _type,
      title,
      slug,
      excerpt,
      "featuredImage": mainImage,
      "publishedAt": publishDate,
      _createdAt,
      _updatedAt,
      blogsAuthor->{
        name,
        slug
      },
      "categories": categories[]->{
        title,
        slug
      }
    },
    "news": *[
      _type == "news" &&
      (
        title match "*" + $query + "*" ||
        excerpt match "*" + $query + "*" ||
        pt::text(mainContent) match "*" + $query + "*"
      )
    ] | order(_score desc, _createdAt desc) [0...$limit] {
      _id,
      _type,
      title,
      slug,
      excerpt,
      "featuredImage": mainImage,
      "publishedAt": _createdAt,
      _createdAt,
      _updatedAt,
      "categories": [category]->{
        title,
        slug
      }
    },
    "events": *[
      _type == "events" &&
      (
        title match "*" + $query + "*" ||
        excerpt match "*" + $query + "*" ||
        pt::text(mainContent) match "*" + $query + "*"
      )
    ] | order(_score desc, startDate asc) [0...$limit] {
      _id,
      _type,
      title,
      slug,
      excerpt,
      "featuredImage": mainImage,
      startDate,
      endDate,
      location,
      isVirtual,
      _createdAt,
      _updatedAt
    },
    "pages": *[
      _type == "page" &&
      (
        title match "*" + $query + "*" ||
        excerpt match "*" + $query + "*" ||
        pt::text(mainContent) match "*" + $query + "*"
      )
    ] | order(_score desc, _createdAt desc) [0...$limit] {
      _id,
      _type,
      title,
      slug,
      excerpt,
      "featuredImage": heroSection.backgroundImage,
      _createdAt,
      _updatedAt
    }
  }
`

// Sitemap Queries
export const getSitemapQuery = groq`
  {
    "pages": *[_type == "page" && include_in_sitemap == true] {
      slug,
      _updatedAt
    },
    "blogs": *[_type == "blogs"] {
      slug,
      _updatedAt
    },
    "events": *[_type == "events"] {
      slug,
      _updatedAt
    },
    "news": *[_type == "news"] {
      slug,
      _updatedAt
    }
  }
`

  // Home Page Query
export const homePageQuery = groq`
  *[_type == "page" && slug.current == "home"][0] {
    _id,
    title,
    slug,
    excerpt,
    "featuredImage": heroSection.backgroundImage,
    sections,
    heroSection,
    mainContent {
      rows[] {
        ...,
        column1[] {
          ...,
          techTags,
          resumeUrl { asset-> { _id, url } },
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        },
        column2[] {
          ...,
          techTags,
          resumeUrl { asset-> { _id, url } },
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        },
        column3[] {
          ...,
          techTags,
          resumeUrl { asset-> { _id, url } },
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        }
      }
    },
    seo {
      ...,
      parentPage->{
        _id,
        title,
        slug
      }
    },
    showSocialShare,
    noIndex,
    include_in_sitemap
  }
`

// Hierarchical Page Queries
export const pageWithHierarchyQuery = groq`
  *[_type == "page" && (slug.current == $slug || seo.pagePath == $slug)][0] {
    _id,
    title,
    slug,
    excerpt,
    "featuredImage": heroSection.backgroundImage,
    "content": mainContent,
    sections,
    heroSection,
    mainContent {
      rows[] {
        ...,
        column1[] {
          ...,
          techTags,
          resumeUrl { asset-> { _id, url } },
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        },
        column2[] {
          ...,
          techTags,
          resumeUrl { asset-> { _id, url } },
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        },
        column3[] {
          ...,
          techTags,
          resumeUrl { asset-> { _id, url } },
          projects[]-> {
            _id,
            slug,
            name,
            date,
            isWIP,
            image { asset-> { _id, url } },
            description,
            fullDescription,
            techStack[] {
              name,
              icon { asset-> { _id, url } }
            },
            liveLink,
            githubLink
          }
        }
      }
    },
    seo {
      ...,
      parentPage->{
        _id,
        title,
        slug,
        seo {
          pagePath,
          parentPage->{
            _id,
            title,
            slug,
            seo {
              pagePath,
              parentPage->{
                _id,
                title,
                slug,
                seo {
                  pagePath
                }
              }
            }
          }
        }
      }
    },
    showSocialShare,
    noIndex,
    include_in_sitemap
  }
`

// Get child pages
export const getChildPagesQuery = groq`
  *[_type == "page" && seo.parentPage._ref == $parentId] | order(title asc) {
    _id,
    title,
    slug,
    excerpt,
    "featuredImage": heroSection.backgroundImage,
    seo {
      pagePath
    }
  }
`

// Get page breadcrumbs
export const getPageBreadcrumbsQuery = groq`
  *[_type == "page" && _id == $pageId][0] {
    _id,
    title,
    slug,
    seo {
      pagePath,
      parentPage->{
        _id,
        title,
        slug,
        seo {
          pagePath,
          parentPage->{
            _id,
            title,
            slug,
            seo {
              pagePath,
              parentPage->{
                _id,
                title,
                slug,
                seo {
                  pagePath
                }
              }
            }
          }
        }
      }
    }
  }
`

// Blocks Queries (for hierarchical content blocks)
export const blockBySlugQuery = groq`
  *[_type == "blocks" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainContent,
    seo {
      ...,
      parentPage->{
        _id,
        title,
        slug,
        seo {
          pagePath,
          parentPage->{
            _id,
            title,
            slug,
            seo {
              pagePath
            }
          }
        }
      }
    }
  }
`

// Get all page paths for dynamic routing
export const getAllPagePathsQuery = groq`
  {
    "pages": *[_type == "page" && defined(slug.current)] {
      _id,
      title,
      slug,
      seo {
        pagePath
      }
    },
    "blocks": *[_type == "blocks" && defined(slug.current)] {
      _id,
      title,
      slug,
      seo {
        pagePath
      }
    }
  }
`

// footer query

export const footerMenuQuery = groq`
  *[_type == "navigationMenu" && title == "FooterMenu"][0] {
    _id,
    title,
    items[] {
      text,
      link,
      subNavigationItems[] {
        text,
        subUrl
      }
    }
  }
`

// Helper function to get site settings
export const getSiteSettings = siteSettingsQuery

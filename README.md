# Agency Website - MCP Development Setup

A modern, component-driven agency website built with **Model Context Protocols (MCP)** for seamless Figma-to-code workflow. Built on Next.js 14, TypeScript, Tailwind CSS v4, and Sanity CMS with comprehensive form validation and PWA capabilities.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🎨 Design System & Components](#-design-system--components)
- [📝 Form System](#-form-system)
- [🗄️ Sanity CMS Integration](#️-sanity-cms-integration)
- [🔧 Development Guidelines](#-development-guidelines)
- [🚀 Available Scripts](#-available-scripts)
- [🆘 Troubleshooting](#-troubleshooting)
- [📚 Additional Resources](#-additional-resources)

## 🎯 Project Overview

### Purpose of MCP Integration
This project leverages **Model Context Protocols (MCP)** to create a streamlined development workflow that:
- **Maps Figma design tokens** directly to Tailwind CSS variables
- **Generates components** from Figma designs with consistent styling
- **Maintains design system integrity** across all components
- **Reduces design-to-code friction** through automated token mapping
- **Ensures pixel-perfect implementation** of Figma designs

### Technology Stack
- **Next.js 14** with App Router and Server Components
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS v4** with MCP-aligned design tokens
- **Sanity CMS** for headless content management
- **React Hook Form + Zod** for form validation
- **PWA capabilities** with service worker and manifest

## 🚀 Quick Start

### ⚠️ Important Development Guidelines

**Component Integration Rules:**

### Adding a New UI Component and Schema

When creating a new UI component, follow these steps in order:

1. **Create a UI Component**
   - Add your new component in `/src/components/ui/`
   - Example: `/src/components/ui/MyComponent.tsx`
   - Use proper TypeScript interfaces
   - Handle Sanity image URLs using `imageUrlBuilder` if needed
   - **Use Tailwind design system variables instead of hardcoded values** - Check `globals.css` and `tailwind.config.js` for available variables
     - Colors: Use `text-brand-colors-primary-adenine-green` instead of `text-[#20d340]`
     - Typography: Use `text-f-size-xxl` instead of `text-[40px]`
     - Spacing: Use design system spacing variables when available
     - Border radius: Use `rounded-border-radius-full` instead of `rounded-[20px]`

2. **Create the Component Schema**
   - Add your schema in `/studio/schemas/objects/`
   - Example: `/studio/schemas/objects/myComponent.ts`
   - Use `defineField` and `defineType` from Sanity
   - Include proper validation rules and preview configuration

3. **Register the Schema in Objects Index**
   - Import and add your schema to `/studio/schemas/objects/index.ts`
   - Add it to the appropriate section in the `objectSchemas` array

4. **Add to Row Schema**
   - In `/studio/schemas/objects/rowSchema.ts`, add your schema type to the `of` array in the `createColumnBlocks` function
   - Example: `{ type: 'myComponent' }`

5. **Integrate in PageContent**
   - Open `/src/components/ui/PageContent.tsx`
   - Import your component at the top
   - Add a new case in the `RenderBlock` function switch statement:
     ```tsx
     case 'myComponent':
       return <MyComponent key={index} {...block} />;
     ```

6. **DO NOT create example data files** - Components should be documented through proper TypeScript interfaces and Sanity schema definitions

**Important Notes:**
- NO components should be added to PortableTextRenderer - Components are integrated through PageContent only
- **Always use Tailwind design system variables when available** instead of hardcoded values (colors, fonts, spacing, etc.)
- Use Figma naming conventions for all CSS variables and design tokens
- Follow design system variables exactly as defined in Figma (e.g., `brand-colors-light-grayish-cyan`, `f-size-xxxl`)
- Check `globals.css` and `tailwind.config.js` for available Tailwind variables before using arbitrary values
- Maintain consistency between Figma variables and CSS custom properties

### 🎨 Figma-to-Code Workflow

This project uses **Model Context Protocols (MCP)** for seamless Figma-to-code translation. Follow these steps when creating components from Figma designs:

#### Step 1: Extract Figma Design Information
```bash
# Get the Figma design node ID from URL
# Example: https://www.figma.com/design/DIU4qXbrOp6i4IJ71FQEnv/Synthego---WebDev?node-id=10378-1273&m=dev
# Node ID: 10378:1273
```

#### Step 2: Analyze Figma Variables
- Use MCP tools to extract Figma variables: `mcp_figma_dev_mod_get_variable_defs`
- Only create CSS variables for **actual Figma variables**
- Use direct values (e.g., `#d1d1d1`, `20px`) when they're not defined as variables in Figma

#### Step 3: Update CSS Variables (globals.css)
```css
/* Only add variables that exist in Figma UI Kit */
:root {
  --brand-colors-light-grayish-cyan: #f4f9fa;
  --spacing-4xl: 80px;
  --border-radius-20: 20px;
  /* DO NOT create: --d1d1d1: #d1d1d1 (use direct value instead) */
}
```

#### Step 4: Update Tailwind Config
```javascript
// tailwind.config.js
extend: {
  colors: {
    'brand-colors-light-grayish-cyan': 'var(--brand-colors-light-grayish-cyan)'
  },
  spacing: {
    'spacing-4xl': 'var(--spacing-4xl)'
  },
  borderRadius: {
    'border-radius-20': 'var(--border-radius-20)'
  }
}
```

#### Step 5: Component Implementation Rules
1. **Use Figma variable names** when they exist in the design system
2. **Use direct values** for colors/sizes not defined as variables
3. **Use standard Tailwind classes** for common utilities
4. **Follow exact Figma structure** for layouts and spacing

**Example: Correct Implementation**
```tsx
// ✅ Correct - Uses Figma variable
<div className="bg-brand-colors-light-grayish-cyan">

// ✅ Correct - Uses direct value (no Figma variable)
<div className="border-[#d1d1d1]">

// ✅ Correct - Uses standard Tailwind class
<div className="text-neutral-800">

// ❌ Wrong - Creates unnecessary variable
<div className="bg-d1d1d1">
```

#### Step 6: Testing and Validation
1. Create a static version with sample data first
2. Test all Tailwind classes are working
3. Verify pixel-perfect match with Figma design
4. Then integrate with dynamic data (Sanity CMS)

### 🎨 Tailwind Class Usage Guidelines

#### Priority Order for Styling Components

When creating components, follow this strict priority order:

1. **Use Standard Tailwind Classes First**
   ```tsx
   // ✅ Prefer standard Tailwind utilities
   <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
   <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
   <h1 className="text-2xl font-bold text-gray-800">
   ```

2. **Check Existing CSS Variables Before Creating New Ones**
   ```tsx
   // ✅ Use existing variables if value matches
   // If Figma shows #20d340 and we have --brand-colors-primary-adenine-green: #20d340
   <div className="bg-brand-colors-primary-adenine-green">

   // ✅ Use standard Tailwind if no exact variable exists
   // If Figma shows #3B82F6 but no variable exists, use standard class
   <div className="bg-blue-500">

   // ❌ Don't create unnecessary variables
   // Don't create --blue-500: #3B82F6 when bg-blue-500 exists
   ```

3. **Only Create New Variables When Necessary**
   ```tsx
   // ✅ Create variable only if:
   // - Value exists as Figma variable
   // - No equivalent Tailwind class exists
   // - Value is used multiple times in design system

   // Example: Figma has "Custom Brand Purple: #8B5CF6"
   // Add to CSS: --brand-colors-custom-purple: #8B5CF6
   // Use: className="bg-brand-colors-custom-purple"
   ```

4. **Use Arbitrary Values for One-off Cases**
   ```tsx
   // ✅ For unique values that don't need variables
   <div className="bg-[#F3E8FF] text-[#4C1D95]">
   <div className="w-[347px] h-[89px]">
   <div className="top-[24px] left-[16px]">
   ```

#### Decision Tree for Component Styling

```
Is the value in Figma?
├── Is it a Figma variable?
│   ├── YES → Does CSS variable exist with same value?
│   │   ├── YES → Use existing CSS variable class
│   │   └── NO → Create new CSS variable + Tailwind class
│   └── NO → Is there equivalent Tailwind class?
│       ├── YES → Use standard Tailwind class
│       └── NO → Use arbitrary value [value]
```

#### Practical Examples

**Example 1: Color from Figma**
```tsx
// Figma shows: Background color #20d340 (Adenine Green variable)
// Check: Do we have this variable? YES: --brand-colors-primary-adenine-green: #20d340
// ✅ Use: className="bg-brand-colors-primary-adenine-green"

// Figma shows: Text color #374151 (no Figma variable)
// Check: Standard Tailwind equivalent? YES: text-gray-700
// ✅ Use: className="text-gray-700"

// Figma shows: Border color #E5E7EB (no Figma variable)
// Check: Standard Tailwind equivalent? YES: border-gray-200
// ✅ Use: className="border-gray-200"
```

**Example 2: Spacing from Figma**
```tsx
// Figma shows: Padding 20px (spacing-lg variable)
// Check: Do we have this variable? YES: --spacing-lg: 20px
// ✅ Use: className="p-spacing-lg"

// Figma shows: Margin 16px (no Figma variable)
// Check: Standard Tailwind equivalent? YES: m-4 (16px)
// ✅ Use: className="m-4"

// Figma shows: Gap 12px (no Figma variable)
// Check: Standard Tailwind equivalent? YES: gap-3 (12px)
// ✅ Use: className="gap-3"
```

**Example 3: Typography from Figma**
```tsx
// Figma shows: Font size 24px (f-size-lg variable)
// Check: Do we have this variable? YES: --font-size-lg: 24px
// ✅ Use: className="text-f-size-lg"

// Figma shows: Font weight 500 (no Figma variable)
// Check: Standard Tailwind equivalent? YES: font-medium
// ✅ Use: className="font-medium"

// Figma shows: Line height 32px (no Figma variable, unusual value)
// Check: Standard Tailwind equivalent? NO
// ✅ Use: className="leading-[32px]"
```

#### Component Creation Checklist

Before writing any className:

- [ ] **Check Figma**: Is this value defined as a variable?
- [ ] **Check CSS Variables**: Do we have this exact value already?
- [ ] **Check Tailwind Defaults**: Is there a standard class for this?
- [ ] **Avoid Duplication**: Don't create variables for existing Tailwind values
- [ ] **Use Arbitrary Values**: For one-off, non-variable values

#### Common Mistakes to Avoid

```tsx
// ❌ Creating unnecessary variables
// Figma: #3B82F6 (no variable) → Don't create --blue-custom: #3B82F6
// ✅ Use: className="bg-blue-500"

// ❌ Not checking existing variables
// Figma: #20d340 → Don't use className="bg-[#20d340]"
// ✅ Use: className="bg-brand-colors-primary-adenine-green"

// ❌ Using arbitrary values for Figma variables
// Figma: 24px spacing (spacing-xl variable) → Don't use className="p-[24px]"
// ✅ Use: className="p-spacing-xl"

// ❌ Creating variables for standard Tailwind values
// Figma: 16px margin → Don't create --margin-16: 16px
// ✅ Use: className="m-4"
```

#### Best Practices Summary

1. **Always check existing resources first** before creating new variables
2. **Use semantic naming** for variables that match Figma exactly
3. **Prefer standard Tailwind** for common values (colors, spacing, typography)
4. **Create variables only for design system values** that aren't covered by Tailwind
5. **Use arbitrary values sparingly** for truly unique, one-off measurements
6. **Keep consistency** between Figma variable names and CSS variable names

### Prerequisites
- Node.js 18+
- npm or yarn
- Sanity account
- Figma access (for design token extraction)

### 1. Installation
```bash
git clone <repository-url>
cd agency-website/competition
npm install
```

### 2. Environment Setup
Create `.env.local` in the root directory:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
CONTACT_EMAIL=contact@agency.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_ga_id

# Security
CSP_NONCE_SECRET=your_random_secret_key

# Bundle Analysis
ANALYZE=false
BUNDLE_ANALYZE=browser
```

### 3. Start Development
```bash
npm run dev
# or for faster builds
npm run dev:turbo
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── contact/              # Contact form handler
│   │   ├── newsletter/           # Newsletter subscription
│   │   ├── events/register/      # Event registration
│   │   ├── comments/             # Comment system
│   │   └── search/               # Search API
│   ├── blog/                     # Blog pages
│   ├── events/                   # Events pages
│   ├── news/                     # News pages
│   ├── search/                   # Search results
│   ├── forms-demo/               # Form components demo
│   ├── [...slug]/                # Dynamic pages
│   ├── layout.tsx                # Root layout with SEO
│   ├── page.tsx                  # Homepage
│   ├── loading.tsx               # Global loading states
│   ├── error.tsx                 # Error boundaries
│   ├── not-found.tsx             # 404 page
│   ├── robots.txt/               # SEO robots.txt
│   └── sitemap.xml/              # Dynamic sitemap
├── components/                    # React components
│   ├── forms/                    # Form system (MCP-generated)
│   │   ├── FormComponents.tsx    # Base form components
│   │   ├── ContactForm.tsx       # Contact form
│   │   ├── NewsletterForm.tsx    # Newsletter subscription
│   │   ├── SearchForm.tsx        # Search with filters
│   │   ├── EventRegistrationForm.tsx # Event registration
│   │   ├── CommentForm.tsx       # Comment system
│   │   └── index.ts              # Form exports
│   ├── blog/                     # Blog components
│   ├── events/                   # Event components
│   ├── layout/                   # Layout components
│   ├── news/                     # News components
│   ├── search/                   # Search components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx            # Reusable button component
│   │   ├── Input.tsx             # Form input component
│   │   ├── Select.tsx            # Dropdown select component
│   │   ├── FormField.tsx         # Form field wrapper
│   │   ├── SubmitButton.tsx      # Form submit button
│   │   ├── Skeleton.tsx          # Base skeleton components
│   │   └── PageSkeletons.tsx     # Page-specific skeleton layouts
│   └── ServiceWorkerRegistration.tsx # PWA setup
├── hooks/                         # Custom React hooks
│   ├── useContentFilters.ts      # Content filtering
│   ├── useDebounce.ts            # Input debouncing
│   ├── usePagination.ts          # Pagination logic
│   └── useSearch.tsx             # Search functionality
├── lib/                          # Utilities and configurations
│   ├── queries.ts                # Sanity GROQ queries
│   ├── sanity.ts                 # Sanity client config
│   ├── validations.ts            # Zod validation schemas
│   ├── utils.ts                  # Utility functions
│   └── pageHierarchy.ts          # Page structure
├── types/                        # TypeScript definitions
│   └── sanity.ts                 # Sanity type definitions
└── middleware.ts                 # Next.js middleware

public/
├── manifest.json                 # PWA manifest
├── sw.js                        # Service worker
└── icons/                       # PWA icons

studio/                          # Sanity Studio (separate)
├── schemas/                     # Sanity schemas
├── deskStructure.js            # Studio structure
└── sanity.config.ts            # Studio configuration
```

## 🎨 Design System & Components

### Component Organization

```
components/
├── ui/              # Reusable UI components (buttons, inputs, cards)
├── forms/           # Form-specific components
├── layout/          # Layout components (header, footer, navigation)
├── blog/            # Blog-specific components
├── events/          # Event-specific components
├── news/            # News-specific components
└── search/          # Search-related components
```

### Naming Conventions

#### ✅ Good Naming Patterns
- **Components**: `PascalCase` (e.g., `BlogCard`, `EventRegistrationForm`)
- **Files**: `PascalCase.tsx` (e.g., `BlogCard.tsx`)
- **Props**: `camelCase` with descriptive names
- **CSS Classes**: Use Tailwind utilities, avoid custom classes
- **Variants**: Descriptive names (`primary`, `secondary`, `outline`)

#### ❌ Avoid These Patterns
- Generic names (`Component`, `Item`, `Thing`)
- Abbreviations (`Btn` instead of `Button`)
- Inconsistent casing
- Overly nested folder structures

### Creating New Components with MCP

#### 1. Extract Design Tokens from Figma
```bash
# Extract design tokens (colors, spacing, typography)
# This should be done through your MCP setup
# Tokens are automatically mapped to tailwind.config.js
```

#### 2. Create Component Structure
```tsx
// src/components/ui/NewComponent.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface NewComponentProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

export const NewComponent = React.memo<NewComponentProps>(({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Base styles using design tokens
        'rounded-md font-sans transition-all duration-200',
        // Variant styles
        {
          'bg-brand-500 text-white': variant === 'primary',
          'bg-surface-muted text-brand-700': variant === 'secondary',
        },
        // Size styles
        {
          'px-sm py-xs text-sm': size === 'sm',
          'px-md py-sm text-base': size === 'md',
          'px-lg py-md text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

NewComponent.displayName = 'NewComponent'
```

#### 3. Add to Component Index
```tsx
// src/components/ui/index.ts
export { NewComponent } from './NewComponent'
```

### Tailwind CSS + MCP Integration

### Design Token Mapping

Our `tailwind.config.js` is structured to align with MCP design tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // Brand colors mapped from Figma
      colors: {
        brand: {
          50: '#E3F2FD',   // Figma: Primary/50
          100: '#BBDEFB',  // Figma: Primary/100
          500: '#2196F3',  // Figma: Primary/Main
          900: '#0D47A1'   // Figma: Primary/900
        },
        surface: {
          DEFAULT: '#FFFFFF',  // Figma: Surface/Default
          muted: '#F8FAFC',   // Figma: Surface/Muted
          dark: '#1E293B'     // Figma: Surface/Dark
        },
        accent: {
          green: '#00B894',   // Figma: Accent/Success
          red: '#E17055',     // Figma: Accent/Error
          yellow: '#FDCB6E'   // Figma: Accent/Warning
        }
      },
      // Typography mapped from Figma
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],      // Figma: Body
        heading: ['Poppins', 'system-ui', 'sans-serif'] // Figma: Heading
      },
      // Spacing system from Figma
      spacing: {
        xs: '0.25rem',  // 4px - Figma: Spacing/XS
        sm: '0.5rem',   // 8px - Figma: Spacing/SM
        md: '1rem',     // 16px - Figma: Spacing/MD
        lg: '1.5rem',   // 24px - Figma: Spacing/LG
        xl: '2rem',     // 32px - Figma: Spacing/XL
      },
      // Border radius from Figma
      borderRadius: {
        sm: '4px',    // Figma: Radius/Small
        md: '8px',    // Figma: Radius/Medium
        lg: '16px',   // Figma: Radius/Large
        full: '9999px' // Figma: Radius/Full
      }
    }
  }
}
```

### ✅ Good Tailwind Usage with MCP

```tsx
// Using design tokens consistently
<button className="bg-brand-500 hover:bg-brand-600 text-white px-md py-sm rounded-md font-heading">
  Primary Button
</button>

// Responsive design with consistent spacing
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
  {/* Content */}
</div>

// Using surface colors for cards
<div className="bg-surface-muted border border-brand-100 rounded-lg p-lg">
  {/* Card content */}
</div>
```

### ❌ Bad Tailwind Usage (Avoid)

```tsx
// Don't use arbitrary values that don't match design tokens
<button className="bg-[#1234AB] px-[13px] py-[7px] rounded-[5px]">
  Bad Button
</button>

// Don't mix custom CSS with Tailwind
<div className="custom-card-style bg-blue-500">
  {/* Inconsistent styling */}
</div>

// Don't use non-semantic color names
<div className="bg-blue-500 text-red-600">
  {/* Should use brand-500 and accent-red */}
</div>
```

## 🗄️ Sanity CMS Integration

### Overview
This project uses Sanity CMS as a headless content management system for managing blog posts, events, news articles, and other dynamic content. The integration includes custom content blocks like InfoBox for rich content display.

### Content Block System

The project implements a flexible content block system that supports various content types:

#### InfoBox Content Block
```typescript
// studio/schemas/objects/infoBox.ts
export default {
  name: 'infoBox',
  title: 'Info Box',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/*'
      }
    },
    {
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string'
        },
        {
          name: 'url',
          title: 'Button URL',
          type: 'url'
        },
        {
          name: 'variant',
          title: 'Button Variant',
          type: 'string',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' }
            ]
          }
        }
      ]
    },
    {
      name: 'position',
      title: 'Position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
          { title: 'Center', value: 'center' }
        ]
      },
      initialValue: 'left'
    },
    {
      name: 'fullWidth',
      title: 'Full Width',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image'
    }
  }
}
```

#### TypeScript Types for Content Blocks
```typescript
// src/types/sanity.ts
export interface InfoBoxType {
  _type: 'infoBox'
  title?: string
  description?: string
  image?: SanityImageType
  video?: SanityVideoType
  button?: {
    text: string
    url: string
    variant?: 'primary' | 'secondary'
  }
  position?: 'left' | 'right' | 'center'
  fullWidth?: boolean
}

export interface PageContentType {
  _type: 'pageContent'
  sections?: SectionType[]
  mainContent?: PortableTextBlock[]
  content?: PortableTextBlock[]
}
```

### GROQ Query Structure

All Sanity queries are stored in `src/lib/queries.ts` with support for content blocks:

```typescript
// Basic content query with InfoBox support
export const blogsQuery = groq`
  *[_type == "blogs"] | order(publishDate desc, _createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishDate,
    featuredBlog,
    blogsAuthor->{
      name,
      slug,
      image
    }
  }
`

// Single item query with slug and content blocks
export const blogBySlugQuery = groq`
  *[_type == "blogs" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishDate,
    mainContent[]{
      ...,
      _type == "infoBox" => {
        _type,
        title,
        description,
        image,
        video,
        button,
        position,
        fullWidth
      }
    },
    content[]{
      ...,
      _type == "infoBox" => {
        _type,
        title,
        description,
        image,
        video,
        button,
        position,
        fullWidth
      }
    },
    blogsAuthor->{
      name,
      slug,
      image,
      bio
    }
  }
`

// Page query with hierarchical content support
export const pageWithHierarchyQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    sections[]{
      ...,
      rows[]{
        ...,
        columns[]{
          ...,
          content[]{
            ...,
            _type == "infoBox" => {
              _type,
              title,
              description,
              image,
              video,
              button,
              position,
              fullWidth
            }
          }
        }
      }
    },
    mainContent[]{
      ...,
      _type == "infoBox" => {
        _type,
        title,
        description,
        image,
        video,
        button,
        position,
        fullWidth
      }
    },
    content[]{
      ...,
      _type == "infoBox" => {
        _type,
        title,
        description,
        image,
        video,
        button,
        position,
        fullWidth
      }
    }
  }
`
```

### Adding New Document Types

#### 1. Define Schema in Studio
```typescript
// studio/schemas/documents/newDocumentType.ts
export default {
  name: 'newDocumentType',
  title: 'New Document Type',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'content',
      title: 'Content',
      type: 'blockContent'
    }
  ]
}
```

#### 2. Add TypeScript Types
```typescript
// src/types/sanity.ts
export interface NewDocumentType {
  _id: string
  _type: 'newDocumentType'
  title: string
  slug: { current: string }
  content: PortableTextBlock[]
  _createdAt: string
  _updatedAt: string
}
```

#### 3. Create GROQ Queries
```typescript
// src/lib/queries.ts
export const newDocumentTypesQuery = groq`
  *[_type == "newDocumentType"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    content,
    _createdAt
  }
`

export const newDocumentTypeBySlugQuery = groq`
  *[_type == "newDocumentType" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    _createdAt,
    _updatedAt
  }
`
```

### Content Block Components

This project includes specialized content block components for rich content display:

#### InfoBox Component
The InfoBox component displays structured content with images, videos, and interactive elements:

```tsx
// src/components/ui/InfoBox.tsx
interface InfoBoxProps {
  title?: string
  description?: string
  image?: SanityImageType
  video?: SanityVideoType
  button?: {
    text: string
    url: string
    variant?: 'primary' | 'secondary'
  }
  position?: 'left' | 'right' | 'center'
  fullWidth?: boolean
  className?: string
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  description,
  image,
  video,
  button,
  position = 'left',
  fullWidth = false,
  className
}) => {
  // Component renders media (image/video) with content
  // Supports flexible positioning and responsive layouts
}
```

#### Usage in Content Management
InfoBox components are integrated with Sanity CMS through the PageContent system:

```tsx
// src/components/ui/PageContent.tsx
const RenderBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block._type) {
    case 'infoBox':
      return (
        <InfoBox
          title={block.title}
          description={block.description}
          image={block.image}
          video={block.video}
          button={block.button}
          position={block.position}
          fullWidth={block.fullWidth}
        />
      )
    // Other block types...
  }
}
```

#### Content Integration
InfoBox components are rendered through the PortableTextRenderer for seamless CMS integration:

```tsx
// src/components/ui/PortableTextRenderer.tsx
export const PortableTextRenderer: React.FC<PortableTextRendererProps> = ({
  value,
  className
}) => {
  return (
    <PortableText
      value={value}
      components={{
        types: {
          infoBox: ({ value }) => (
            <InfoBox
              title={value.title}
              description={value.description}
              image={value.image}
              video={value.video}
              button={value.button}
              position={value.position}
              fullWidth={value.fullWidth}
            />
          ),
          // Other custom types...
        }
      }}
    />
  )
}
```

#### Features
- **Media Support**: Handles both images and videos with responsive layouts
- **Interactive Elements**: Includes button components with customizable actions
- **Flexible Positioning**: Supports left, right, and center alignment
- **Responsive Design**: Adapts to different screen sizes automatically
- **CMS Integration**: Seamlessly works with Sanity's content management
- **Type Safety**: Full TypeScript support with proper interfaces

#### 4. Create Page Components
```tsx
// src/app/new-document-types/page.tsx
import { sanityFetch } from '@/lib/sanity'
import { newDocumentTypesQuery } from '@/lib/queries'
import { NewDocumentType } from '@/types/sanity'

export default async function NewDocumentTypesPage() {
  const documents = await sanityFetch<NewDocumentType[]>({
    query: newDocumentTypesQuery
  })

  return (
    <div className="container mx-auto px-md py-lg">
      <h1 className="text-3xl font-heading mb-lg">New Document Types</h1>
      <div className="grid gap-md">
        {documents.map((doc) => (
          <div key={doc._id} className="bg-surface-muted rounded-lg p-md">
            <h2 className="text-xl font-heading mb-sm">{doc.title}</h2>
            {/* Render content */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 📝 Form System

### Form Components Overview

The form system includes:
- **Base Components**: Reusable form elements with validation
- **Specific Forms**: Contact, Newsletter, Search, Event Registration, Comments
- **Validation**: Zod schemas with sanitization
- **Security**: Rate limiting, spam detection, CSRF protection

### Creating a New Form

#### 1. Define Validation Schema
```typescript
// src/lib/validations.ts
export const newFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema,
  message: z.string().min(10).max(500),
  consent: z.boolean().refine(val => val === true)
})

export type NewFormData = z.infer<typeof newFormSchema>
```

#### 2. Create Form Component
```tsx
// src/components/forms/NewForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newFormSchema, type NewFormData } from '@/lib/validations'
import { Form, FormField, Input, Textarea, Checkbox, SubmitButton } from './FormComponents'

interface NewFormProps {
  onSubmit?: (data: NewFormData) => Promise<void>
  className?: string
}

export const NewForm: React.FC<NewFormProps> = ({ onSubmit, className }) => {
  const form = useForm<NewFormData>({
    resolver: zodResolver(newFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      consent: false
    }
  })

  const handleSubmit = async (data: NewFormData) => {
    if (onSubmit) {
      await onSubmit(data)
    } else {
      // Default API submission
      const response = await fetch('/api/new-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Submission failed')
    }
  }

  return (
    <Form form={form} onSubmit={handleSubmit} className={className}>
      <FormField label="Name" required>
        <Input {...form.register('name')} placeholder="Your name" />
      </FormField>

      <FormField label="Email" required>
        <Input {...form.register('email')} type="email" placeholder="your@email.com" />
      </FormField>

      <FormField label="Message" required>
        <Textarea {...form.register('message')} placeholder="Your message" rows={4} />
      </FormField>

      <FormField>
        <Checkbox {...form.register('consent')} label="I agree to the terms" />
      </FormField>

      <SubmitButton>Submit Form</SubmitButton>
    </Form>
  )
}
```

#### 3. Create API Endpoint
```typescript
// src/app/api/new-form/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { newFormSchema } from '@/lib/validations'
import { createValidationMiddleware } from '@/lib/validations'

const validateNewForm = createValidationMiddleware(newFormSchema)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = validateNewForm(body)

    // Process form submission
    console.log('New form submission:', validatedData)

    return NextResponse.json({
      message: 'Form submitted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid form data' },
      { status: 400 }
    )
  }
}
```

## 🔧 Development Guidelines

### Code Quality Standards

#### ✅ Component Best Practices

**InfoBox Component Integration**
```tsx
// Example of InfoBox usage in dynamic pages
import { InfoBox } from '@/components/ui/InfoBox'
import { PageContent } from '@/components/ui/PageContent'

// Dynamic page rendering with InfoBox support
export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await sanityFetch<PageType>({
    query: pageBySlugQuery,
    params: { slug: params.slug }
  })

  return (
    <main className="container mx-auto px-md py-lg">
      {/* Page content with InfoBox blocks */}
      <PageContent
        content={page.content}
        sections={page.sections}
        mainContent={page.mainContent}
      />
    </main>
  )
}
```

**Clear Interface Definition**
```tsx
interface ComponentProps {
  title: string
  description?: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
}

/**
 * BlogCard displays a blog post preview with image, title, excerpt, and metadata.
 * Used in blog listings and featured post sections.
 *
 * @example
 * <BlogCard
 *   post={blogPost}
 *   showFullExcerpt={true}
 *   onClick={(post) => router.push(`/blog/${post.slug}`)}
 * />
 */
export const BlogCard: React.FC<BlogCardProps> = ({ ... }) => {
  // Component implementation
}
```

**State Management**
```tsx
// Use proper state management
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// Handle async operations properly
const handleSubmit = useCallback(async (data: FormData) => {
  setIsLoading(true)
  setError(null)

  try {
    await submitData(data)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred')
  } finally {
    setIsLoading(false)
  }
}, [])
```

**Responsive Design**
```tsx
// Mobile-first responsive design
<div className="
  grid grid-cols-1 gap-md
  md:grid-cols-2 md:gap-lg
  lg:grid-cols-3 lg:gap-xl
">
  {/* Content */}
</div>
```

#### ❌ Anti-Patterns to Avoid

**Poor Component Structure**
```tsx
// ❌ Don't do this
function BadComponent(props: any) {
  return (
    <div style={{backgroundColor: '#123456', padding: '10px'}}>
      {props.children}
    </div>
  )
}
```

**Inline Styles**
```tsx
// ❌ Avoid inline styles
<div style={{marginTop: '20px', color: 'red'}}>
  Content
</div>

// ✅ Use Tailwind classes
<div className="mt-lg text-accent-red">
  Content
</div>
```

**Poor Error Handling**
```tsx
// ❌ Don't ignore errors
const fetchData = async () => {
  const response = await fetch('/api/data')
  const data = await response.json() // Could throw
  return data
}

// ✅ Handle errors properly
const fetchData = async () => {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
```

### Testing Guidelines

- Write unit tests for utility functions
- Test component rendering and user interactions
- Use meaningful test descriptions
- Mock external dependencies appropriately
- Maintain good test coverage

### Performance Considerations

- Use React.memo for expensive components
- Implement proper code splitting
- Optimize images and assets
- Minimize bundle size
- Use proper caching strategies

## 🎨 Design System Variables

### Figma Variables Integration

All design variables are extracted from Figma and integrated into the CSS and Tailwind configuration using the exact same variable names as defined in Figma.

#### Current Figma Variables (globals.css)

```css
:root {
  /* Brand Colors */
  --brand-colors-primary-black: #000000;
  --brand-colors-primary-white: #ffffff;
  --brand-colors-primary-adenine-green: #20d340;
  --brand-colors-primary-cytosine-blue: #00d1ed;
  --brand-colors-neutrals-gray-200: #d1d1d1;
  --brand-colors-neutrals-gray-300: #aaaaaa;
  --brand-colors-neutrals-gray-400: #707070;
  --brand-colors-neutrals-gray-500: #505050;
  --brand-colors-light-grayish-cyan: #f4f9fa;
  --brand-colors-light-gray: #e0e0e0;
  --very-light-green: #f0fff4;
  --text: #262626;
  --heading-color-1: #262626;
  --heading-color-2: #ffffff;
  --heading-color-1-alt: #707070;

  /* Font Sizes */
  --font-size-xxxs: 12px;
  --font-size-xxs: 14px;
  --font-size-xs: 16px;
  --font-size-sm: 18px;
  --font-size-md: 20px;
  --font-size-lg: 24px;
  --font-size-xl: 28px;
  --font-size-xxl: 40px;
  --font-size-xxxl: 56px;
  --font-size-6xl: 100px;
  --paragraph-f-size: 18px;

  /* Line Heights */
  --line-height-f-size-xxxs: 20px;
  --line-height-f-size-xxs: 22px;
  --line-height-f-size-xs: 26px;
  --line-height-f-size-sm: 28px;
  --line-height-f-size-md: 30px;
  --line-height-f-size-lg: 34px;
  --line-height-f-size-xl: 42px;
  --line-height-f-size-xxl: 54px;
  --line-height-f-size-xxxl: 64px;
  --line-height-f-size-6xl: 100px;
  --paragraph-line-height: 28px;

  /* Font Families */
  --font-family-primary: "Runda";
  --font-family-secondary: "Open Sans";
  --font-family-special-case: "Roboto Mono";

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-xxxs: 2px;
  --spacing-xxs: 4px;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 20px;
  --spacing-xl: 24px;
  --spacing-xxl: 32px;
  --spacing-3xl: 40px;
  --spacing-4xl: 80px;
  --spacing-5xl: 112px;
  --spacing-7xl: 160px;

  /* Border Radius */
  --border-radius-mid: 8px;
  --border-radius-full: 20px;

  /* Paragraph Spacing */
  --paragraph-spacing: 15px;

  /* Grid Variables */
  --grid-column-count: 12;
}

/* Mobile Responsive Overrides (max-width: 768px) */
@media (max-width: 768px) {
  :root {
    /* Font Sizes - Mobile adjustments */
    --font-size-6xl: 60px;
    --font-size-xxxl: 40px;
    --font-size-xxl: 32px;
    --font-size-xl: 24px;
    --font-size-lg: 20px;
    --font-size-md: 18px;
    --font-size-sm: 16px;
    --font-size-xs: 14px;

    /* Line Heights - Mobile adjustments */
    --line-height-f-size-6xl: 68px;
    --line-height-f-size-xxxl: 48px;
    --line-height-f-size-xxl: 40px;
    --line-height-f-size-xl: 32px;
    --line-height-f-size-lg: 28px;
    --line-height-f-size-md: 26px;
    --line-height-f-size-sm: 24px;
    --line-height-f-size-xs: 22px;

    /* Spacing - Mobile adjustments */
    --spacing-7xl: 80px;
    --spacing-5xl: 64px;
    --spacing-4xl: 48px;
    --spacing-3xl: 24px;
    --spacing-xxl: 20px;
    --spacing-xl: 16px;
    --spacing-lg: 14px;
    --spacing-md: 12px;
    --spacing-sm: 8px;
    --spacing-xs: 6px;
    --spacing-xxs: 3px;
    --spacing-xxxs: 2px;
  }
}
```

#### Tailwind Configuration Integration

All variables are mapped to Tailwind utility classes in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'brand-colors-primary-black': 'var(--brand-colors-primary-black)',
      'brand-colors-primary-white': 'var(--brand-colors-primary-white)',
      'brand-colors-primary-adenine-green': 'var(--brand-colors-primary-adenine-green)',
      'brand-colors-primary-cytosine-blue': 'var(--brand-colors-primary-cytosine-blue)',
      // ... all brand colors
    },
    fontSize: {
      'f-size-xxxs': 'var(--font-size-xxxs)',
      'f-size-xxs': 'var(--font-size-xxs)',
      'f-size-xs': 'var(--font-size-xs)',
      // ... all font sizes
    },
    lineHeight: {
      'line-height-f-size-xxxs': 'var(--line-height-f-size-xxxs)',
      // ... all line heights
    },
    fontFamily: {
      'font-family-primary': 'var(--font-family-primary)',
      'font-family-secondary': 'var(--font-family-secondary)',
      'font-family-special-case': 'var(--font-family-special-case)',
    },
    spacing: {
      'spacing-xxxs': 'var(--spacing-xxxs)',
      'spacing-xxs': 'var(--spacing-xxs)',
      // ... all spacing values
    },
    borderRadius: {
      'border-radius-mid': 'var(--border-radius-mid)',
      'border-radius-full': 'var(--border-radius-full)',
    },
  }
}
```

#### Usage Examples

Now you can use these variables in your Tailwind classes with automatic mobile responsive adjustments:

```tsx
// Colors
<div className="bg-brand-colors-primary-adenine-green text-brand-colors-primary-white">
  Content
</div>

// Typography with responsive sizing
<h1 className="text-f-size-6xl leading-line-height-f-size-6xl font-font-family-primary">
  Large Heading (100px desktop, 60px mobile)
</h1>

// Spacing with responsive adjustments
<div className="p-spacing-lg m-spacing-xl">
  Responsive spacing (20px/14px padding, 24px/16px margin)
</div>

// Border radius
<button className="rounded-border-radius-mid bg-brand-colors-primary-cytosine-blue">
  Button with 8px border radius
</button>

// Complex component with multiple variables
<section className="bg-brand-colors-light-grayish-cyan p-spacing-4xl">
  <h2 className="text-f-size-xxxl leading-line-height-f-size-xxxl font-font-family-primary text-heading-color-1">
    Section Title
  </h2>
  <p className="text-paragraph-f-size leading-paragraph-line-height font-font-family-secondary text-text">
    Paragraph content with proper typography
  </p>
</section>
```

#### Variable Naming Convention

- **Use exact Figma variable names**: Variable names match exactly what's defined in Figma
- **Automatic responsive behavior**: Mobile overrides are applied automatically at max-width: 768px
- **CSS Custom Properties**: All variables are CSS custom properties for maximum flexibility
- **Tailwind Integration**: All variables are available as Tailwind utility classes

### Skeleton Loading System

The project includes a comprehensive skeleton loading system for better UX during data fetching:

#### Base Skeleton Components
- `Skeleton` - Basic skeleton element with shimmer animation
- `SkeletonText` - Multi-line text skeleton with configurable lines
- `SkeletonCard` - Card layout skeleton with image and content areas
- `SkeletonHeader` - Navigation header skeleton
- `SkeletonHero` - Hero section skeleton with title and subtitle

#### Page-Specific Skeletons
- `BlogPageSkeleton` - Blog listing page with grid layout
- `EventsPageSkeleton` - Events listing page with filters
- `NewsPageSkeleton` - News page with sidebar layout
- `SearchPageSkeleton` - Search results page with filters
- `FormsPageSkeleton` - Forms demo page layout
- `ArticleDetailSkeleton` - Individual article/post detail page
- `DashboardSkeleton` - Dashboard layout with cards and charts

#### Usage Examples
```tsx
// In loading.tsx files
import { BlogPageSkeleton } from '@/components/ui/PageSkeletons'

export default function Loading() {
  return <BlogPageSkeleton />
}

// Custom skeleton composition
import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/Skeleton'

function CustomSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <SkeletonText lines={3} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

// Conditional skeleton loading
function DataComponent({ data, isLoading }: { data?: any[], isLoading: boolean }) {
  if (isLoading) {
    return <BlogPageSkeleton />
  }

  return (
    <div>
      {data?.map(item => <ItemComponent key={item.id} item={item} />)}
    </div>
  )
}
```

#### Skeleton Features
- **Responsive Design**: All skeletons adapt to different screen sizes
- **Shimmer Animation**: Smooth loading animation using CSS gradients
- **Accessibility**: Proper ARIA labels and screen reader support
- **Customizable**: Easy to modify colors, sizes, and layouts
- **Performance**: Lightweight components with minimal re-renders

### Using Design Tokens

```tsx
// ✅ Use semantic color names
<div className="bg-brand-500 text-white">
  Primary content
</div>

// ✅ Use consistent spacing
<div className="p-md mb-lg">
  Consistent spacing
</div>

// ✅ Use typography scale
<h1 className="font-heading text-3xl">
  Heading
</h1>
<p className="font-sans text-base">
  Body text
</p>
```

### Quick Onboarding

1. **Clone and Setup** (5 minutes)
   ```bash
   git clone <repo>
   cd agency-website/competition
   npm install
   cp .env.example .env.local
   # Fill in environment variables
   npm run dev
   ```

2. **Understand the Structure** (10 minutes)
   - Review `src/components/` for existing components
   - Check `src/lib/queries.ts` for Sanity queries
   - Examine `tailwind.config.js` for design tokens
   - Look at `src/app/forms-demo/` for form examples

3. **Create Your First Component** (15 minutes)
   - Follow the component creation guide above
   - Use existing patterns from similar components
   - Test in isolation using the demo pages

### Contributing New Components

1. **Check for Duplicates**
   ```bash
   # Search for similar components
   grep -r "ComponentName" src/components/
   ```

2. **Follow Naming Conventions**
   - Use descriptive, specific names
   - Follow existing patterns in the codebase
   - Add proper TypeScript types

3. **Test Component**
   - Create a demo page or add to existing demo
   - Test responsive behavior
   - Verify accessibility

4. **Document Usage**
   - Add JSDoc comments
   - Include usage examples
   - Document props and variants

### Component Documentation

#### Recent Component Additions

**InfoBox Component (Latest)**
- **Purpose**: Rich content display with media support and interactive elements
- **Features**: Image/video rendering, button integration, flexible positioning
- **Integration**: Works with Sanity CMS through PageContent and PortableTextRenderer
- **Usage**: Ideal for feature highlights, product showcases, call-to-action sections

**PageContent Component (Enhanced)**
- **Purpose**: Central content rendering system for all page types
- **Features**: Row/column layout management, content block switching
- **Integration**: Handles sections, mainContent, and content data structures
- **Usage**: Primary component for dynamic page rendering

**PortableTextRenderer (Updated)**
- **Purpose**: Custom block type rendering for Sanity portable text
- **Features**: InfoBox block support, extensible type system
- **Integration**: Seamlessly renders custom content blocks
- **Usage**: Used within InfoBox and PageContent for rich text display

#### Component Testing

#### Isolation Testing
```tsx
// Create a test page for your component
// src/app/component-test/page.tsx
import { YourComponent } from '@/components/ui/YourComponent'

export default function ComponentTestPage() {
  return (
    <div className="p-lg space-y-lg">
      <h1 className="text-2xl font-heading">Component Test</h1>

      <section>
        <h2 className="text-lg font-heading mb-md">Default</h2>
        <YourComponent>Default content</YourComponent>
      </section>

      <section>
        <h2 className="text-lg font-heading mb-md">Variants</h2>
        <div className="space-y-md">
          <YourComponent variant="primary">Primary variant</YourComponent>
          <YourComponent variant="secondary">Secondary variant</YourComponent>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-heading mb-md">Sizes</h2>
        <div className="space-y-md">
          <YourComponent size="sm">Small size</YourComponent>
          <YourComponent size="md">Medium size</YourComponent>
          <YourComponent size="lg">Large size</YourComponent>
        </div>
      </section>
    </div>
  )
}
```

### Naming Rules to Prevent Duplication

1. **Search Before Creating**
   ```bash
   # Check if component exists
   find src/components -name "*Button*" -type f
   find src/components -name "*Card*" -type f
   ```

2. **Use Specific Names**
   - ✅ `BlogPostCard` instead of `Card`
   - ✅ `EventRegistrationForm` instead of `Form`
   - ✅ `PrimaryButton` instead of `Button`

3. **Follow Domain Patterns**
   - Blog components: `Blog*` (BlogCard, BlogList, BlogAuthor)
   - Event components: `Event*` (EventCard, EventForm, EventList)
   - Form components: `*Form` (ContactForm, SearchForm)

### Utility Classes vs Component Classes

#### When to Use Utility Classes
```tsx
// ✅ Simple styling
<div className="flex items-center justify-between p-md bg-surface-muted rounded-lg">
  Content
</div>

// ✅ One-off modifications
<Button className="w-full md:w-auto">
  Responsive button
</Button>
```

#### When to Create Component Classes
```tsx
// ✅ Complex, reusable patterns
const cardStyles = {
  base: 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
  hover: 'hover:shadow-md hover:border-brand-200 transition-all duration-200',
  focus: 'focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2'
}

// ✅ Multiple variants
const buttonVariants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white',
  secondary: 'bg-surface-muted hover:bg-surface-dark text-brand-700',
  outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-50'
}
```

### AI-Friendly Development

This codebase is optimized for AI assistance:

1. **Clear Patterns**: Consistent component structure for AI to learn
2. **Type Safety**: Strong TypeScript types help AI understand context
3. **Documentation**: Comprehensive comments and examples
4. **Conventions**: Clear naming and organization patterns

#### AI-Friendly Practices
```tsx
// ✅ Clear, descriptive interfaces
interface BlogCardProps {
  /** Blog post data from Sanity */
  post: BlogPost
  /** Whether to show the full excerpt */
  showFullExcerpt?: boolean
  /** Additional CSS classes */
  className?: string
  /** Click handler for the card */
  onClick?: (post: BlogPost) => void
}

/**
 * BlogCard displays a blog post preview with image, title, excerpt, and metadata.
 * Used in blog listings and featured post sections.
 *
 * @example
 * <BlogCard
 *   post={blogPost}
 *   showFullExcerpt={true}
 *   onClick={(post) => router.push(`/blog/${post.slug}`)}
 * />
 */
export const BlogCard: React.FC<BlogCardProps> = ({ ... }) => {
  // Component implementation
}
```

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:turbo        # Start with Turbo (faster)

# Building
npm run build            # Production build
npm run build:debug      # Debug build
npm run start            # Start production server

# Analysis
npm run analyze          # Bundle analysis
npm run analyze:server   # Server bundle analysis
npm run analyze:browser  # Browser bundle analysis

# Quality
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm run test:forms       # Form validation tests

# Utilities
npm run export           # Static export
```



## 📚 Additional Resources

### Demo Pages
- `/forms-demo` - Interactive form component showcase
- Visit these pages to see components in action

### Key Documentation Files
- `src/lib/validations.ts` - All validation schemas
- `src/lib/queries.ts` - Sanity GROQ queries
- `tailwind.config.js` - Design token configuration
- `next.config.ts` - Next.js configuration with security headers
- `public/manifest.json` - PWA manifest configuration

### External Resources
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Project Features

#### ✅ Implemented Features
- 🎨 **Design System**: MCP-aligned Tailwind CSS with Figma design tokens
- 📱 **PWA Support**: Service worker, manifest, offline capabilities
- 🔒 **Security**: CSP headers, input validation, rate limiting
- 📝 **Forms**: React Hook Form + Zod validation with comprehensive error handling
- 🗄️ **CMS**: Sanity integration with GROQ queries
- 🎭 **Loading States**: Comprehensive skeleton loading system
- 📊 **SEO**: Dynamic metadata, robots.txt, sitemap
- 🧪 **Testing**: Jest setup with TypeScript support
- 🔧 **Development**: ESLint, Prettier, pre-commit hooks
- 📱 **Responsive**: Mobile-first design with breakpoint system
- 📦 **Content Blocks**: InfoBox component for rich content display

#### 🚀 Performance Optimizations
- Bundle analysis with `@next/bundle-analyzer`
- Image optimization and validation
- Code splitting and lazy loading
- Efficient caching strategies
- Optimized build configuration

## 🆘 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npm run type-check
```

**Styling Issues**
```bash
# Verify Tailwind config
npx tailwindcss --help

# Check for conflicting styles
# Look for custom CSS overriding Tailwind
```

**Sanity Connection Issues**
```bash
# Verify environment variables
echo $NEXT_PUBLIC_SANITY_PROJECT_ID

# Test Sanity connection
# Check network tab in browser dev tools
```

**Form Validation Issues**
```bash
# Test validation schemas
# Check browser console for Zod errors

# Verify API endpoints
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Built with ❤️ using Model Context Protocols (MCP), Next.js 14, TypeScript, Tailwind CSS v4, and Sanity CMS**

*This README combines all project documentation into a single, comprehensive guide for MCP-based development workflows.*

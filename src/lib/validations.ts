import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address')
export const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
export const urlSchema = z.string().url('Please enter a valid URL')

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
  consent: z.boolean().refine(val => val === true, 'You must agree to the privacy policy')
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: emailSchema,
  preferences: z.array(z.string()).optional(),
  consent: z.boolean().refine(val => val === true, 'You must agree to receive newsletters')
})

export type NewsletterData = z.infer<typeof newsletterSchema>

// Search form validation
export const searchFormSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query must be less than 100 characters'),
  category: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['relevance', 'date', 'title']).optional()
})

export type SearchFormData = z.infer<typeof searchFormSchema>

// Event registration validation
export const eventRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  organization: z.string().max(100, 'Organization name must be less than 100 characters').optional(),
  dietaryRequirements: z.string().max(500, 'Dietary requirements must be less than 500 characters').optional(),
  accessibility: z.string().max(500, 'Accessibility requirements must be less than 500 characters').optional(),
  consent: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
})

export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>

// Comment form validation
export const commentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: emailSchema,
  website: urlSchema.optional().or(z.literal('')),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment must be less than 1000 characters'),
  parentId: z.string().optional()
})

export type CommentFormData = z.infer<typeof commentFormSchema>

// Admin forms validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export type LoginData = z.infer<typeof loginSchema>

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    'File size must be less than 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
    'File must be an image (JPEG, PNG, WebP) or PDF'
  ),
  alt: z.string().min(1, 'Alt text is required').max(200, 'Alt text must be less than 200 characters')
})

export type FileUploadData = z.infer<typeof fileUploadSchema>

// Sanitization helpers
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      }
      return entities[match] || match
    })
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s-_.]/g, '') // Remove special characters except word chars, spaces, hyphens, underscores, dots
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .substring(0, 100) // Limit length
}

// Rate limiting validation
export function validateRateLimit(requests: number, timeWindow: number, maxRequests: number): boolean {
  return requests <= maxRequests
}

// CSRF token validation
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken && token.length > 0
}

// Input validation middleware
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    try {
      const validatedData = schema.parse(data)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        return { success: false, errors }
      }
      return { success: false, errors: ['Validation failed'] }
    }
  }
}
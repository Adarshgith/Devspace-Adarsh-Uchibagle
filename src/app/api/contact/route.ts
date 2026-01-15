import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema, createValidationMiddleware, sanitizeInput } from '@/lib/validations'
import { headers } from 'next/headers'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string): string {
  return `contact_${ip}`
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5 // 5 requests per 15 minutes

  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime }
  }

  // Increment count
  current.count++
  rateLimitStore.set(key, current)
  return { allowed: true }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}

async function sendEmail(data: any) {
  // In a real application, integrate with email service like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Nodemailer with SMTP
  
  console.log('Sending email:', {
    to: process.env.CONTACT_EMAIL || 'contact@agency.com',
    from: data.email,
    subject: `Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted at: ${new Date().toISOString()}</small></p>
    `
  })
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request)
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Validate input
    const validator = createValidationMiddleware(contactFormSchema)
    const validation = validator(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const data = validation.data
    
    // Additional sanitization
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: data.phone ? sanitizeInput(data.phone) : undefined,
      subject: sanitizeInput(data.subject),
      message: sanitizeInput(data.message),
      consent: data.consent
    }

    // Check for spam patterns (basic)
    const spamPatterns = [
      /\b(viagra|cialis|casino|lottery|winner)\b/i,
      /\b(click here|act now|limited time)\b/i,
      /(http:\/\/|https:\/\/)[^\s]{10,}/g // Multiple URLs
    ]
    
    const messageText = `${sanitizedData.subject} ${sanitizedData.message}`.toLowerCase()
    const isSpam = spamPatterns.some(pattern => pattern.test(messageText))
    
    if (isSpam) {
      return NextResponse.json(
        { error: 'Message flagged as spam' },
        { status: 400 }
      )
    }

    // Send email
    await sendEmail(sanitizedData)
    
    // Log successful submission (in production, use proper logging)
    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      ip: clientIP,
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject
    })

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { newsletterSchema, createValidationMiddleware, sanitizeInput } from '@/lib/validations'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string): string {
  return `newsletter_${ip}`
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 3 // 3 requests per hour

  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime }
  }

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

// Newsletter subscriber storage (in production, use database)
const subscribers = new Map<string, {
  email: string
  preferences: string[]
  subscribedAt: string
  confirmed: boolean
  unsubscribeToken: string
}>()

function generateUnsubscribeToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

async function addSubscriber(email: string, preferences: string[] = []) {
  const unsubscribeToken = generateUnsubscribeToken()
  
  subscribers.set(email, {
    email,
    preferences,
    subscribedAt: new Date().toISOString(),
    confirmed: false,
    unsubscribeToken
  })
  
  // In a real application, integrate with email service to send confirmation
  console.log('Newsletter subscription:', {
    email,
    preferences,
    confirmationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/confirm?token=${unsubscribeToken}`
  })
  
  return { success: true, token: unsubscribeToken }
}

async function sendWelcomeEmail(email: string, preferences: string[]) {
  // In a real application, integrate with email service
  console.log('Sending welcome email:', {
    to: email,
    subject: 'Welcome to our Newsletter!',
    preferences,
    html: `
      <h2>Welcome to our Newsletter!</h2>
      <p>Thank you for subscribing to our newsletter. You'll receive updates based on your preferences:</p>
      <ul>
        ${preferences.map(pref => `<li>${pref}</li>`).join('')}
      </ul>
      <p>You can update your preferences or unsubscribe at any time.</p>
    `
  })
  
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
          error: 'Too many subscription attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Validate input
    const validator = createValidationMiddleware(newsletterSchema)
    const validation = validator(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const data = validation.data
    
    // Sanitize email
    const sanitizedEmail = sanitizeInput(data.email).toLowerCase()
    
    // Check if already subscribed
    if (subscribers.has(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      )
    }

    // Add subscriber
    const result = await addSubscriber(sanitizedEmail, data.preferences)
    
    if (!result.success) {
      throw new Error('Failed to add subscriber')
    }

    // Send welcome email
    await sendWelcomeEmail(sanitizedEmail, data.preferences || [])
    
    // Log successful subscription
    console.log('Newsletter subscription:', {
      timestamp: new Date().toISOString(),
      ip: clientIP,
      email: sanitizedEmail,
      preferences: data.preferences
    })

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter',
        confirmationRequired: true
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }
    
    const subscriber = subscribers.get(email.toLowerCase())
    
    if (!subscriber) {
      return NextResponse.json(
        { subscribed: false },
        { status: 200 }
      )
    }
    
    return NextResponse.json(
      { 
        subscribed: true,
        preferences: subscriber.preferences,
        confirmed: subscriber.confirmed,
        subscribedAt: subscriber.subscribedAt
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Newsletter status check error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')
    
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token parameters required' },
        { status: 400 }
      )
    }
    
    const subscriber = subscribers.get(email.toLowerCase())
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      )
    }
    
    if (subscriber.unsubscribeToken !== token) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 403 }
      )
    }
    
    // Remove subscriber
    subscribers.delete(email.toLowerCase())
    
    console.log('Newsletter unsubscription:', {
      timestamp: new Date().toISOString(),
      email: email.toLowerCase()
    })
    
    return NextResponse.json(
      { message: 'Successfully unsubscribed' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Newsletter unsubscription error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
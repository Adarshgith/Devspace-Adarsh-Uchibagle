import { NextRequest, NextResponse } from 'next/server'
import { eventRegistrationSchema, createValidationMiddleware, sanitizeInput } from '@/lib/validations'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string): string {
  return `event_registration_${ip}`
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 10 // 10 registrations per hour

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

// Event registrations storage (in production, use database)
const eventRegistrations = new Map<string, {
  registrations: Map<string, {
    id: string
    name: string
    email: string
    phone?: string
    organization?: string
    dietaryRequirements?: string
    accessibility?: string
    registeredAt: string
    confirmed: boolean
    confirmationToken: string
  }>
  maxAttendees?: number
}>()

function generateConfirmationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function generateRegistrationId(): string {
  return 'reg_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

async function registerForEvent(eventId: string, registrationData: any) {
  // Get or create event registration map
  if (!eventRegistrations.has(eventId)) {
    eventRegistrations.set(eventId, {
      registrations: new Map(),
      maxAttendees: undefined // Will be set from event data
    })
  }
  
  const eventData = eventRegistrations.get(eventId)!
  
  // Check if email already registered for this event
  const existingRegistration = Array.from(eventData.registrations.values())
    .find(reg => reg.email === registrationData.email)
  
  if (existingRegistration) {
    throw new Error('Email already registered for this event')
  }
  
  // Check capacity (if set)
  if (eventData.maxAttendees && eventData.registrations.size >= eventData.maxAttendees) {
    throw new Error('Event is full')
  }
  
  const registrationId = generateRegistrationId()
  const confirmationToken = generateConfirmationToken()
  
  const registration = {
    id: registrationId,
    name: registrationData.name,
    email: registrationData.email,
    phone: registrationData.phone,
    organization: registrationData.organization,
    dietaryRequirements: registrationData.dietaryRequirements,
    accessibility: registrationData.accessibility,
    registeredAt: new Date().toISOString(),
    confirmed: false,
    confirmationToken
  }
  
  eventData.registrations.set(registrationId, registration)
  
  return { registrationId, confirmationToken }
}

async function sendConfirmationEmail(eventId: string, registrationData: any, confirmationToken: string) {
  // In a real application, integrate with email service
  console.log('Sending event registration confirmation:', {
    to: registrationData.email,
    subject: 'Event Registration Confirmation',
    eventId,
    confirmationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/events/confirm?token=${confirmationToken}`,
    html: `
      <h2>Event Registration Confirmation</h2>
      <p>Dear ${registrationData.name},</p>
      <p>Thank you for registering for our event. Your registration details:</p>
      <ul>
        <li><strong>Name:</strong> ${registrationData.name}</li>
        <li><strong>Email:</strong> ${registrationData.email}</li>
        ${registrationData.phone ? `<li><strong>Phone:</strong> ${registrationData.phone}</li>` : ''}
        ${registrationData.organization ? `<li><strong>Organization:</strong> ${registrationData.organization}</li>` : ''}
      </ul>
      ${registrationData.dietaryRequirements ? `<p><strong>Dietary Requirements:</strong> ${registrationData.dietaryRequirements}</p>` : ''}
      ${registrationData.accessibility ? `<p><strong>Accessibility Requirements:</strong> ${registrationData.accessibility}</p>` : ''}
      <p>Please confirm your registration by clicking the link below:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/events/confirm?token=${confirmationToken}">Confirm Registration</a>
      <p>We look forward to seeing you at the event!</p>
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
          error: 'Too many registration attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Extract eventId
    const { eventId, ...registrationData } = body
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }
    
    // Validate input
    const validator = createValidationMiddleware(eventRegistrationSchema)
    const validation = validator(registrationData)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const data = validation.data
    
    // Sanitize input data
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email).toLowerCase(),
      phone: data.phone ? sanitizeInput(data.phone) : undefined,
      organization: data.organization ? sanitizeInput(data.organization) : undefined,
      dietaryRequirements: data.dietaryRequirements ? sanitizeInput(data.dietaryRequirements) : undefined,
      accessibility: data.accessibility ? sanitizeInput(data.accessibility) : undefined,
      consent: data.consent
    }

    // Register for event
    const result = await registerForEvent(eventId, sanitizedData)
    
    // Send confirmation email
    await sendConfirmationEmail(eventId, sanitizedData, result.confirmationToken)
    
    // Log successful registration
    console.log('Event registration:', {
      timestamp: new Date().toISOString(),
      ip: clientIP,
      eventId,
      registrationId: result.registrationId,
      name: sanitizedData.name,
      email: sanitizedData.email
    })

    return NextResponse.json(
      { 
        message: 'Successfully registered for event',
        registrationId: result.registrationId,
        confirmationRequired: true
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Event registration error:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Email already registered for this event') {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
      
      if (error.message === 'Event is full') {
        return NextResponse.json(
          { error: error.message },
          { status: 410 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get event registration status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const email = searchParams.get('email')
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID parameter required' },
        { status: 400 }
      )
    }
    
    const eventData = eventRegistrations.get(eventId)
    
    if (!eventData) {
      return NextResponse.json(
        { 
          registered: false,
          attendeeCount: 0,
          maxAttendees: null
        },
        { status: 200 }
      )
    }
    
    const attendeeCount = eventData.registrations.size
    
    if (email) {
      // Check specific email registration
      const registration = Array.from(eventData.registrations.values())
        .find(reg => reg.email === email.toLowerCase())
      
      return NextResponse.json(
        {
          registered: !!registration,
          confirmed: registration?.confirmed || false,
          registrationId: registration?.id,
          attendeeCount,
          maxAttendees: eventData.maxAttendees
        },
        { status: 200 }
      )
    }
    
    // Return general event stats
    return NextResponse.json(
      {
        attendeeCount,
        maxAttendees: eventData.maxAttendees,
        spotsRemaining: eventData.maxAttendees ? eventData.maxAttendees - attendeeCount : null
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Event registration status error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
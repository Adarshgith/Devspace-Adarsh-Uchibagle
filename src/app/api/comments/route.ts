import { NextRequest, NextResponse } from 'next/server'
import { commentFormSchema, createValidationMiddleware, sanitizeInput } from '@/lib/validations'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string): string {
  return `comments_${ip}`
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 10 // 10 comments per hour

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

// Comments storage (in production, use database)
const comments = new Map<string, {
  id: string
  contentId: string
  contentType: string
  parentId?: string
  name: string
  email: string
  website?: string
  comment: string
  createdAt: string
  approved: boolean
  ip: string
  replies: string[]
}>()

function generateCommentId(): string {
  return 'comment_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function checkSpam(comment: string, name: string, email: string): boolean {
  // Basic spam detection patterns
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|cheap|free|click here|act now)\b/i,
    /(http:\/\/|https:\/\/)[^\s]{10,}/g, // Multiple URLs
    /[A-Z]{10,}/, // Excessive caps
    /[!]{3,}/, // Multiple exclamation marks
    /\b(buy now|limited time|special offer|guaranteed)\b/i
  ]
  
  const text = `${comment} ${name}`.toLowerCase()
  return spamPatterns.some(pattern => pattern.test(text))
}

function moderateComment(comment: string): boolean {
  // Basic content moderation
  const bannedWords = [
    'spam', 'scam', 'fake', 'hate', 'offensive'
    // Add more banned words as needed
  ]
  
  const lowerComment = comment.toLowerCase()
  return !bannedWords.some(word => lowerComment.includes(word))
}

async function saveComment(data: any) {
  const commentId = generateCommentId()
  
  const comment = {
    id: commentId,
    contentId: data.contentId,
    contentType: data.contentType,
    parentId: data.parentId,
    name: data.name,
    email: data.email,
    website: data.website,
    comment: data.comment,
    createdAt: new Date().toISOString(),
    approved: false, // Comments require moderation
    ip: data.ip,
    replies: []
  }
  
  comments.set(commentId, comment)
  
  // If this is a reply, add to parent's replies array
  if (data.parentId && comments.has(data.parentId)) {
    const parentComment = comments.get(data.parentId)!
    parentComment.replies.push(commentId)
    comments.set(data.parentId, parentComment)
  }
  
  return commentId
}

async function notifyModerators(commentId: string, comment: any) {
  // In a real application, send email to moderators
  console.log('New comment for moderation:', {
    commentId,
    contentId: comment.contentId,
    contentType: comment.contentType,
    name: comment.name,
    email: comment.email,
    comment: comment.comment.substring(0, 100) + '...',
    moderationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/comments/${commentId}`
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
          error: 'Too many comments. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Extract content info
    const { contentId, contentType, ...commentData } = body
    
    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: 'Content ID and type are required' },
        { status: 400 }
      )
    }
    
    // Validate input
    const validator = createValidationMiddleware(commentFormSchema)
    const validation = validator(commentData)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const data = validation.data
    
    // Sanitize input data
    const sanitizedData = {
      contentId,
      contentType,
      parentId: data.parentId,
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email).toLowerCase(),
      website: data.website ? sanitizeInput(data.website) : undefined,
      comment: sanitizeInput(data.comment),
      ip: clientIP
    }

    // Check for spam
    if (checkSpam(sanitizedData.comment, sanitizedData.name, sanitizedData.email)) {
      return NextResponse.json(
        { error: 'Comment flagged as spam' },
        { status: 400 }
      )
    }
    
    // Content moderation
    if (!moderateComment(sanitizedData.comment)) {
      return NextResponse.json(
        { error: 'Comment contains inappropriate content' },
        { status: 400 }
      )
    }
    
    // Check if parent comment exists (for replies)
    if (sanitizedData.parentId && !comments.has(sanitizedData.parentId)) {
      return NextResponse.json(
        { error: 'Parent comment not found' },
        { status: 404 }
      )
    }

    // Save comment
    const commentId = await saveComment(sanitizedData)
    
    // Notify moderators
    await notifyModerators(commentId, sanitizedData)
    
    // Log comment submission
    console.log('Comment submission:', {
      timestamp: new Date().toISOString(),
      ip: clientIP,
      commentId,
      contentId,
      contentType,
      name: sanitizedData.name,
      email: sanitizedData.email,
      isReply: !!sanitizedData.parentId
    })

    return NextResponse.json(
      { 
        message: 'Comment submitted successfully. It will appear after moderation.',
        commentId,
        requiresModeration: true
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Comment submission error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get comments for content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')
    const includeUnapproved = searchParams.get('includeUnapproved') === 'true'
    
    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: 'Content ID and type parameters required' },
        { status: 400 }
      )
    }
    
    // Filter comments for this content
    const contentComments = Array.from(comments.values())
      .filter(comment => 
        comment.contentId === contentId && 
        comment.contentType === contentType &&
        (includeUnapproved || comment.approved)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    
    // Organize comments with replies
    const topLevelComments = contentComments
      .filter(comment => !comment.parentId)
      .map(comment => ({
        ...comment,
        email: undefined, // Don't expose email addresses
        ip: undefined, // Don't expose IP addresses
        replies: comment.replies
          .map(replyId => comments.get(replyId))
          .filter(reply => reply && (includeUnapproved || reply.approved))
          .map(reply => ({
            ...reply,
            email: undefined,
            ip: undefined
          }))
      }))
    
    return NextResponse.json(
      {
        comments: topLevelComments,
        total: contentComments.length
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Comments retrieval error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Approve/moderate comment (admin only)
export async function PATCH(request: NextRequest) {
  try {
    // In a real application, add authentication middleware here
    const body = await request.json()
    const { commentId, action } = body
    
    if (!commentId || !action) {
      return NextResponse.json(
        { error: 'Comment ID and action are required' },
        { status: 400 }
      )
    }
    
    const comment = comments.get(commentId)
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    switch (action) {
      case 'approve':
        comment.approved = true
        comments.set(commentId, comment)
        break
        
      case 'reject':
        comments.delete(commentId)
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    return NextResponse.json(
      { message: `Comment ${action}d successfully` },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Comment moderation error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
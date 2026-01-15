'use client'

import React from 'react'
import { Controller } from 'react-hook-form'
import { commentFormSchema, type CommentFormData } from '@/lib/validations'
import { Form, FormField, Input, Textarea, SubmitButton } from './FormComponents'
import { useToast } from '@/components/ui/Toast'
import { MessageCircle, Reply } from 'lucide-react'

interface CommentFormProps {
  contentId: string
  contentType: 'blog' | 'news' | 'event'
  parentId?: string
  parentAuthor?: string
  onSubmit?: (data: CommentFormData) => Promise<void>
  onCancel?: () => void
  className?: string
  compact?: boolean
}

export function CommentForm({
  contentId,
  contentType,
  parentId,
  parentAuthor,
  onSubmit,
  onCancel,
  className,
  compact = false
}: CommentFormProps) {
  const { showToast } = useToast()
  const isReply = !!parentId

  const handleSubmit = async (data: CommentFormData) => {
    const commentData = {
      ...data,
      parentId
    }

    if (onSubmit) {
      await onSubmit(commentData)
    } else {
      // Default submission logic
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...commentData,
          contentId,
          contentType
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      showToast(
        isReply ? 'Reply posted successfully!' : 'Comment posted successfully!',
        'success'
      )
    }
  }

  return (
    <div className={`${className}`}>
      <div className={`bg-white rounded-lg ${compact ? 'p-4' : 'p-6'} ${!compact ? 'shadow-md' : 'border border-gray-200'}`}>
        <div className="flex items-center space-x-2 mb-4">
          {isReply ? (
            <Reply className="h-5 w-5 text-blue-600" />
          ) : (
            <MessageCircle className="h-5 w-5 text-blue-600" />
          )}
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
            {isReply ? `Reply to ${parentAuthor}` : 'Leave a Comment'}
          </h3>
        </div>

        {!compact && (
          <p className="text-gray-600 mb-6">
            {isReply 
              ? 'Share your thoughts on this reply.'
              : 'We\'d love to hear your thoughts! Please be respectful and constructive.'}
          </p>
        )}

        <Form schema={commentFormSchema} onSubmit={handleSubmit}>
          {({ control, formState: { errors, isSubmitting } }) => (
            <>
              <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
                <FormField label="Name" error={errors.name} required>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Your name"
                        error={errors.name}
                        autoComplete="name"
                      />
                    )}
                  />
                </FormField>

                <FormField label="Email" error={errors.email} required>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Your email (won't be published)"
                        error={errors.email}
                        autoComplete="email"
                      />
                    )}
                  />
                </FormField>
              </div>

              {!compact && (
                <FormField label="Website" error={errors.website}>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="url"
                        placeholder="Your website (optional)"
                        error={errors.website}
                        autoComplete="url"
                      />
                    )}
                  />
                </FormField>
              )}

              <FormField label="Comment" error={errors.comment} required>
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={compact ? 4 : 6}
                      placeholder={isReply ? 'Write your reply...' : 'Share your thoughts...'}
                      error={errors.comment}
                    />
                  )}
                />
              </FormField>

              {!compact && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Comment Guidelines</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Be respectful and constructive in your comments</li>
                    <li>• Stay on topic and avoid spam or promotional content</li>
                    <li>• Comments are moderated and may take time to appear</li>
                    <li>• We reserve the right to remove inappropriate comments</li>
                  </ul>
                </div>
              )}

              <div className={`flex ${compact ? 'flex-col space-y-3' : 'flex-col sm:flex-row'} ${!compact ? 'justify-end space-y-3 sm:space-y-0 sm:space-x-3' : ''}`}>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className={`px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors ${compact ? 'text-sm' : ''}`}
                  >
                    Cancel
                  </button>
                )}
                
                <SubmitButton
                  loading={isSubmitting}
                  loadingText={isReply ? 'Posting Reply...' : 'Posting Comment...'}
                  className={compact ? 'w-full' : 'sm:w-auto'}
                >
                  {isReply ? 'Post Reply' : 'Post Comment'}
                </SubmitButton>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}

// Compact comment form for inline replies
export function CompactCommentForm(props: Omit<CommentFormProps, 'compact'>) {
  return <CommentForm {...props} compact={true} />
}

export default CommentForm
'use client'

import React from 'react'
import { Controller } from 'react-hook-form'
import { newsletterSchema, type NewsletterData } from '@/lib/validations'
import { Form, FormField, Input, Checkbox, SubmitButton } from './FormComponents'
import { useToast } from '@/components/ui/Toast'

interface NewsletterFormProps {
  onSubmit?: (data: NewsletterData) => Promise<void>
  className?: string
  compact?: boolean
}

const NEWSLETTER_PREFERENCES = [
  { id: 'weekly', label: 'Weekly Newsletter', description: 'Get our latest updates every week' },
  { id: 'events', label: 'Event Notifications', description: 'Be notified about upcoming events' },
  { id: 'blog', label: 'New Blog Posts', description: 'Get notified when we publish new articles' },
  { id: 'news', label: 'News Updates', description: 'Stay updated with our latest news' }
]

export function NewsletterForm({ onSubmit, className, compact = false }: NewsletterFormProps) {
  const { showToast } = useToast()

  const handleSubmit = async (data: NewsletterData) => {
    if (onSubmit) {
      await onSubmit(data)
    } else {
      // Default submission logic
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe to newsletter')
      }

      showToast('Successfully subscribed to our newsletter!', 'success')
    }
  }

  if (compact) {
    return (
      <div className={`${className}`}>
        <Form schema={newsletterSchema} onSubmit={handleSubmit}>
          {({ control, formState: { errors, isSubmitting } }) => (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email address"
                      error={errors.email}
                      autoComplete="email"
                      className="w-full"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <Controller
                name="consent"
                control={control}
                defaultValue={false}
                render={({ field: { value, onChange } }) => (
                  <input
                    type="hidden"
                    checked={value}
                    onChange={onChange}
                    value={value ? 'true' : 'false'}
                  />
                )}
              />
              
              <SubmitButton
                loading={isSubmitting}
                loadingText="Subscribing..."
                className="sm:w-auto whitespace-nowrap"
                onClick={() => {
                  // Auto-consent for compact form
                  control._formValues.consent = true
                }}
              >
                Subscribe
              </SubmitButton>
            </div>
          )}
        </Form>
        <p className="text-xs text-gray-500 mt-2">
          By subscribing, you agree to receive our newsletter and accept our privacy policy.
        </p>
      </div>
    )
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Stay Updated</h3>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter and never miss our latest updates, events, and insights.
        </p>

        <Form schema={newsletterSchema} onSubmit={handleSubmit}>
          {({ control, formState: { errors, isSubmitting }, watch }) => {
            const preferences = watch('preferences') || []
            
            return (
              <>
                <FormField label="Email Address" error={errors.email} required>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        error={errors.email}
                        autoComplete="email"
                      />
                    )}
                  />
                </FormField>

                <FormField label="Subscription Preferences" className="space-y-3">
                  <Controller
                    name="preferences"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { value = [], onChange } }) => (
                      <div className="space-y-3">
                        {NEWSLETTER_PREFERENCES.map((pref) => (
                          <div key={pref.id} className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id={pref.id}
                              checked={value.includes(pref.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChange([...value, pref.id])
                                } else {
                                  onChange(value.filter((id: string) => id !== pref.id))
                                }
                              }}
                              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <label htmlFor={pref.id} className="text-sm font-medium text-gray-700">
                                {pref.label}
                              </label>
                              <p className="text-xs text-gray-500">{pref.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </FormField>

                <Controller
                  name="consent"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <Checkbox
                      {...field}
                      checked={value}
                      onChange={onChange}
                      label="I agree to receive newsletters and accept the privacy policy"
                      error={errors.consent}
                    />
                  )}
                />

                <SubmitButton
                  loading={isSubmitting}
                  loadingText="Subscribing..."
                >
                  Subscribe to Newsletter
                </SubmitButton>
              </>
            )
          }}
        </Form>
      </div>
    </div>
  )
}

export default NewsletterForm
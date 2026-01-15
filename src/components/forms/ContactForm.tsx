'use client'

import React from 'react'
import { Controller } from 'react-hook-form'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { Form, FormField, Input, Textarea, Checkbox, SubmitButton } from './FormComponents'
import { useToast } from '@/components/ui/Toast'

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>
  className?: string
}

export function ContactForm({ onSubmit, className }: ContactFormProps) {
  const { showToast } = useToast()

  const handleSubmit = async (data: ContactFormData) => {
    if (onSubmit) {
      await onSubmit(data)
    } else {
      // Default submission logic
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      showToast('Message sent successfully! We\'ll get back to you soon.', 'success')
    }
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
        <p className="text-gray-600 mb-8">
          Have a question or want to work together? We'd love to hear from you.
        </p>

        <Form schema={contactFormSchema} onSubmit={handleSubmit}>
          {({ control, formState: { errors, isSubmitting } }) => (
            <>
              <FormField label="Full Name" error={errors.name} required>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your full name"
                      error={errors.name}
                      autoComplete="name"
                    />
                  )}
                />
              </FormField>

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

              <FormField label="Phone Number" error={errors.phone}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter your phone number (optional)"
                      error={errors.phone}
                      autoComplete="tel"
                    />
                  )}
                />
              </FormField>

              <FormField label="Subject" error={errors.subject} required>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="What's this about?"
                      error={errors.subject}
                    />
                  )}
                />
              </FormField>

              <FormField label="Message" error={errors.message} required>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      error={errors.message}
                    />
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
                    label="I agree to the privacy policy and terms of service"
                    error={errors.consent}
                  />
                )}
              />

              <SubmitButton
                loading={isSubmitting}
                loadingText="Sending Message..."
              >
                Send Message
              </SubmitButton>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}

export default ContactForm
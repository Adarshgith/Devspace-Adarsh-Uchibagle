'use client'

import React from 'react'
import { Controller } from 'react-hook-form'
import { eventRegistrationSchema, type EventRegistrationData } from '@/lib/validations'
import { Form, FormField, Input, Textarea, Checkbox, SubmitButton } from './FormComponents'
import { useToast } from '@/components/ui/Toast'
import { Calendar, MapPin, Users } from 'lucide-react'

interface EventRegistrationFormProps {
  eventId: string
  eventTitle: string
  eventDate?: string
  eventLocation?: string
  maxAttendees?: number
  currentAttendees?: number
  onSubmit?: (data: EventRegistrationData) => Promise<void>
  className?: string
}

export function EventRegistrationForm({
  eventId,
  eventTitle,
  eventDate,
  eventLocation,
  maxAttendees,
  currentAttendees = 0,
  onSubmit,
  className
}: EventRegistrationFormProps) {
  const { showToast } = useToast()
  const spotsRemaining = maxAttendees ? maxAttendees - currentAttendees : null
  const isFull = spotsRemaining !== null && spotsRemaining <= 0

  const handleSubmit = async (data: EventRegistrationData) => {
    if (onSubmit) {
      await onSubmit(data)
    } else {
      // Default submission logic
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, eventId }),
      })

      if (!response.ok) {
        throw new Error('Failed to register for event')
      }

      showToast('Successfully registered for the event!', 'success')
    }
  }

  if (isFull) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Event Full</h3>
            <p className="text-gray-600">
              This event has reached its maximum capacity. Please check back later for cancellations or join our waitlist.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Register for Event</h2>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">{eventTitle}</h3>
            <div className="space-y-2 text-sm text-blue-800">
              {eventDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              )}
              {eventLocation && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{eventLocation}</span>
                </div>
              )}
              {spotsRemaining !== null && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {spotsRemaining} {spotsRemaining === 1 ? 'spot' : 'spots'} remaining
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Form schema={eventRegistrationSchema} onSubmit={handleSubmit}>
          {({ control, formState: { errors, isSubmitting } }) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <FormField label="Organization" error={errors.organization}>
                  <Controller
                    name="organization"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Your organization (optional)"
                        error={errors.organization}
                        autoComplete="organization"
                      />
                    )}
                  />
                </FormField>
              </div>

              <FormField label="Dietary Requirements" error={errors.dietaryRequirements}>
                <Controller
                  name="dietaryRequirements"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Please let us know about any dietary requirements or food allergies (optional)"
                      error={errors.dietaryRequirements}
                    />
                  )}
                />
              </FormField>

              <FormField label="Accessibility Requirements" error={errors.accessibility}>
                <Controller
                  name="accessibility"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Please let us know about any accessibility requirements (optional)"
                      error={errors.accessibility}
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
                    label="I agree to the terms and conditions and understand the event cancellation policy"
                    error={errors.consent}
                  />
                )}
              />

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Important Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You will receive a confirmation email after registration</li>
                  <li>• Please arrive 15 minutes before the event starts</li>
                  <li>• Cancellations must be made at least 24 hours in advance</li>
                  <li>• Contact us if you have any questions or need assistance</li>
                </ul>
              </div>

              <SubmitButton
                loading={isSubmitting}
                loadingText="Registering..."
              >
                Register for Event
              </SubmitButton>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}

export default EventRegistrationForm
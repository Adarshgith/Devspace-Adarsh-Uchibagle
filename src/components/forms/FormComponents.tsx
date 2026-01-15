'use client'

import React from 'react'
import { useForm, Controller, FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/ui/Toast'
import { sanitizeInput } from '@/lib/validations'

// Form field wrapper component
interface FormFieldProps {
  label: string
  error?: FieldError
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, error, required, children, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: FieldError
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = 'Select'

// Checkbox component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start space-x-2">
        <input
          ref={ref}
          type="checkbox"
          className={`
            mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded
            focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        <div className="flex-1">
          <label className="text-sm text-gray-700">{label}</label>
          {error && (
            <p className="text-sm text-red-600 mt-1" role="alert">
              {error.message}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

// Submit button component
interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
}

export function SubmitButton({ 
  loading = false, 
  loadingText = 'Submitting...', 
  children, 
  className = '',
  ...props 
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`
        w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:bg-gray-400 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  )
}

// Generic form component
interface FormProps<T extends z.ZodType> {
  schema: T
  onSubmit: (data: z.infer<T>) => Promise<void> | void
  children: (methods: ReturnType<typeof useForm<z.infer<T>>>) => React.ReactNode
  className?: string
  sanitizeInputs?: boolean
}

export function Form<T extends z.ZodType>({
  schema,
  onSubmit,
  children,
  className = '',
  sanitizeInputs = true
}: FormProps<T>) {
  const { showToast } = useToast()
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onBlur'
  })

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      // Sanitize string inputs if enabled
      if (sanitizeInputs) {
        const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? sanitizeInput(value) : value
          return acc
        }, {} as any)
        await onSubmit(sanitizedData)
      } else {
        await onSubmit(data)
      }
      
      showToast('Form submitted successfully!', 'success')
      methods.reset()
    } catch (error) {
      console.error('Form submission error:', error)
      showToast(
        error instanceof Error ? error.message : 'An error occurred while submitting the form',
        'error'
      )
    }
  }

  return (
    <form
      onSubmit={methods.handleSubmit(handleSubmit)}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {children(methods)}
    </form>
  )
}

// Form validation hook
export function useFormValidation<T extends z.ZodType>(schema: T) {
  const validateField = (value: unknown) => {
    try {
      schema.parse(value)
      return true
    } catch {
      return false
    }
  }

  const getFieldErrors = (value: unknown) => {
    try {
      schema.parse(value)
      return []
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors.map(err => err.message)
      }
      return ['Validation failed']
    }
  }

  return { validateField, getFieldErrors }
}
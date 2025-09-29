'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadFormSchema, type LeadFormData, AVAILABLE_SERVICES, SERVICE_LABELS, type ServiceType } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { trackLeadSubmission, trackServiceInterest } from '@/components/GoogleAnalytics'

interface LeadFormWithHeadingLevelProps {
  className?: string
  title?: string
  subtitle?: string
  headingLevel?: 'h2' | 'h3' | 'h4'
}

export function LeadFormWithHeadingLevel({ 
  className = '', 
  title = 'Get Your Marketing Strategy Consultation',
  subtitle = 'Let\'s discuss how we can grow your brand together',
  headingLevel = 'h3'
}: LeadFormWithHeadingLevelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitType, setSubmitType] = useState<'success' | 'error' | null>(null)
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([])
  
  const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  })

  const toggleService = (service: ServiceType) => {
    const isCurrentlySelected = selectedServices.includes(service)
    
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
    
    // Track service interest in Google Analytics
    if (!isCurrentlySelected) {
      trackServiceInterest(SERVICE_LABELS[service])
    }
  }

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitType(null)

    try {
      const formData = {
        ...data,
        services: selectedServices
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        // Track successful lead submission
        trackLeadSubmission({
          name: formData.name,
          email: formData.email,
          services: selectedServices,
          formType: 'main_contact_form'
        })
        
        setSubmitMessage(result.message)
        setSubmitType('success')
        reset()
        setSelectedServices([]) // Reset selected services
      } else {
        setSubmitMessage(result.message)
        setSubmitType('error')
      }
    } catch {
      setSubmitMessage('Something went wrong. Please try again.')
      setSubmitType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-neutral-100 relative overflow-hidden ${className}`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-primary-25/30 opacity-60"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-primary-200 to-primary-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-4 shadow-lg animate-bounce">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 6.5 15.5 8zM7.34 8.16l4.16 2.5v5.09c-2.84-0.48-5-2.94-5-5.91 0-0.58 0.09-1.13 0.24-1.68zM12.5 16.25V11.16l4.16-2.5C16.91 9.21 17 9.76 17 10.34c0 2.97-2.16 5.43-5 5.91z"/>
            </svg>
          </div>
          <HeadingTag className="text-3xl sm:text-4xl font-heading font-bold text-neutral-900 mb-3 bg-gradient-to-r from-neutral-900 to-primary-700 bg-clip-text text-transparent">
            {title}
          </HeadingTag>
          <p className="text-lg text-neutral-600 font-medium">{subtitle}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto mt-4"></div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="group">
            <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-3 group-focus-within:text-primary-600 transition-colors">
              Your Name *
            </label>
            <div className="relative">
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-5 py-4 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 text-lg placeholder-neutral-400 hover:border-neutral-300 shadow-sm"
                placeholder="Enter your full name"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-2 h-2 bg-primary-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="group">
            <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-3 group-focus-within:text-primary-600 transition-colors">
              Email Address *
            </label>
            <div className="relative">
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full px-5 py-4 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 text-lg placeholder-neutral-400 hover:border-neutral-300 shadow-sm"
                placeholder="your@email.com"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-2 h-2 bg-primary-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="group">
            <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-3 group-focus-within:text-primary-600 transition-colors">
              Tell us about your business
            </label>
            <div className="relative">
              <textarea
                {...register('message')}
                id="message"
                rows={4}
                className="w-full px-5 py-4 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 text-lg placeholder-neutral-400 hover:border-neutral-300 shadow-sm resize-none"
                placeholder="What marketing challenges are you facing? Tell us about your goals..."
              />
              <div className="absolute top-4 right-0 flex items-start pr-4">
                <div className="w-2 h-2 bg-primary-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            {errors.message && (
              <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Services Selection */}
          <div className="group">
            <label className="block text-sm font-semibold text-neutral-700 mb-4 group-focus-within:text-primary-600 transition-colors">
              Which services are you interested in? 
              <span className="text-neutral-500 font-normal ml-1">(Optional)</span>
            </label>
            
            {/* Service option pills grid: ensure it wraps cleanly on small screens without causing horizontal overflow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AVAILABLE_SERVICES.map((service) => (
                <div
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-colors duration-300 hover:shadow-md
                    ${selectedServices.includes(service)
                      ? 'border-primary-500 bg-primary-50 shadow-lg ring-2 ring-primary-200'
                      : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-25'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                      ${selectedServices.includes(service)
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-neutral-300'
                      }
                    `}>
                      {selectedServices.includes(service) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`
                      text-sm font-medium transition-colors duration-200
                      ${selectedServices.includes(service) 
                        ? 'text-primary-700' 
                        : 'text-neutral-700'
                      }
                    `}>
                      {SERVICE_LABELS[service]}
                    </span>
                  </div>
                  
                  {/* Selected indicator */}
                  {selectedServices.includes(service) && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedServices.length > 0 && (
              <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                <p className="text-sm text-primary-700">
                  <span className="font-semibold">{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected:</span>
                  <span className="ml-2">
                    {selectedServices.map(service => SERVICE_LABELS[service]).join(', ')}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-5 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg relative overflow-hidden group"
              disabled={isSubmitting}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              {isSubmitting ? (
                <div className="flex items-center justify-center relative z-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  <span className="animate-pulse">Sending your request...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center relative z-10">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 6.5 15.5 8zM7.34 8.16l4.16 2.5v5.09c-2.84-0.48-5-2.94-5-5.91 0-0.58 0.09-1.13 0.24-1.68zM12.5 16.25V11.16l4.16-2.5C16.91 9.21 17 9.76 17 10.34c0 2.97-2.16 5.43-5 5.91z"/>
                  </svg>
                  Get My Strategy Session
                </div>
              )}
            </Button>
          </div>

          {submitMessage && (
            <div
              className={`p-6 rounded-xl text-center border-2 transition-all duration-500 animate-slideIn ${
                submitType === 'success'
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200 shadow-lg'
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                {submitType === 'success' ? (
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                )}
              </div>
              <p className="font-semibold text-lg">{submitMessage}</p>
            </div>
          )}

          <div className="text-center pt-4">
            <p className="text-xs text-neutral-500 leading-relaxed max-w-md mx-auto">
              🔒 By submitting this form, you agree to receive marketing communications from <span className="font-semibold text-primary-600">Ellie Edwards Marketing</span>. 
              You can unsubscribe at any time. Your privacy is our priority.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
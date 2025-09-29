import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendNewLeadNotification } from '@/lib/email'
import { leadFormSchema } from '@/lib/validations'

interface Lead {
  id: string;
  email: string;
  name: string;
  message?: string;
  services_interested: string[];
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('🔍 Environment Debug:', {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      HAS_PLACEHOLDER: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder'),
      URL_INCLUDES_SUPABASE: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co')
    })

    // Check if we're properly configured
    if (process.env.NODE_ENV === 'production' && (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder'))) {
      console.error('Missing Supabase configuration')
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    // Only simulate if we have placeholder URLs (no real database)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const body = await request.json()
      console.log('📝 No database configured: Lead would be saved in production:', body)
      
      // Send notification email to Ellie (will be logged in development)
      await sendNewLeadNotification({
        name: body.name,
        email: body.email,
        message: body.message,
        timestamp: new Date().toLocaleString(),
      })
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your interest! We\'ll be in touch soon. (No database configured)',
          leadId: 'dev-mode-' + Date.now()
        },
        { status: 201 }
      )
    }

    const body = await request.json()

    // Validate the form data
    const validatedData = leadFormSchema.parse(body)

    console.log('💾 Attempting to save lead to Supabase:', {
      name: validatedData.name,
      email: validatedData.email,
      hasMessage: !!validatedData.message,
      servicesCount: validatedData.services?.length || 0
    })

    // Optional bypass to force email-only mode in dev
    const forceEmailOnly = process.env.LEADS_EMAIL_ONLY === 'true'

    let finalLead: Lead | null = null
    let dbAttempted = false
    if (!forceEmailOnly) {
      try {
        dbAttempted = true
        // Store in Supabase - handle duplicates gracefully
        const { data: lead, error: dbError } = await supabase
          .from('leads')
          .insert({
            name: validatedData.name,
            email: validatedData.email,
            message: validatedData.message || null,
            services_interested: validatedData.services || [],
          })
          .select()
          .single()

        finalLead = lead

        if (dbError) {
          // Handle duplicate email constraint gracefully
          if (dbError.code === '23505' && dbError.message?.includes('leads_email_idx')) {
            console.log('📧 Email already exists - updating existing lead instead')

            const { data: existingLead, error: updateError } = await supabase
              .from('leads')
              .update({
                name: validatedData.name,
                message: validatedData.message || null,
                services_interested: validatedData.services || [],
                updated_at: new Date().toISOString()
              })
              .eq('email', validatedData.email)
              .select()
              .single()

            if (updateError) {
              console.error('❌ Update error:', updateError)
              // Degrade to email-only mode
            } else {
              finalLead = existingLead
              console.log('✅ Lead updated successfully:', {
                leadId: finalLead?.id,
                email: finalLead?.email,
              })
            }
          } else {
            console.error('❌ Database error:', dbError)
            // Degrade to email-only mode
          }
        }
      } catch (err: unknown) {
        // Network / fetch error to Supabase
        console.error('🌐 Supabase network error, degrading to email-only mode:', err instanceof Error ? err.message : err)
      }
    } else {
      console.log('⏭️ LEADS_EMAIL_ONLY=true — skipping DB write, using email-only mode')
    }

    if (finalLead?.id) {
      console.log('✅ Lead saved successfully to database:', {
        leadId: finalLead?.id,
        email: finalLead?.email,
        createdAt: finalLead?.created_at
      })
    } else if (dbAttempted) {
      console.log('ℹ️ Proceeding without DB persistence (email-only fallback).')
    }

    // Send email notification
    const emailResult = await sendNewLeadNotification({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      services: validatedData.services || [],
      timestamp: new Date().toLocaleString(),
    })

    if (!emailResult.success) {
      console.error('Email notification failed:', emailResult.error)
      // Don't fail the request if email fails, lead is still saved
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll be in touch soon.',
      leadId: finalLead?.id || `email-only-${Date.now()}`,
      degraded: !finalLead?.id,
    })

  } catch (error) {
    console.error('Lead submission error:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, message: 'Please check your form data and try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

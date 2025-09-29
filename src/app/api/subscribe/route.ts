import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendNewLeadNotification } from '@/lib/email'
import { z } from 'zod'

const subscriberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: NextRequest) {
  try {
    // Check if we're properly configured
    if (process.env.NODE_ENV === 'production' && (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder'))) {
      console.error('Missing Supabase configuration')
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    // In development with placeholder values, simulate success
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const body = await request.json()
      console.log('📝 Development mode: Newsletter subscription would be saved in production:', body)
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for subscribing! (Development mode - no data actually saved)',
          subscriberId: 'dev-mode-' + Date.now()
        },
        { status: 201 }
      )
    }

    const body = await request.json()
    
    // Validate the request body
    const validatedData = subscriberSchema.parse(body)
    
    // Check if subscriber already exists in leads table
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('email', validatedData.email)
      .single()
    
    if (existingLead) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'You\'re already subscribed to our newsletter!' 
        },
        { status: 200 }
      )
    }
    
    // Create new subscriber/lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        message: 'Newsletter subscription',
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Send notification email
    await sendNewLeadNotification({
      name: validatedData.name,
      email: validatedData.email,
      message: 'Newsletter subscription',
      timestamp: new Date().toLocaleString(),
    })
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for subscribing! Check your email for a welcome message.',
        subscriberId: lead.id 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

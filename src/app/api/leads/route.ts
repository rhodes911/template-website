import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendNewLeadNotification } from '@/lib/email'
import { leadFormSchema } from '@/lib/validations'

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
      console.log('📝 Development mode: Lead would be saved in production:', await request.json())
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your interest! (Development mode - no data actually saved)',
          leadId: 'dev-mode-' + Date.now()
        },
        { status: 201 }
      )
    }

    const body = await request.json()
    
    // Validate the request body
    const validatedData = leadFormSchema.parse(body)
    
    // Check if email already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('email', validatedData.email)
      .single()
    
    let lead
    
    if (existingLead) {
      // Update existing lead
      const { data, error } = await supabase
        .from('leads')
        .update({
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message || null,
          updated_at: new Date().toISOString(),
        })
        .eq('email', validatedData.email)
        .select()
        .single()
      
      if (error) throw error
      lead = data
    } else {
      // Create new lead
      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message || null,
        })
        .select()
        .single()
      
      if (error) throw error
      lead = data
    }
    
    // Send notification email to Ellie
    await sendNewLeadNotification({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      timestamp: new Date().toLocaleString(),
    })
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your interest! We\'ll be in touch soon.',
        leadId: lead.id 
      },
      { status: 201 }
    )
    
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

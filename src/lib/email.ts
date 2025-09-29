import { Resend } from 'resend'
import { SERVICE_LABELS, type ServiceType } from '@/lib/validations'

// Environment variables with fallbacks
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder-key'
const notificationEmail = process.env.NOTIFICATION_EMAIL || 'ellieedwardsmarketing@gmail.com'

// Check if we're in production and missing required env vars
if (process.env.NODE_ENV === 'production' && !process.env.RESEND_API_KEY) {
  console.warn('⚠️ Resend API key is missing in production!')
}

const resend = new Resend(resendApiKey)

export interface EmailData {
  name: string
  email: string
  message?: string
  timestamp: string
  services?: string[]
}

export async function sendNewLeadNotification(leadData: EmailData) {
  try {
    // Enhanced debugging for production
    console.log('🔍 Email Debug Info:', {
      environment: process.env.NODE_ENV,
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8),
      notificationEmail,
      timestamp: new Date().toISOString()
    })

    // Check if we have a real API key (not placeholder)
    const hasValidApiKey = resendApiKey && resendApiKey !== 'placeholder-key' && resendApiKey.startsWith('re_')
    
    if (!hasValidApiKey) {
      console.error('❌ Invalid Resend API key:', {
        to: notificationEmail,
        subject: '🎉 New Lead Alert - Ellie Edwards Marketing',
        leadData,
        apiKeyStatus: resendApiKey ? 'invalid' : 'missing',
        apiKeyValue: resendApiKey
      })
      return { success: false, error: 'No valid API key' }
    }

    console.log('📧 Sending email notification via Resend...', {
      to: notificationEmail,
      hasApiKey: true,
      apiKeyPrefix: resendApiKey.substring(0, 8) + '...'
    })

    // Generate services HTML
    const servicesHtml = leadData.services && leadData.services.length > 0 
      ? `
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">🎯 Services of Interest:</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            ${leadData.services.map(service => `
              <div style="background-color: white; padding: 12px; border-radius: 6px; border: 1px solid #dbeafe;">
                <span style="color: #1e40af; font-weight: 600;">✓ ${SERVICE_LABELS[service as ServiceType] || service}</span>
              </div>
            `).join('')}
          </div>
          <p style="margin-top: 15px; margin-bottom: 0; color: #1e40af; font-style: italic;">
            💡 Consider prioritizing these services in your follow-up conversation!
          </p>
        </div>
      `
      : '<div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;"><p style="color: #6b7280; font-style: italic; margin: 0;">No specific services selected - general inquiry</p></div>'

    const { data, error } = await resend.emails.send({
      from: 'Ellie Edwards Marketing <onboarding@resend.dev>', // Default Resend domain; switch to your verified domain when ready
      to: [notificationEmail],
      reply_to: leadData.email, // Reply directly to the lead
      subject: `🎉 New Lead from ${leadData.name || 'Unknown'} <${leadData.email}>${leadData.services?.length ? ` • ${leadData.services.length} service(s)` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #1e293b; margin-bottom: 20px; text-align: center;">
              🌟 New Lead Alert!
            </h1>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #334155; margin-top: 0;">Lead Details:</h2>
              <p style="margin: 10px 0; color: #475569;"><strong>Name:</strong> ${leadData.name}</p>
              <p style="margin: 10px 0; color: #475569;"><strong>Email:</strong> ${leadData.email}</p>
              ${leadData.message ? `<p style="margin: 10px 0; color: #475569;"><strong>Message:</strong> ${leadData.message}</p>` : ''}
              <p style="margin: 10px 0; color: #475569;"><strong>Submitted:</strong> ${leadData.timestamp}</p>
            </div>
            
            ${servicesHtml}
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
              <h3 style="color: #15803d; margin-top: 0;">📞 Recommended Next Steps:</h3>
              ${leadData.services?.length 
                ? `
                  <p style="color: #15803d; margin: 10px 0;">
                    🎯 <strong>Priority Follow-up:</strong> This lead has shown specific interest in ${leadData.services.length} service${leadData.services.length > 1 ? 's' : ''}
                  </p>
                  <p style="color: #15803d; margin: 10px 0;">
                    💬 <strong>Conversation Starter:</strong> "I saw you're interested in ${leadData.services.slice(0, 2).map(s => SERVICE_LABELS[s as ServiceType]).join(' and ')}${leadData.services.length > 2 ? ', among others' : ''}..."
                  </p>
                `
                : `
                  <p style="color: #15803d; margin: 10px 0;">
                    💬 <strong>General Inquiry:</strong> Explore their needs and recommend relevant services
                  </p>
                `
              }
              <p style="color: #15803d; margin: 10px 0;">
                ⏰ <strong>Response Time:</strong> Aim to respond within 1 hour for best conversion
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #64748b; font-size: 14px;">
                This lead was captured from your Ellie Edwards Marketing website.
              </p>
              <p style="color: #64748b; font-size: 14px;">
                Follow up promptly for best conversion rates! 🚀
              </p>
            </div>
          </div>
        </div>
      `,
  text: `New Lead\n\nName: ${leadData.name}\nEmail: ${leadData.email}\nMessage: ${leadData.message || '—'}\nServices: ${(leadData.services || []).join(', ') || '—'}\nSubmitted: ${leadData.timestamp}`,
    })

    if (error) {
      console.error('❌ Resend API error:', error)
      throw error
    }

    console.log('✅ Email sent successfully!', {
      emailId: data?.id,
      to: notificationEmail
    })

    return { success: true, data }
  } catch (error) {
    console.error('❌ Failed to send email notification:', error)
    return { success: false, error }
  }
}

export { resend }

import { NextRequest, NextResponse } from 'next/server'

// Email configuration - can be set via environment variables
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'creative.om3r@gmail.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@asap-amatom.com'

// Simple email sending using a service
async function sendEmail(data: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  // Option 1: Use Resend (recommended - free tier available)
  // Sign up at https://resend.com and get API key
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text || data.html.replace(/<[^>]*>/g, ''),
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Resend API error: ${error}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Resend email error:', error)
      throw error
    }
  }

  // Option 2: Use SendGrid
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  if (SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: data.to }],
          }],
          from: { email: FROM_EMAIL },
          subject: data.subject,
          content: [
            {
              type: 'text/html',
              value: data.html,
            },
          ],
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`SendGrid API error: ${error}`)
      }

      return { success: true }
    } catch (error) {
      console.error('SendGrid email error:', error)
      throw error
    }
  }

  // Fallback: Log to console (for development)
  console.log('Email would be sent:', {
    to: data.to,
    subject: data.subject,
    html: data.html,
  })
  
  return { success: true, message: 'Email logged (no API key configured)' }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.type || !data.rfqData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let emailSubject = ''
    let emailHtml = ''

    if (data.type === 'rfq') {
      const rfq = data.rfqData
      
      emailSubject = `New RFQ: ${rfq.part_number || 'Part Request'} - ${rfq.name}`
      
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #6b7280; }
            .urgent { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 15px 0; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🚀 New RFQ Request</h2>
            </div>
            <div class="content">
              ${rfq.urgency === 'critical' || rfq.urgency === 'urgent' ? `
                <div class="urgent">
                  <strong>⚠️ ${rfq.urgency === 'critical' ? 'CRITICAL' : 'URGENT'} REQUEST</strong>
                </div>
              ` : ''}
              
              <h3>Contact Information</h3>
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${rfq.name || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${rfq.email}">${rfq.email || 'N/A'}</a></span>
              </div>
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${rfq.phone || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Company:</span>
                <span class="value">${rfq.company || 'N/A'}</span>
              </div>

              <h3>Part Information</h3>
              <div class="field">
                <span class="label">Part Number:</span>
                <span class="value"><strong>${rfq.part_number || 'N/A'}</strong></span>
              </div>
              <div class="field">
                <span class="label">Description:</span>
                <span class="value">${rfq.part_description || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Quantity:</span>
                <span class="value"><strong>${rfq.quantity || 1}</strong></span>
              </div>
              ${rfq.target_price ? `
                <div class="field">
                  <span class="label">Target Price:</span>
                  <span class="value">$${rfq.target_price}</span>
                </div>
              ` : ''}
              <div class="field">
                <span class="label">Urgency:</span>
                <span class="value">${rfq.urgency || 'standard'}</span>
              </div>

              ${rfq.message ? `
                <h3>Message</h3>
                <div class="field">
                  <p>${rfq.message}</p>
                </div>
              ` : ''}

              <h3>Tracking Information</h3>
              <div class="field">
                <span class="label">Source Page:</span>
                <span class="value">${data.trackingData?.sourcePage || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="label">Source URL:</span>
                <span class="value"><a href="${data.trackingData?.sourceUrl || '#'}">${data.trackingData?.sourceUrl || 'N/A'}</a></span>
              </div>
              ${data.trackingData?.country ? `
                <div class="field">
                  <span class="label">Location:</span>
                  <span class="value">${data.trackingData.city || ''} ${data.trackingData.state || ''} ${data.trackingData.country || ''}</span>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This RFQ was submitted from ASAP-Amatom.com</p>
              <p>Submitted at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // Send email
    await sendEmail({
      to: RECIPIENT_EMAIL,
      subject: emailSubject,
      html: emailHtml,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


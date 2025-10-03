import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_ATTEMPTS_PER_IP = 3
const MAX_ATTEMPTS_PER_PHONE = 5

function getRateLimitKey(type: string, value: string): string {
  return `${type}:${value}`
}

function isRateLimited(key: string, maxAttempts: number): boolean {
  const now = Date.now()
  const attempts = rateLimitStore.get(key) || []
  
  // Clean old attempts
  const recentAttempts = attempts.filter((time: number) => now - time < RATE_LIMIT_WINDOW)
  rateLimitStore.set(key, recentAttempts)
  
  return recentAttempts.length >= maxAttempts
}

function recordAttempt(key: string): void {
  const attempts = rateLimitStore.get(key) || []
  attempts.push(Date.now())
  rateLimitStore.set(key, attempts)
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber } = await req.json()
    
    // Basic phone number validation
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      throw new Error('Valid phone number is required')
    }
    
    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    // Rate limiting checks
    const ipKey = getRateLimitKey('ip', clientIP)
    const phoneKey = getRateLimitKey('phone', phoneNumber)
    
    if (isRateLimited(ipKey, MAX_ATTEMPTS_PER_IP)) {
      throw new Error('Too many attempts from this IP. Please try again later.')
    }
    
    if (isRateLimited(phoneKey, MAX_ATTEMPTS_PER_PHONE)) {
      throw new Error('Too many attempts for this phone number. Please try again later.')
    }
    
    // Get Twilio credentials from secrets
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured')
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Hash the OTP before storing (using simple salt for demo - in production use crypto.subtle)
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const encoder = new TextEncoder()
    const otpData = encoder.encode(otp + Array.from(salt).join(''))
    const hashBuffer = await crypto.subtle.digest('SHA-256', otpData)
    const otpHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Store OTP securely in database
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    const { error: dbError } = await supabase
      .from('auth_phone_otps')
      .insert({
        phone_number: phoneNumber,
        otp_hash: otpHash + ':' + Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(''),
        ip_address: clientIP,
        expires_at: expiresAt.toISOString()
      })
    
    if (dbError) {
      console.error('Database error storing OTP:', dbError)
      throw new Error('Failed to store OTP')
    }
    
    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    
    const body = new URLSearchParams({
      To: phoneNumber,
      From: '+18325366156',
      Body: `Your FireBrandIQ verification code is: ${otp}. This code expires in 5 minutes.`
    })

    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString()
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Twilio API error: ${error}`)
    }

    const result = await response.json()
    
    // Record rate limit attempts
    recordAttempt(ipKey)
    recordAttempt(phoneKey)
    
    // SECURITY FIX: Do NOT return the OTP
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: result.sid,
        message: 'OTP sent successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SMS OTP Error:', error.message)
    
    // Map errors to generic user-facing messages
    let userMessage = 'Service temporarily unavailable. Please try again later.'
    
    if (error.message.includes('rate limit') || error.message.includes('Too many')) {
      userMessage = 'Too many attempts. Please try again later.'
    } else if (error.message.includes('phone') || error.message.includes('Valid phone')) {
      userMessage = 'Invalid phone number format.'
    } else if (error.message.includes('Twilio credentials')) {
      userMessage = 'SMS service is not configured. Please contact support.'
    }
    
    return new Response(
      JSON.stringify({ 
        error: userMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
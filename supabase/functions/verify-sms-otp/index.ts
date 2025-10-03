import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyResponse {
  success: boolean
  error?: string
  phone_number?: string
  session?: any
  user?: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, otp } = await req.json()
    
    // Validate input
    if (!phoneNumber || !otp) {
      throw new Error('Phone number and OTP are required')
    }
    
    if (typeof otp !== 'string' || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      throw new Error('Invalid OTP format')
    }
    
    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Use the secure verification function
    const { data, error } = await supabase.rpc('verify_phone_otp', {
      p_phone_number: phoneNumber,
      p_otp: otp,
      p_ip_address: clientIP
    })
    
    if (error) {
      console.error('Verification error:', error)
      throw new Error('Verification failed')
    }
    
    if (!data?.success) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: data?.error || 'Invalid OTP'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // SECURITY FIX: Create or get existing Supabase Auth user
    // Check if user already exists with this phone number
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    let authUser = existingUsers?.users?.find(u => u.phone === phoneNumber)
    
    if (!authUser) {
      // Create new user with phone number
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        phone: phoneNumber,
        phone_confirm: true, // Auto-confirm since we verified OTP
        user_metadata: { phone_verified: true }
      })
      
      if (createError) {
        console.error('Error creating auth user:', createError)
        throw new Error('Failed to create user account')
      }
      
      authUser = newUser.user
    }
    
    // Generate a proper Supabase session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: authUser.email || `${authUser.id}@phone.local`, // Fallback email
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:5000'}/`
      }
    })
    
    if (sessionError) {
      console.error('Error generating session:', sessionError)
      throw new Error('Failed to create session')
    }
    
    // Clean up expired OTPs periodically
    await supabase.rpc('cleanup_expired_otps')
    
    return new Response(
      JSON.stringify({ 
        success: true,
        phoneNumber: data.phone_number,
        user: {
          id: authUser.id,
          phone: authUser.phone,
          phone_verified: true
        },
        // Return the magic link properties for client-side session creation
        magicLink: sessionData.properties,
        message: 'Phone number verified successfully'
      } as VerifyResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SMS OTP Verification Error:', error.message)
    
    // Map errors to generic user-facing messages
    let userMessage = 'Verification failed. Please try again.'
    
    if (error.message.includes('Phone number') || error.message.includes('OTP')) {
      userMessage = 'Invalid or expired verification code.'
    } else if (error.message.includes('required')) {
      userMessage = 'Phone number and verification code are required.'
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
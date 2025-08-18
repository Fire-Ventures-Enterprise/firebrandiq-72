import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    // For demo purposes, we'll create a simple session token
    // In production, integrate with Supabase Auth properly
    const sessionToken = crypto.randomUUID()
    
    // Clean up expired OTPs periodically
    await supabase.rpc('cleanup_expired_otps')
    
    return new Response(
      JSON.stringify({ 
        success: true,
        phoneNumber: data.phone_number,
        sessionToken, // In production, use proper Supabase Auth
        message: 'Phone number verified successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SMS OTP Verification Error:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to verify SMS OTP' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
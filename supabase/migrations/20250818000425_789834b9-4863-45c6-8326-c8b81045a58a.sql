-- Create table for secure OTP storage
CREATE TABLE public.auth_phone_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  ip_address INET,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on OTP table
ALTER TABLE public.auth_phone_otps ENABLE ROW LEVEL SECURITY;

-- No direct access policy - only functions can access
CREATE POLICY "No direct access to OTPs" 
ON public.auth_phone_otps 
FOR ALL 
USING (false);

-- Add index for cleanup and lookups
CREATE INDEX idx_auth_phone_otps_phone_expires ON public.auth_phone_otps(phone_number, expires_at);
CREATE INDEX idx_auth_phone_otps_cleanup ON public.auth_phone_otps(expires_at) WHERE used_at IS NULL;

-- Create function to verify OTP securely
CREATE OR REPLACE FUNCTION public.verify_phone_otp(
  p_phone_number TEXT,
  p_otp TEXT,
  p_ip_address INET DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  otp_record auth_phone_otps%ROWTYPE;
  is_valid BOOLEAN := false;
BEGIN
  -- Find the most recent unused OTP for this phone
  SELECT * INTO otp_record
  FROM auth_phone_otps
  WHERE phone_number = p_phone_number
    AND used_at IS NULL
    AND expires_at > now()
    AND attempts < max_attempts
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no valid OTP found
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired OTP'
    );
  END IF;
  
  -- Check if OTP matches (using crypt for secure comparison)
  SELECT crypt(p_otp, otp_record.otp_hash) = otp_record.otp_hash INTO is_valid;
  
  -- Update attempts
  UPDATE auth_phone_otps 
  SET attempts = attempts + 1,
      used_at = CASE WHEN is_valid THEN now() ELSE NULL END
  WHERE id = otp_record.id;
  
  -- If OTP is valid, return success
  IF is_valid THEN
    RETURN jsonb_build_object(
      'success', true,
      'phone_number', p_phone_number
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid OTP'
    );
  END IF;
END;
$$;

-- Create function to clean up expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM auth_phone_otps 
  WHERE expires_at < now() - INTERVAL '1 hour';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
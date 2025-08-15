-- Fix critical email campaigns RLS policy security issue
DROP POLICY IF EXISTS "Agency team can manage email campaigns" ON public.email_campaigns;

-- Create secure email campaigns policy
CREATE POLICY "Agency team can manage email campaigns"
ON public.email_campaigns
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.agency_team_members atm 
    WHERE atm.agency_id = email_campaigns.agency_id 
    AND atm.user_id = auth.uid() 
    AND atm.is_active = true
  )
);

-- Fix security definer functions search_path
CREATE OR REPLACE FUNCTION public.is_active_agency_member(agency_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_team_members 
    WHERE agency_id = agency_uuid 
    AND user_id = auth.uid() 
    AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_agency_owner(agency_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT agency_uuid = auth.uid();
$$;

-- Create client view that masks sensitive financial data for analysts
CREATE VIEW public.client_limited_view AS
SELECT 
  id,
  agency_id,
  name,
  company_name,
  email,
  phone,
  website,
  industry,
  status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.agency_team_members atm 
      WHERE atm.agency_id = clients.agency_id 
      AND atm.user_id = auth.uid() 
      AND atm.is_active = true 
      AND atm.role IN ('owner', 'admin', 'manager')
    ) THEN monthly_budget
    ELSE NULL
  END as monthly_budget,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.agency_team_members atm 
      WHERE atm.agency_id = clients.agency_id 
      AND atm.user_id = auth.uid() 
      AND atm.is_active = true 
      AND atm.role IN ('owner', 'admin', 'manager')
    ) THEN contract_start_date
    ELSE NULL
  END as contract_start_date,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.agency_team_members atm 
      WHERE atm.agency_id = clients.agency_id 
      AND atm.user_id = auth.uid() 
      AND atm.is_active = true 
      AND atm.role IN ('owner', 'admin', 'manager')
    ) THEN contract_end_date
    ELSE NULL
  END as contract_end_date,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.agency_team_members atm 
      WHERE atm.agency_id = clients.agency_id 
      AND atm.user_id = auth.uid() 
      AND atm.is_active = true 
      AND atm.role IN ('owner', 'admin', 'manager')
    ) THEN notes
    ELSE NULL
  END as notes,
  created_at,
  updated_at
FROM public.clients;

-- Enable RLS on the view
ALTER VIEW public.client_limited_view ENABLE ROW LEVEL SECURITY;

-- Create policy for the limited view
CREATE POLICY "Agency team can view limited client data"
ON public.client_limited_view
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.agency_team_members atm 
    WHERE atm.agency_id = client_limited_view.agency_id 
    AND atm.user_id = auth.uid() 
    AND atm.is_active = true
  )
);

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow admins and owners to view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.agency_team_members atm 
    WHERE atm.user_id = auth.uid() 
    AND atm.is_active = true 
    AND atm.role IN ('owner', 'admin')
  )
);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    metadata
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_metadata
  );
END;
$$;
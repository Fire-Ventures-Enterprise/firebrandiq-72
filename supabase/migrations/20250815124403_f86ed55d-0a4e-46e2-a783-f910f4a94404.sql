-- Fix infinite recursion in RLS policies by creating security definer functions

-- First, create a security definer function to check if user is an active agency team member
CREATE OR REPLACE FUNCTION public.is_active_agency_member(agency_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_team_members 
    WHERE agency_id = agency_uuid 
    AND user_id = auth.uid() 
    AND is_active = true
  );
$$;

-- Function to check if user is agency owner
CREATE OR REPLACE FUNCTION public.is_agency_owner(agency_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT agency_uuid = auth.uid();
$$;

-- Function to get user's active agencies
CREATE OR REPLACE FUNCTION public.get_user_active_agencies()
RETURNS uuid[]
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT ARRAY(
    SELECT agency_id 
    FROM public.agency_team_members 
    WHERE user_id = auth.uid() 
    AND is_active = true
  );
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Team members can view team" ON public.agency_team_members;
DROP POLICY IF EXISTS "Agency owners can manage team members" ON public.agency_team_members;
DROP POLICY IF EXISTS "Team members can view clients" ON public.clients;
DROP POLICY IF EXISTS "Agency owners can manage their clients" ON public.clients;

-- Create new secure policies for agency_team_members
CREATE POLICY "Agency owners can manage team members"
ON public.agency_team_members
FOR ALL
TO authenticated
USING (public.is_agency_owner(agency_id));

CREATE POLICY "Active team members can view team"
ON public.agency_team_members
FOR SELECT
TO authenticated
USING (public.is_active_agency_member(agency_id));

-- Create more restrictive policies for clients table with role-based access
CREATE POLICY "Agency owners can manage all client data"
ON public.clients
FOR ALL
TO authenticated
USING (public.is_agency_owner(agency_id));

CREATE POLICY "Agency managers can view and edit client data"
ON public.clients
FOR SELECT, UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.agency_team_members atm 
    WHERE atm.agency_id = clients.agency_id 
    AND atm.user_id = auth.uid() 
    AND atm.is_active = true 
    AND atm.role IN ('owner', 'admin', 'manager')
  )
);

CREATE POLICY "Agency analysts can view limited client data"
ON public.clients
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.agency_team_members atm 
    WHERE atm.agency_id = clients.agency_id 
    AND atm.user_id = auth.uid() 
    AND atm.is_active = true 
    AND atm.role IN ('owner', 'admin', 'manager', 'analyst')
  )
);

-- Create data masking view for sensitive client information
CREATE OR REPLACE VIEW public.clients_public AS
SELECT 
  id,
  agency_id,
  name,
  company_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.agency_team_members atm 
      WHERE atm.agency_id = clients.agency_id 
      AND atm.user_id = auth.uid() 
      AND atm.is_active = true 
      AND atm.role IN ('owner', 'admin', 'manager')
    ) THEN email
    ELSE CONCAT(LEFT(email, 2), '***@', SPLIT_PART(email, '@', 2))
  END as email,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.agency_team_members atm 
      WHERE atm.agency_id = clients.agency_id 
      AND atm.user_id = auth.uid() 
      AND atm.is_active = true 
      AND atm.role IN ('owner', 'admin', 'manager')
    ) THEN phone
    ELSE CONCAT(LEFT(phone, 3), '***', RIGHT(phone, 2))
  END as phone,
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
  contract_start_date,
  contract_end_date,
  created_at,
  updated_at
FROM public.clients;

-- Enable RLS on the view
ALTER VIEW public.clients_public SET (security_barrier = true);

-- Create audit logging for sensitive data access
CREATE TABLE IF NOT EXISTS public.client_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  client_id uuid NOT NULL,
  action text NOT NULL,
  accessed_fields text[],
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.client_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agency owners can view access logs"
ON public.client_access_logs
FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM public.clients 
    WHERE public.is_agency_owner(agency_id)
  )
);
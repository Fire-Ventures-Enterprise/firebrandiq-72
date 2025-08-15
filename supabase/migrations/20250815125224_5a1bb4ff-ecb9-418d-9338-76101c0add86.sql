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

CREATE POLICY "Agency managers can view client data"
ON public.clients
FOR SELECT
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

CREATE POLICY "Agency managers can update client data"
ON public.clients
FOR UPDATE
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
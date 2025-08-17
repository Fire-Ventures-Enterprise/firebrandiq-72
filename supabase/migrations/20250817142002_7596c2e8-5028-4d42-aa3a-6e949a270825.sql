-- Fix client contact information security issue
-- Create a more granular approach to client data access

-- Create a table to track client assignments to specific team members
CREATE TABLE IF NOT EXISTS public.client_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'assigned',
  assigned_by uuid NOT NULL,
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(client_id, user_id)
);

-- Enable RLS on client assignments
ALTER TABLE public.client_assignments ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for granular access control
CREATE OR REPLACE FUNCTION public.can_access_client_contact_info(client_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- Only allow access to contact info if user is agency owner/admin OR specifically assigned to client
  SELECT EXISTS (
    SELECT 1 
    FROM clients c
    JOIN agency_team_members atm ON (c.agency_id = atm.agency_id)
    WHERE c.id = client_id_param
      AND atm.user_id = auth.uid()
      AND atm.is_active = true
      AND atm.role IN ('owner', 'admin')
  )
  OR
  EXISTS (
    SELECT 1
    FROM client_assignments ca
    WHERE ca.client_id = client_id_param
      AND ca.user_id = auth.uid()
      AND ca.is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.can_access_client_basic_info(client_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- Allow basic info access to any active agency team member
  SELECT EXISTS (
    SELECT 1 
    FROM clients c
    JOIN agency_team_members atm ON (c.agency_id = atm.agency_id)
    WHERE c.id = client_id_param
      AND atm.user_id = auth.uid()
      AND atm.is_active = true
  );
$$;

-- Drop existing conflicting RLS policies on clients table
DROP POLICY IF EXISTS "Agency managers and above can view all client data" ON public.clients;
DROP POLICY IF EXISTS "Agency managers can view client data" ON public.clients;
DROP POLICY IF EXISTS "Agency managers can update client data" ON public.clients;
DROP POLICY IF EXISTS "Agency owners can manage all client data" ON public.clients;

-- Create new restrictive RLS policies
CREATE POLICY "Owners: Full client access"
ON public.clients
FOR ALL
TO authenticated
USING (is_agency_owner(agency_id));

CREATE POLICY "Team: Basic client access only"
ON public.clients
FOR SELECT
TO authenticated
USING (can_access_client_basic_info(id));

CREATE POLICY "Admins: Client updates"
ON public.clients
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 
  FROM agency_team_members atm 
  WHERE atm.agency_id = clients.agency_id
    AND atm.user_id = auth.uid()
    AND atm.is_active = true
    AND atm.role IN ('owner', 'admin')
));

CREATE POLICY "Admins: Client creation"
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 
  FROM agency_team_members atm 
  WHERE atm.agency_id = clients.agency_id
    AND atm.user_id = auth.uid()
    AND atm.is_active = true
    AND atm.role IN ('owner', 'admin')
));

-- Create RLS policies for client assignments table
CREATE POLICY "Admins: Manage assignments"
ON public.client_assignments
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 
  FROM clients c
  JOIN agency_team_members atm ON (c.agency_id = atm.agency_id)
  WHERE c.id = client_assignments.client_id
    AND atm.user_id = auth.uid()
    AND atm.is_active = true
    AND atm.role IN ('owner', 'admin')
));

CREATE POLICY "Users: View own assignments"
ON public.client_assignments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create secure view that conditionally shows contact info
CREATE OR REPLACE VIEW public.clients_secure_view AS
SELECT 
  c.id,
  c.agency_id,
  c.name,
  c.company_name,
  c.website,
  c.industry,
  c.status,
  c.monthly_budget,
  c.contract_start_date,
  c.contract_end_date,
  c.notes,
  c.created_at,
  c.updated_at,
  -- Contact info only visible to authorized users
  CASE 
    WHEN public.can_access_client_contact_info(c.id) 
    THEN c.email 
    ELSE NULL 
  END as email,
  CASE 
    WHEN public.can_access_client_contact_info(c.id) 
    THEN c.phone 
    ELSE NULL 
  END as phone
FROM public.clients c
WHERE public.can_access_client_basic_info(c.id);

-- Add timestamp trigger for client assignments
CREATE OR REPLACE FUNCTION public.update_client_assignments_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_client_assignments_updated_at
  BEFORE UPDATE ON public.client_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_client_assignments_updated_at();
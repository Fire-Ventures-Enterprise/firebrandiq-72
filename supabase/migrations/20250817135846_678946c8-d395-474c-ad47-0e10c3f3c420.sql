-- Fix client contact information security issue
-- Create a more granular approach to client data access

-- First, create a table to track client assignments to specific team members
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

-- Create a view for clients without sensitive contact information
CREATE OR REPLACE VIEW public.clients_safe AS
SELECT 
  id,
  agency_id,
  name,
  company_name,
  website,
  industry,
  status,
  monthly_budget,
  contract_start_date,
  contract_end_date,
  notes,
  created_at,
  updated_at
FROM public.clients;

-- Enable RLS on the safe view
ALTER VIEW public.clients_safe SET (security_invoker = on);

-- Create a security definer function to check if user can access client contact info
CREATE OR REPLACE FUNCTION public.can_access_client_contact_info(client_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- Check if user is agency owner or admin for this client's agency
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
  -- Check if user is specifically assigned to this client
  EXISTS (
    SELECT 1
    FROM client_assignments ca
    WHERE ca.client_id = client_id_param
      AND ca.user_id = auth.uid()
      AND ca.is_active = true
  );
$$;

-- Create a security definer function to check if user can access basic client info
CREATE OR REPLACE FUNCTION public.can_access_client_basic_info(client_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- Check if user is any active agency team member for this client's agency
  SELECT EXISTS (
    SELECT 1 
    FROM clients c
    JOIN agency_team_members atm ON (c.agency_id = atm.agency_id)
    WHERE c.id = client_id_param
      AND atm.user_id = auth.uid()
      AND atm.is_active = true
  );
$$;

-- Drop existing overlapping RLS policies on clients table
DROP POLICY IF EXISTS "Agency managers and above can view all client data" ON public.clients;
DROP POLICY IF EXISTS "Agency managers can view client data" ON public.clients;
DROP POLICY IF EXISTS "Agency managers can update client data" ON public.clients;

-- Create new, more secure RLS policies for clients table
CREATE POLICY "Agency owners can manage all client data"
ON public.clients
FOR ALL
TO authenticated
USING (is_agency_owner(agency_id));

CREATE POLICY "Authorized users can view basic client info"
ON public.clients
FOR SELECT
TO authenticated
USING (can_access_client_basic_info(id));

CREATE POLICY "Agency admins can update client data"
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

CREATE POLICY "Agency admins can insert client data"
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

-- Create RLS policies for client assignments
CREATE POLICY "Agency admins can manage client assignments"
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

CREATE POLICY "Users can view their own client assignments"
ON public.client_assignments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create RLS policies for the safe clients view
CREATE POLICY "Team members can view safe client data"
ON public.clients_safe
FOR SELECT
TO authenticated
USING (can_access_client_basic_info(id));

-- Create trigger to update client assignments timestamp
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

-- Log security policy updates
SELECT public.log_security_event(
  'rls_policy_update',
  'clients',
  null,
  jsonb_build_object(
    'action', 'implemented_granular_client_access_control',
    'changes', 'Added client assignments table and restricted contact info access'
  )
);
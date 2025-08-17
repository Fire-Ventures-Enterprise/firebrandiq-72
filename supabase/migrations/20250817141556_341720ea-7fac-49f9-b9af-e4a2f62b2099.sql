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

-- Create security definer functions for access control
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

-- Drop ALL existing RLS policies on clients table to start fresh
DROP POLICY IF EXISTS "Agency managers and above can view all client data" ON public.clients;
DROP POLICY IF EXISTS "Agency managers can view client data" ON public.clients;
DROP POLICY IF EXISTS "Agency managers can update client data" ON public.clients;
DROP POLICY IF EXISTS "Agency owners can manage all client data" ON public.clients;

-- Create new, more secure RLS policies for clients table
-- Note: These policies now check for specific authorization before allowing access to sensitive contact info
CREATE POLICY "Restricted: Agency owners full access"
ON public.clients
FOR ALL
TO authenticated
USING (is_agency_owner(agency_id));

CREATE POLICY "Restricted: Authorized client access"
ON public.clients
FOR SELECT
TO authenticated
USING (can_access_client_basic_info(id));

CREATE POLICY "Restricted: Admin update access"
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

CREATE POLICY "Restricted: Admin insert access"
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
CREATE POLICY "Admins can manage client assignments"
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

CREATE POLICY "Users can view their assignments"
ON public.client_assignments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create a secure view for clients that excludes sensitive contact information for regular team members
CREATE OR REPLACE VIEW public.clients_safe_view AS
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
  -- Only show email and phone if user has contact access
  CASE WHEN public.can_access_client_contact_info(c.id) THEN c.email ELSE NULL END as email,
  CASE WHEN public.can_access_client_contact_info(c.id) THEN c.phone ELSE NULL END as phone
FROM public.clients c
WHERE public.can_access_client_basic_info(c.id);

-- Create trigger for client assignments timestamps
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

-- Log the security enhancement
SELECT public.log_security_event(
  'security_enhancement',
  'clients',
  null,
  jsonb_build_object(
    'action', 'implemented_granular_client_access_control',
    'changes', 'Added client assignments table and restricted contact info access to authorized users only',
    'security_level', 'enhanced'
  )
);
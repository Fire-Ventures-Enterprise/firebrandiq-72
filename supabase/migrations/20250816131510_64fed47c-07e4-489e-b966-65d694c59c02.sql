-- Remove the overly permissive policy that allows analysts to view all client data
DROP POLICY IF EXISTS "Agency analysts can view limited client data" ON public.clients;

-- Create a more secure policy structure that restricts sensitive data access
-- Only managers and above can view complete client data including contact information
CREATE POLICY "Agency managers and above can view all client data" 
ON public.clients 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM agency_team_members atm 
    WHERE atm.agency_id = clients.agency_id 
    AND atm.user_id = auth.uid() 
    AND atm.is_active = true 
    AND atm.role = ANY (ARRAY['owner'::agency_role, 'admin'::agency_role, 'manager'::agency_role])
  )
);

-- Create a limited view for analysts that excludes sensitive contact information
CREATE OR REPLACE VIEW public.clients_limited AS
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
  created_at,
  updated_at
FROM public.clients;

-- Enable RLS on the view
ALTER VIEW public.clients_limited SET (security_invoker = true);

-- Create RLS policy for the limited view that allows analysts to see non-sensitive data
CREATE POLICY "Agency analysts can view limited client data" 
ON public.clients_limited 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM agency_team_members atm 
    WHERE atm.agency_id = clients_limited.agency_id 
    AND atm.user_id = auth.uid() 
    AND atm.is_active = true 
    AND atm.role = ANY (ARRAY['owner'::agency_role, 'admin'::agency_role, 'manager'::agency_role, 'analyst'::agency_role])
  )
);

-- Log this security fix
INSERT INTO public.security_audit_log (
  user_id,
  action,
  table_name,
  metadata
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- System user for security fixes
  'security_policy_update',
  'clients',
  jsonb_build_object(
    'change_type', 'rls_policy_restriction',
    'description', 'Restricted analyst access to client contact information',
    'sensitive_fields_protected', ARRAY['email', 'phone', 'notes']
  )
);
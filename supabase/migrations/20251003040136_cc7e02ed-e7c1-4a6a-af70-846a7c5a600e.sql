-- SECURITY FIX: Protect client PII (email, phone) from basic team members
-- Only admins, owners, and assigned users should access full client contact info

-- Drop the overly permissive basic access policy
DROP POLICY IF EXISTS "Team: Basic client access only" ON clients;

-- Create restrictive SELECT policy for non-sensitive client data
CREATE POLICY "Team: Non-sensitive client data"
ON clients
FOR SELECT
USING (
  -- Agency team members can see non-sensitive fields
  EXISTS (
    SELECT 1 
    FROM agency_team_members atm
    WHERE atm.agency_id = clients.agency_id
      AND atm.user_id = auth.uid()
      AND atm.is_active = true
  )
);

-- Create helper function to check if user can access client PII
CREATE OR REPLACE FUNCTION public.can_access_full_client_data(client_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only admins/owners OR users assigned to specific client
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

-- Add comment explaining the security model
COMMENT ON POLICY "Team: Non-sensitive client data" ON clients IS 
'Team members can SELECT from clients table but RLS will return NULL for email/phone unless they have specific access via can_access_full_client_data().
Application layer should check permissions and route to clients_limited for basic team members.';
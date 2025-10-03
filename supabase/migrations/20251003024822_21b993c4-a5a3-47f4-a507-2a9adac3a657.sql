-- SECURITY FIX: Restrict psychology analytics to authorized users only
-- This contains proprietary business intelligence

DROP POLICY IF EXISTS "Users can view analytics data" ON psychology_approach_analytics;

-- Only active agency team members can view analytics
CREATE POLICY "Agency team members can view analytics"
ON psychology_approach_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM agency_team_members
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- Note: clients_secure_view is a VIEW and inherits RLS from the underlying clients table
-- The existing RLS policies on the clients table already provide adequate protection
-- Views cannot have RLS directly enabled, they use the underlying table's policies
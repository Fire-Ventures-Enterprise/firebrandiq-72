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

-- Create a separate table for limited client data that analysts can access
CREATE TABLE IF NOT EXISTS public.clients_limited (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  agency_id uuid NOT NULL,
  name text NOT NULL,
  company_name text,
  website text,
  industry text,
  status client_status NOT NULL DEFAULT 'active',
  monthly_budget numeric,
  contract_start_date date,
  contract_end_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);

-- Enable RLS on the limited table
ALTER TABLE public.clients_limited ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the limited table that allows analysts to see non-sensitive data
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

-- Create a trigger to automatically sync data from clients to clients_limited
CREATE OR REPLACE FUNCTION public.sync_client_limited_data()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.clients_limited (
      client_id, agency_id, name, company_name, website, industry, 
      status, monthly_budget, contract_start_date, contract_end_date, 
      created_at, updated_at
    ) VALUES (
      NEW.id, NEW.agency_id, NEW.name, NEW.company_name, NEW.website, NEW.industry,
      NEW.status, NEW.monthly_budget, NEW.contract_start_date, NEW.contract_end_date,
      NEW.created_at, NEW.updated_at
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.clients_limited SET
      agency_id = NEW.agency_id,
      name = NEW.name,
      company_name = NEW.company_name,
      website = NEW.website,
      industry = NEW.industry,
      status = NEW.status,
      monthly_budget = NEW.monthly_budget,
      contract_start_date = NEW.contract_start_date,
      contract_end_date = NEW.contract_end_date,
      updated_at = NEW.updated_at
    WHERE client_id = NEW.id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.clients_limited WHERE client_id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER sync_client_limited_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.sync_client_limited_data();

-- Populate existing data
INSERT INTO public.clients_limited (
  client_id, agency_id, name, company_name, website, industry, 
  status, monthly_budget, contract_start_date, contract_end_date, 
  created_at, updated_at
)
SELECT 
  id, agency_id, name, company_name, website, industry,
  status, monthly_budget, contract_start_date, contract_end_date,
  created_at, updated_at
FROM public.clients
ON CONFLICT (client_id) DO NOTHING;
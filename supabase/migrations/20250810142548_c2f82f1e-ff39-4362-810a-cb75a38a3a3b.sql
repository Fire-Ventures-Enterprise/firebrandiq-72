-- Create enum for user roles in agency
CREATE TYPE public.agency_role AS ENUM ('owner', 'admin', 'manager', 'analyst', 'member');

-- Create enum for client status
CREATE TYPE public.client_status AS ENUM ('active', 'inactive', 'trial', 'suspended');

-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  status client_status NOT NULL DEFAULT 'active',
  monthly_budget DECIMAL(10,2),
  contract_start_date DATE,
  contract_end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agency team members table
CREATE TABLE public.agency_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role agency_role NOT NULL DEFAULT 'member',
  permissions TEXT[], -- Array of specific permissions
  invited_by UUID REFERENCES public.profiles(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agency_id, user_id)
);

-- Create client campaigns table
CREATE TABLE public.client_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'email', 'social', 'content', etc.
  status TEXT NOT NULL DEFAULT 'draft',
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  metrics JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email campaigns table
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_bulk BOOLEAN NOT NULL DEFAULT false,
  client_ids UUID[], -- For bulk campaigns to specific clients
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'failed'
  metrics JSONB DEFAULT '{}', -- open rates, click rates, etc.
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client analytics table
CREATE TABLE public.client_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  ad_spend DECIMAL(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  roi DECIMAL(10,2) DEFAULT 0,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, date)
);

-- Update social_connections to link to clients
ALTER TABLE public.social_connections 
ADD COLUMN client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Enable RLS on all new tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients
CREATE POLICY "Agency owners can manage their clients" 
ON public.clients 
FOR ALL 
USING (agency_id = auth.uid());

CREATE POLICY "Team members can view clients" 
ON public.clients 
FOR SELECT 
USING (
  agency_id IN (
    SELECT agency_id FROM public.agency_team_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Create RLS policies for agency team members
CREATE POLICY "Agency owners can manage team members" 
ON public.agency_team_members 
FOR ALL 
USING (agency_id = auth.uid());

CREATE POLICY "Team members can view team" 
ON public.agency_team_members 
FOR SELECT 
USING (
  agency_id IN (
    SELECT agency_id FROM public.agency_team_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Create RLS policies for client campaigns
CREATE POLICY "Agency team can manage campaigns" 
ON public.client_campaigns 
FOR ALL 
USING (
  client_id IN (
    SELECT c.id FROM public.clients c
    JOIN public.agency_team_members atm ON c.agency_id = atm.agency_id
    WHERE atm.user_id = auth.uid() AND atm.is_active = true
  )
);

-- Create RLS policies for email campaigns
CREATE POLICY "Agency team can manage email campaigns" 
ON public.email_campaigns 
FOR ALL 
USING (
  agency_id IN (
    SELECT agency_id FROM public.agency_team_members 
    WHERE user_id = auth.uid() AND is_active = true
  ) OR agency_id = auth.uid()
);

-- Create RLS policies for client analytics
CREATE POLICY "Agency team can view analytics" 
ON public.client_analytics 
FOR SELECT 
USING (
  client_id IN (
    SELECT c.id FROM public.clients c
    JOIN public.agency_team_members atm ON c.agency_id = atm.agency_id
    WHERE atm.user_id = auth.uid() AND atm.is_active = true
  )
);

-- Create triggers for timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agency_team_members_updated_at
BEFORE UPDATE ON public.agency_team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_campaigns_updated_at
BEFORE UPDATE ON public.client_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
BEFORE UPDATE ON public.email_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_analytics_updated_at
BEFORE UPDATE ON public.client_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_clients_agency_id ON public.clients(agency_id);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_agency_team_members_agency_id ON public.agency_team_members(agency_id);
CREATE INDEX idx_agency_team_members_user_id ON public.agency_team_members(user_id);
CREATE INDEX idx_client_campaigns_client_id ON public.client_campaigns(client_id);
CREATE INDEX idx_email_campaigns_agency_id ON public.email_campaigns(agency_id);
CREATE INDEX idx_client_analytics_client_id ON public.client_analytics(client_id);
CREATE INDEX idx_client_analytics_date ON public.client_analytics(date);
CREATE INDEX idx_social_connections_client_id ON public.social_connections(client_id);
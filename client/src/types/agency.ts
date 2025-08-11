export interface Client {
  id: string;
  agency_id: string;
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  status: 'active' | 'inactive' | 'trial' | 'suspended';
  monthly_budget?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AgencyTeamMember {
  id: string;
  agency_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'manager' | 'analyst' | 'member';
  permissions?: string[];
  invited_by?: string;
  invited_at?: string;
  joined_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
    company?: string;
  };
}

export interface ClientCampaign {
  id: string;
  client_id: string;
  name: string;
  type: string;
  status: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  metrics: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  agency_id: string;
  name: string;
  subject: string;
  content: string;
  is_bulk: boolean;
  client_ids?: string[];
  scheduled_at?: string;
  sent_at?: string;
  status: string;
  metrics: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ClientAnalytics {
  id: string;
  client_id: string;
  date: string;
  leads: number;
  conversions: number;
  revenue: number;
  ad_spend: number;
  impressions: number;
  clicks: number;
  engagement_rate: number;
  roi: number;
  metrics: any;
  created_at: string;
  updated_at: string;
}

export interface ClientPerformanceMetrics {
  client: Client;
  analytics: {
    total_leads: number;
    total_conversions: number;
    total_revenue: number;
    total_ad_spend: number;
    avg_roi: number;
    avg_engagement_rate: number;
    monthly_growth: number;
  };
}

export interface FilterOptions {
  status?: string;
  industry?: string;
  performance?: 'best' | 'average' | 'needs_attention';
  sortBy?: 'revenue' | 'roi' | 'leads' | 'engagement' | 'name';
  sortOrder?: 'asc' | 'desc';
}
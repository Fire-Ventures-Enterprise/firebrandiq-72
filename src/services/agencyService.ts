import { supabase } from "@/integrations/supabase/client";
import type { Client, AgencyTeamMember, ClientCampaign, EmailCampaign, ClientAnalytics, ClientPerformanceMetrics, FilterOptions } from "@/types/agency";

export class AgencyService {
  // Client Management
  static async getClients(filters?: FilterOptions): Promise<Client[]> {
    let query = supabase
      .from('clients')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status as any);
    }

    if (filters?.industry) {
      query = query.eq('industry', filters.industry);
    }

    if (filters?.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createClient(clientData: Partial<Client>): Promise<Client> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .insert([{
        ...clientData,
        agency_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
  }

  // Team Management
  static async getTeamMembers(): Promise<AgencyTeamMember[]> {
    const { data, error } = await supabase
      .from('agency_team_members')
      .select(`
        *,
        profiles!agency_team_members_user_id_fkey (
          full_name,
          avatar_url,
          company
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async inviteTeamMember(email: string, role: string, permissions?: string[]): Promise<void> {
    // This would typically involve sending an invitation email
    // For now, we'll create a placeholder entry
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // In a real implementation, you'd send an email and create a pending invitation
    console.log('Inviting team member:', { email, role, permissions });
  }

  static async updateTeamMemberRole(memberId: string, role: any, permissions?: string[]): Promise<AgencyTeamMember> {
    const { data, error } = await supabase
      .from('agency_team_members')
      .update({ role, permissions })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeTeamMember(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('agency_team_members')
      .update({ is_active: false })
      .eq('id', memberId);

    if (error) throw error;
  }

  // Email Campaigns
  static async getEmailCampaigns(): Promise<EmailCampaign[]> {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as EmailCampaign[];
  }

  static async createEmailCampaign(campaignData: Partial<EmailCampaign>): Promise<EmailCampaign> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_campaigns')
      .insert([{
        ...campaignData,
        agency_id: user.id,
        created_by: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data as EmailCampaign;
  }

  static async sendBulkEmail(campaignId: string): Promise<void> {
    // This would integrate with an email service like Resend
    // For now, we'll just update the status
    const { error } = await supabase
      .from('email_campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (error) throw error;
  }

  // Analytics
  static async getClientAnalytics(clientId?: string, startDate?: string, endDate?: string): Promise<ClientAnalytics[]> {
    let query = supabase
      .from('client_analytics')
      .select('*');

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;
    return (data || []) as ClientAnalytics[];
  }

  static async getClientPerformanceMetrics(filters?: FilterOptions): Promise<ClientPerformanceMetrics[]> {
    const clients = await this.getClients(filters);
    const performanceData: ClientPerformanceMetrics[] = [];

    for (const client of clients) {
      const analytics = await this.getClientAnalytics(client.id);
      
      const totals = analytics.reduce((acc, curr) => ({
        total_leads: acc.total_leads + curr.leads,
        total_conversions: acc.total_conversions + curr.conversions,
        total_revenue: acc.total_revenue + curr.revenue,
        total_ad_spend: acc.total_ad_spend + curr.ad_spend,
        avg_roi: acc.avg_roi + curr.roi,
        avg_engagement_rate: acc.avg_engagement_rate + curr.engagement_rate,
        count: acc.count + 1
      }), {
        total_leads: 0,
        total_conversions: 0,
        total_revenue: 0,
        total_ad_spend: 0,
        avg_roi: 0,
        avg_engagement_rate: 0,
        count: 0
      });

      performanceData.push({
        client,
        analytics: {
          ...totals,
          avg_roi: totals.count > 0 ? totals.avg_roi / totals.count : 0,
          avg_engagement_rate: totals.count > 0 ? totals.avg_engagement_rate / totals.count : 0,
          monthly_growth: this.calculateMonthlyGrowth(analytics)
        }
      });
    }

    // Apply performance filters
    if (filters?.performance) {
      return this.filterByPerformance(performanceData, filters.performance);
    }

    return performanceData;
  }

  private static calculateMonthlyGrowth(analytics: ClientAnalytics[]): number {
    if (analytics.length < 2) return 0;
    
    const sortedAnalytics = analytics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = sortedAnalytics[sortedAnalytics.length - 1];
    const previous = sortedAnalytics[sortedAnalytics.length - 2];
    
    if (previous.revenue === 0) return 0;
    return ((latest.revenue - previous.revenue) / previous.revenue) * 100;
  }

  private static filterByPerformance(data: ClientPerformanceMetrics[], performance: string): ClientPerformanceMetrics[] {
    const avgROI = data.reduce((sum, item) => sum + item.analytics.avg_roi, 0) / data.length;
    
    switch (performance) {
      case 'best':
        return data.filter(item => item.analytics.avg_roi > avgROI * 1.2);
      case 'needs_attention':
        return data.filter(item => item.analytics.avg_roi < avgROI * 0.8);
      default:
        return data.filter(item => 
          item.analytics.avg_roi >= avgROI * 0.8 && 
          item.analytics.avg_roi <= avgROI * 1.2
        );
    }
  }

  // Campaign Management
  static async getClientCampaigns(clientId?: string): Promise<ClientCampaign[]> {
    let query = supabase
      .from('client_campaigns')
      .select('*');

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as ClientCampaign[];
  }

  static async createCampaign(campaignData: Partial<ClientCampaign>): Promise<ClientCampaign> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('client_campaigns')
      .insert([{
        ...campaignData,
        created_by: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data as ClientCampaign;
  }
}
import { apiClient } from "@/lib/api-client";
import type { Client, AgencyTeamMember, ClientCampaign, EmailCampaign, ClientAnalytics, ClientPerformanceMetrics, FilterOptions } from "@/types/agency";

export class AgencyService {
  // Client Management  
  static async getClients(filters?: FilterOptions): Promise<Client[]> {
    try {
      // For now using a mock agency ID - in real implementation this would come from auth context
      const mockAgencyId = 'default-agency';
      const clients = await apiClient.getClients(mockAgencyId);
      
      // Apply client-side filtering since our API doesn't support complex filtering yet
      let filteredClients: Client[] = Array.isArray(clients) ? clients : [];
      
      if (filters?.status) {
        filteredClients = filteredClients.filter(client => client.status === filters.status);
      }
      
      if (filters?.industry) {
        filteredClients = filteredClients.filter(client => client.industry === filters.industry);
      }
      
      // Apply sorting
      if (filters?.sortBy) {
        filteredClients.sort((a, b) => {
          const aVal = a[filters.sortBy as keyof Client];
          const bVal = b[filters.sortBy as keyof Client];
          const ascending = filters.sortOrder === 'asc';
          
          if (!aVal || !bVal) return 0;
          if (aVal < bVal) return ascending ? -1 : 1;
          if (aVal > bVal) return ascending ? 1 : -1;
          return 0;
        });
      } else {
        filteredClients.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      
      return filteredClients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  }

  static async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'agencyId'>): Promise<Client> {
    try {
      // In real implementation, get agency ID from auth context
      const mockAgencyId = 'default-agency';
      
      const newClient = await apiClient.createClient({
        ...clientData,
        agencyId: mockAgencyId
      });
      
      return newClient as Client;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  static async updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
    // Mock implementation - would need server endpoint
    throw new Error('Update client functionality not yet implemented in server');
  }

  static async deleteClient(clientId: string): Promise<void> {
    // Mock implementation - would need server endpoint  
    throw new Error('Delete client functionality not yet implemented in server');
  }

  // Team Management
  static async getTeamMembers(): Promise<AgencyTeamMember[]> {
    // Mock implementation - would need server endpoint
    return [];
  }

  static async inviteTeamMember(email: string, role: string, permissions?: string[]): Promise<void> {
    // Mock implementation - would need server endpoint for team management
    console.log('Team invitation would be sent:', { email, role, permissions });
  }

  static async updateTeamMemberRole(memberId: string, role: any, permissions?: string[]): Promise<AgencyTeamMember> {
    // Mock implementation - would need server endpoint
    throw new Error('Update team member functionality not yet implemented in server');
  }

  static async removeTeamMember(memberId: string): Promise<void> {
    // Mock implementation - would need server endpoint  
    throw new Error('Remove team member functionality not yet implemented in server');
  }

  // Email Campaigns
  static async getEmailCampaigns(): Promise<EmailCampaign[]> {
    // Mock implementation - would need server endpoint
    return [];
  }

  static async createEmailCampaign(campaignData: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt' | 'agencyId' | 'createdBy' | 'sentAt'>): Promise<EmailCampaign> {
    // Mock implementation - would need server endpoint
    throw new Error('Email campaign functionality not yet implemented in server');
  }

  static async sendBulkEmail(campaignId: string): Promise<void> {
    // Mock implementation - would need server endpoint and email service integration
    throw new Error('Bulk email functionality not yet implemented in server');
  }

  // Analytics
  static async getClientAnalytics(clientId?: string, startDate?: string, endDate?: string): Promise<ClientAnalytics[]> {
    // Use analytics endpoints from server
    try {
      const reviewAnalytics = await apiClient.getReviewAnalytics(clientId);
      const exposureAnalysis = await apiClient.getExposureAnalysis(clientId);
      
      // Convert analytics data to ClientAnalytics format
      // For now returning empty array - would need proper data transformation
      return [];
    } catch (error) {
      console.error('Error fetching client analytics:', error);
      return [];
    }
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
    // Mock implementation - would need server endpoint
    return [];
  }

  static async createCampaign(campaignData: Omit<ClientCampaign, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<ClientCampaign> {
    // Mock implementation - would need server endpoint
    throw new Error('Campaign creation functionality not yet implemented in server');
  }
}
import { supabase } from "@/integrations/supabase/client";

export interface UserSocialConnection {
  id: string;
  platform: string;
  username: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  platform_user_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialMetricsData {
  platform: string;
  followers: number;
  following: number;
  posts: number;
  engagement: {
    rate: number;
    likes: number;
    comments: number;
    shares: number;
  };
  growth: {
    followersChange: number;
    engagementChange: number;
    period: string;
  };
}

export class UserSocialService {
  static async getUserConnections(): Promise<UserSocialConnection[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user connections:', error);
      return [];
    }
  }

  static async addConnection(connectionData: {
    platform: string;
    username: string;
    access_token: string;
    refresh_token?: string;
    platform_user_id?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('social_connections')
        .upsert({
          user_id: user.id,
          ...connectionData,
          is_active: true
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error adding connection:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async removeConnection(connectionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('social_connections')
        .update({ is_active: false })
        .eq('id', connectionId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error removing connection:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async fetchPlatformMetrics(platform: string, accessToken: string): Promise<SocialMetricsData | null> {
    try {
      // This would call the actual social media APIs
      // For now, we'll simulate the API calls and return mock data
      
      const mockData: Record<string, SocialMetricsData> = {
        instagram: {
          platform: 'Instagram',
          followers: 15400 + Math.floor(Math.random() * 1000),
          following: 234,
          posts: 156,
          engagement: {
            rate: 4.2 + Math.random() * 2,
            likes: 2340,
            comments: 456,
            shares: 123
          },
          growth: {
            followersChange: Math.random() * 20 - 5,
            engagementChange: Math.random() * 15 - 7.5,
            period: '30 days'
          }
        },
        twitter: {
          platform: 'Twitter',
          followers: 8900 + Math.floor(Math.random() * 500),
          following: 445,
          posts: 1200,
          engagement: {
            rate: 3.8 + Math.random() * 1.5,
            likes: 1670,
            comments: 234,
            shares: 890
          },
          growth: {
            followersChange: Math.random() * 15 - 3,
            engagementChange: Math.random() * 12 - 6,
            period: '30 days'
          }
        },
        linkedin: {
          platform: 'LinkedIn',
          followers: 5200 + Math.floor(Math.random() * 300),
          following: 89,
          posts: 67,
          engagement: {
            rate: 5.1 + Math.random() * 1.8,
            likes: 890,
            comments: 167,
            shares: 234
          },
          growth: {
            followersChange: Math.random() * 18 - 2,
            engagementChange: Math.random() * 10 - 5,
            period: '30 days'
          }
        },
        facebook: {
          platform: 'Facebook',
          followers: 12300 + Math.floor(Math.random() * 800),
          following: 67,
          posts: 234,
          engagement: {
            rate: 3.2 + Math.random() * 1.2,
            likes: 1850,
            comments: 234,
            shares: 567
          },
          growth: {
            followersChange: Math.random() * 12 - 3,
            engagementChange: Math.random() * 8 - 4,
            period: '30 days'
          }
        },
        youtube: {
          platform: 'YouTube',
          followers: 25600 + Math.floor(Math.random() * 1500), // subscribers
          following: 45, // subscribed channels
          posts: 89, // videos
          engagement: {
            rate: 6.8 + Math.random() * 2.2,
            likes: 3450,
            comments: 789,
            shares: 234
          },
          growth: {
            followersChange: Math.random() * 25 - 2,
            engagementChange: Math.random() * 15 - 5,
            period: '30 days'
          }
        },
        tiktok: {
          platform: 'TikTok',
          followers: 45200 + Math.floor(Math.random() * 2000),
          following: 123,
          posts: 456,
          engagement: {
            rate: 8.4 + Math.random() * 3.5,
            likes: 8900,
            comments: 1200,
            shares: 2340
          },
          growth: {
            followersChange: Math.random() * 40 - 5,
            engagementChange: Math.random() * 20 - 8,
            period: '30 days'
          }
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockData[platform] || null;
    } catch (error) {
      console.error(`Error fetching ${platform} metrics:`, error);
      return null;
    }
  }

  static async getAllUserMetrics(): Promise<SocialMetricsData[]> {
    try {
      const connections = await this.getUserConnections();
      const metricsPromises = connections.map(connection => 
        this.fetchPlatformMetrics(connection.platform, connection.access_token)
      );
      
      const results = await Promise.all(metricsPromises);
      return results.filter(Boolean) as SocialMetricsData[];
    } catch (error) {
      console.error('Error fetching all user metrics:', error);
      return [];
    }
  }

  static async testConnection(platform: string, accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      // This would make a test API call to validate the token
      // For now, we'll simulate the validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random success/failure for demo
      const isValid = Math.random() > 0.1; // 90% success rate
      
      if (!isValid) {
        return { success: false, error: "Invalid access token or insufficient permissions" };
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error testing ${platform} connection:`, error);
      return { success: false, error: "Connection test failed" };
    }
  }
}
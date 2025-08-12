// Migrated to server-side API - no longer using Supabase client

export interface UserSocialConnection {
  id: string;
  platform: string;
  username: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  platformUserId?: string;
  profileUrl?: string;
  avatarUrl?: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  lastSyncAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  static async getUserConnections(userId: string): Promise<UserSocialConnection[]> {
    try {
      const response = await fetch(`/api/social/connections?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user connections:', error);
      return [];
    }
  }

  static async addConnection(connectionData: {
    userId: string;
    platform: string;
    username: string;
    accessToken: string;
    refreshToken?: string;
    platformUserId?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/social/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || response.statusText };
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding connection:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async removeConnection(connectionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/social/connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || response.statusText };
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing connection:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async testConnection(platform: string, accessToken: string, refreshToken?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/social/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, accessToken, refreshToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || response.statusText };
      }

      return await response.json();
    } catch (error) {
      console.error('Error testing connection:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async fetchPlatformMetrics(connectionId: string, dateRange?: { start: Date; end: Date }): Promise<SocialMetricsData | null> {
    try {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('start', dateRange.start.toISOString());
        params.append('end', dateRange.end.toISOString());
      }
      
      const response = await fetch(`/api/social/metrics/${connectionId}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const metrics = await response.json();
      
      // Transform API response to SocialMetricsData format
      return {
        platform: 'Unknown', // Would be set from connection data
        followers: metrics.followers,
        following: metrics.following,
        posts: metrics.posts,
        engagement: {
          rate: metrics.engagementRate,
          likes: metrics.likes,
          comments: metrics.comments,
          shares: metrics.shares
        },
        growth: {
          followersChange: 0, // Would need historical comparison
          engagementChange: 0,
          period: '30 days'
        }
      };
    } catch (error) {
      console.error('Error fetching platform metrics:', error);
      
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

      // Fallback to null if API call fails
      return null;
    }
  }

  static async getAllUserMetrics(userId: string): Promise<SocialMetricsData[]> {
    try {
      const connections = await this.getUserConnections(userId);
      const metricsPromises = connections.map(connection => 
        this.fetchPlatformMetrics(connection.id)
      );
      
      const results = await Promise.all(metricsPromises);
      return results.filter(Boolean) as SocialMetricsData[];
    } catch (error) {
      console.error('Error fetching all user metrics:', error);
      return [];
    }
  }

  static async publishPost(connectionId: string, content: string, mediaUrls?: string[]): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const response = await fetch(`/api/social/publish/${connectionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, mediaUrls }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || response.statusText };
      }

      return await response.json();
    } catch (error) {
      console.error('Error publishing post:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async getSocialPosts(connectionId: string, limit = 10, since?: Date): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });
      
      if (since) {
        params.append('since', since.toISOString());
      }

      const response = await fetch(`/api/social/posts/${connectionId}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching social posts:', error);
      return [];
    }
  }
}
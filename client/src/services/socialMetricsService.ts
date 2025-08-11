export interface SocialMetrics {
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
  topPosts: SocialPost[];
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    gender: Record<string, number>;
  };
}

export interface SocialPost {
  id: string;
  platform: string;
  content: string;
  timestamp: Date;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    impressions: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement_rate: number;
}

export interface SocialAlert {
  id: string;
  type: 'milestone' | 'trending' | 'mention' | 'crisis';
  title: string;
  description: string;
  platform: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  actionRequired: boolean;
}

export class SocialMetricsService {
  private static platforms = ['instagram', 'twitter', 'linkedin', 'facebook', 'tiktok'];

  static async getMetrics(platform: string): Promise<SocialMetrics> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock data - replace with actual API calls
    const baseMetrics = {
      instagram: {
        platform: 'Instagram',
        followers: 15400,
        following: 234,
        posts: 156,
        engagement: {
          rate: 4.2,
          likes: 2340,
          comments: 456,
          shares: 123
        }
      },
      twitter: {
        platform: 'Twitter',
        followers: 8900,
        following: 445,
        posts: 1200,
        engagement: {
          rate: 3.8,
          likes: 1670,
          comments: 234,
          shares: 890
        }
      },
      linkedin: {
        platform: 'LinkedIn',
        followers: 5200,
        following: 89,
        posts: 67,
        engagement: {
          rate: 5.1,
          likes: 890,
          comments: 167,
          shares: 234
        }
      }
    };

    const base = baseMetrics[platform as keyof typeof baseMetrics] || baseMetrics.instagram;
    
    return {
      ...base,
      growth: {
        followersChange: Math.random() * 20 - 5, // -5% to +15%
        engagementChange: Math.random() * 15 - 7.5, // -7.5% to +7.5%
        period: '30 days'
      },
      topPosts: await this.getTopPosts(platform),
      demographics: {
        ageGroups: {
          '18-24': 25,
          '25-34': 35,
          '35-44': 20,
          '45-54': 15,
          '55+': 5
        },
        locations: {
          'United States': 45,
          'United Kingdom': 20,
          'Canada': 15,
          'Australia': 10,
          'Other': 10
        },
        gender: {
          'Male': 55,
          'Female': 43,
          'Other': 2
        }
      }
    };
  }

  static async getTopPosts(platform: string): Promise<SocialPost[]> {
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        platform,
        content: '🚀 Excited to announce our new AI-powered features! The future of productivity is here. #innovation #AI #productivity',
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        metrics: {
          likes: 456,
          comments: 78,
          shares: 34,
          reach: 12000,
          impressions: 18500
        },
        sentiment: 'positive',
        engagement_rate: 4.8
      },
      {
        id: '2',
        platform,
        content: 'Customer success story: How @company_name increased their productivity by 300% using our platform. Read more: link.com',
        timestamp: new Date(Date.now() - 3600000 * 8), // 8 hours ago
        metrics: {
          likes: 234,
          comments: 45,
          shares: 67,
          reach: 8500,
          impressions: 13200
        },
        sentiment: 'positive',
        engagement_rate: 4.1
      },
      {
        id: '3',
        platform,
        content: 'Quick tip Tuesday: 5 ways to optimize your workflow for maximum efficiency. Which one will you try first? 🤔',
        timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
        metrics: {
          likes: 189,
          comments: 56,
          shares: 23,
          reach: 7200,
          impressions: 11800
        },
        sentiment: 'neutral',
        engagement_rate: 3.7
      }
    ];

    return mockPosts;
  }

  static async getAllMetrics(): Promise<SocialMetrics[]> {
    const metrics = await Promise.all(
      this.platforms.map(platform => this.getMetrics(platform))
    );
    return metrics.filter(Boolean);
  }

  static async getAlerts(): Promise<SocialAlert[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        type: 'milestone',
        title: 'Follower Milestone Reached',
        description: 'Your Instagram account just hit 15,000 followers! 🎉',
        platform: 'Instagram',
        severity: 'low',
        timestamp: new Date(Date.now() - 1800000), // 30 min ago
        actionRequired: false
      },
      {
        id: '2',
        type: 'trending',
        title: 'Post Going Viral',
        description: 'Your recent AI features announcement is trending with 500% above average engagement.',
        platform: 'Twitter',
        severity: 'medium',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        actionRequired: true
      },
      {
        id: '3',
        type: 'mention',
        title: 'High-Value Mention',
        description: 'Tech influencer @biginfluencer mentioned your brand to their 100K followers.',
        platform: 'Twitter',
        severity: 'medium',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        actionRequired: true
      }
    ];
  }

  static async getEngagementTrends(platform: string, days: number = 30): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const trends = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      trends.push({
        date: date.toISOString().split('T')[0],
        engagement: Math.round(3.5 + Math.random() * 2 + Math.sin(i / 7) * 0.5),
        reach: Math.round(8000 + Math.random() * 4000),
        impressions: Math.round(12000 + Math.random() * 8000),
        followers: 15400 + Math.round((days - i) * 5 + Math.random() * 10)
      });
    }
    
    return trends;
  }

  static async schedulePost(post: {
    platform: string;
    content: string;
    scheduledTime: Date;
    media?: string[];
  }): Promise<{ success: boolean; postId?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate successful post scheduling
    return {
      success: true,
      postId: 'post_' + Date.now()
    };
  }

  static async analyzeOptimalPostTime(platform: string): Promise<{
    bestDays: string[];
    bestHours: number[];
    engagement_multiplier: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const platformData = {
      instagram: {
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        bestHours: [11, 13, 17, 19],
        engagement_multiplier: 1.4
      },
      twitter: {
        bestDays: ['Monday', 'Tuesday', 'Wednesday'],
        bestHours: [9, 12, 15, 18],
        engagement_multiplier: 1.3
      },
      linkedin: {
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        bestHours: [8, 12, 17],
        engagement_multiplier: 1.6
      }
    };

    return platformData[platform as keyof typeof platformData] || platformData.instagram;
  }
}
import { SocialConnection } from "@shared/schema";

export interface PlatformMetrics {
  followers: number;
  following: number;
  posts: number;
  likes: number;
  comments: number;
  shares: number;
  impressions?: number;
  reach?: number;
  engagementRate: number;
}

export interface PlatformPost {
  id: string;
  content: string;
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  publishedAt: Date;
}

export interface PlatformProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  profileUrl: string;
  avatarUrl?: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  verified: boolean;
}

export abstract class BasePlatformAPI {
  protected accessToken: string;
  protected refreshToken?: string;
  
  constructor(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  abstract testConnection(): Promise<{ success: boolean; error?: string }>;
  abstract getProfile(): Promise<PlatformProfile>;
  abstract getMetrics(dateRange?: { start: Date; end: Date }): Promise<PlatformMetrics>;
  abstract getPosts(limit?: number, since?: Date): Promise<PlatformPost[]>;
  abstract publishPost(content: string, mediaUrls?: string[]): Promise<{ success: boolean; postId?: string; error?: string }>;
  abstract refreshAccessToken(): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date }>;
}

// Twitter/X API Implementation
export class TwitterAPI extends BasePlatformAPI {
  private baseUrl = 'https://api.twitter.com/2';

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProfile(): Promise<PlatformProfile> {
    const response = await fetch(`${this.baseUrl}/users/me?user.fields=public_metrics,profile_image_url,verified,description`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const user = data.data;

    return {
      id: user.id,
      username: user.username,
      displayName: user.name,
      bio: user.description,
      profileUrl: `https://twitter.com/${user.username}`,
      avatarUrl: user.profile_image_url,
      followerCount: user.public_metrics?.followers_count || 0,
      followingCount: user.public_metrics?.following_count || 0,
      postCount: user.public_metrics?.tweet_count || 0,
      verified: user.verified || false,
    };
  }

  async getMetrics(dateRange?: { start: Date; end: Date }): Promise<PlatformMetrics> {
    const profile = await this.getProfile();
    
    // For detailed metrics, you'd typically need Twitter Analytics API or additional endpoints
    return {
      followers: profile.followerCount,
      following: profile.followingCount,
      posts: profile.postCount,
      likes: 0, // Would need tweets endpoint with metrics
      comments: 0,
      shares: 0,
      impressions: 0,
      reach: 0,
      engagementRate: 0,
    };
  }

  async getPosts(limit = 10, since?: Date): Promise<PlatformPost[]> {
    const profile = await this.getProfile();
    const params = new URLSearchParams({
      'tweet.fields': 'public_metrics,created_at,entities',
      'max_results': limit.toString(),
    });

    if (since) {
      params.append('start_time', since.toISOString());
    }

    const response = await fetch(`${this.baseUrl}/users/${profile.id}/tweets?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((tweet: any) => ({
      id: tweet.id,
      content: tweet.text,
      mediaUrls: tweet.entities?.urls?.map((url: any) => url.expanded_url) || [],
      hashtags: tweet.entities?.hashtags?.map((tag: any) => `#${tag.tag}`) || [],
      mentions: tweet.entities?.mentions?.map((mention: any) => `@${mention.username}`) || [],
      likesCount: tweet.public_metrics?.like_count || 0,
      commentsCount: tweet.public_metrics?.reply_count || 0,
      sharesCount: tweet.public_metrics?.retweet_count || 0,
      publishedAt: new Date(tweet.created_at),
    }));
  }

  async publishPost(content: string, mediaUrls?: string[]): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.title || response.statusText };
      }

      const data = await response.json();
      return { success: true, postId: data.data.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date }> {
    throw new Error('Twitter refresh token not implemented');
  }
}

// LinkedIn API Implementation
export class LinkedInAPI extends BasePlatformAPI {
  private baseUrl = 'https://api.linkedin.com/v2';

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/people/~`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok 
        ? { success: true }
        : { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProfile(): Promise<PlatformProfile> {
    const response = await fetch(`${this.baseUrl}/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      username: `${data.firstName.localized.en_US} ${data.lastName.localized.en_US}`,
      displayName: `${data.firstName.localized.en_US} ${data.lastName.localized.en_US}`,
      profileUrl: `https://linkedin.com/in/profile-${data.id}`,
      avatarUrl: data.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
      followerCount: 0, // Would need additional API calls
      followingCount: 0,
      postCount: 0,
      verified: false,
    };
  }

  async getMetrics(dateRange?: { start: Date; end: Date }): Promise<PlatformMetrics> {
    // LinkedIn metrics require organization access or specific endpoints
    return {
      followers: 0,
      following: 0,
      posts: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      impressions: 0,
      reach: 0,
      engagementRate: 0,
    };
  }

  async getPosts(limit = 10, since?: Date): Promise<PlatformPost[]> {
    // LinkedIn posts endpoint implementation
    return [];
  }

  async publishPost(content: string, mediaUrls?: string[]): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const profile = await this.getProfile();
      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: `urn:li:person:${profile.id}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || response.statusText };
      }

      const data = await response.json();
      return { success: true, postId: data.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date }> {
    throw new Error('LinkedIn refresh token not implemented');
  }
}

// Instagram Basic Display API Implementation
export class InstagramAPI extends BasePlatformAPI {
  private baseUrl = 'https://graph.instagram.com';

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/me?fields=id,username&access_token=${this.accessToken}`);
      
      return response.ok 
        ? { success: true }
        : { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProfile(): Promise<PlatformProfile> {
    const response = await fetch(`${this.baseUrl}/me?fields=id,username,account_type,media_count&access_token=${this.accessToken}`);

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      username: data.username,
      displayName: data.username,
      profileUrl: `https://instagram.com/${data.username}`,
      followerCount: 0, // Basic Display API doesn't provide follower count
      followingCount: 0,
      postCount: data.media_count || 0,
      verified: false,
    };
  }

  async getMetrics(dateRange?: { start: Date; end: Date }): Promise<PlatformMetrics> {
    const profile = await this.getProfile();
    
    return {
      followers: 0, // Would need Instagram Business API
      following: 0,
      posts: profile.postCount,
      likes: 0,
      comments: 0,
      shares: 0,
      impressions: 0,
      reach: 0,
      engagementRate: 0,
    };
  }

  async getPosts(limit = 10, since?: Date): Promise<PlatformPost[]> {
    const response = await fetch(`${this.baseUrl}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=${limit}&access_token=${this.accessToken}`);

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((post: any) => ({
      id: post.id,
      content: post.caption || '',
      mediaUrls: post.media_url ? [post.media_url] : [],
      hashtags: this.extractHashtags(post.caption || ''),
      mentions: this.extractMentions(post.caption || ''),
      likesCount: 0, // Would need additional API calls
      commentsCount: 0,
      sharesCount: 0,
      publishedAt: new Date(post.timestamp),
    }));
  }

  private extractHashtags(text: string): string[] {
    return (text.match(/#\w+/g) || []);
  }

  private extractMentions(text: string): string[] {
    return (text.match(/@\w+/g) || []);
  }

  async publishPost(content: string, mediaUrls?: string[]): Promise<{ success: boolean; postId?: string; error?: string }> {
    // Instagram requires media upload process for publishing
    // This is a simplified implementation
    return { success: false, error: 'Instagram posting requires media upload - use Instagram Business API' };
  }

  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date }> {
    throw new Error('Instagram refresh token not implemented');
  }
}

// Facebook Graph API Implementation  
export class FacebookAPI extends BasePlatformAPI {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/me?access_token=${this.accessToken}`);
      
      return response.ok 
        ? { success: true }
        : { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProfile(): Promise<PlatformProfile> {
    const response = await fetch(`${this.baseUrl}/me?fields=id,name,picture,link&access_token=${this.accessToken}`);

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      username: data.name,
      displayName: data.name,
      profileUrl: data.link || `https://facebook.com/${data.id}`,
      avatarUrl: data.picture?.data?.url,
      followerCount: 0, // Would need page-specific endpoints
      followingCount: 0,
      postCount: 0,
      verified: false,
    };
  }

  async getMetrics(dateRange?: { start: Date; end: Date }): Promise<PlatformMetrics> {
    return {
      followers: 0,
      following: 0,
      posts: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      impressions: 0,
      reach: 0,
      engagementRate: 0,
    };
  }

  async getPosts(limit = 10, since?: Date): Promise<PlatformPost[]> {
    const response = await fetch(`${this.baseUrl}/me/posts?fields=id,message,created_time,likes.summary(true),comments.summary(true)&limit=${limit}&access_token=${this.accessToken}`);

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((post: any) => ({
      id: post.id,
      content: post.message || '',
      mediaUrls: [],
      hashtags: this.extractHashtags(post.message || ''),
      mentions: this.extractMentions(post.message || ''),
      likesCount: post.likes?.summary?.total_count || 0,
      commentsCount: post.comments?.summary?.total_count || 0,
      sharesCount: 0,
      publishedAt: new Date(post.created_time),
    }));
  }

  private extractHashtags(text: string): string[] {
    return (text.match(/#\w+/g) || []);
  }

  private extractMentions(text: string): string[] {
    return (text.match(/@\w+/g) || []);
  }

  async publishPost(content: string, mediaUrls?: string[]): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/me/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          message: content,
          access_token: this.accessToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error?.message || response.statusText };
      }

      const data = await response.json();
      return { success: true, postId: data.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date }> {
    throw new Error('Facebook refresh token not implemented');
  }
}

// Factory function to get the appropriate API instance
export function createPlatformAPI(platform: string, accessToken: string, refreshToken?: string): BasePlatformAPI {
  switch (platform.toLowerCase()) {
    case 'twitter':
      return new TwitterAPI(accessToken, refreshToken);
    case 'linkedin':
      return new LinkedInAPI(accessToken, refreshToken);
    case 'instagram':
      return new InstagramAPI(accessToken, refreshToken);
    case 'facebook':
      return new FacebookAPI(accessToken, refreshToken);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
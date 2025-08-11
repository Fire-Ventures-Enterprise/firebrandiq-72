export interface GeneratedContent {
  id: string;
  type: 'social_post' | 'google_ad' | 'social_ad' | 'blog_post';
  platform: 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'google' | 'meta';
  title?: string;
  content: string;
  hashtags?: string[];
  callToAction?: string;
  targetAudience?: string;
  budget?: number;
  keywords?: string[];
  createdAt: Date;
  status: 'draft' | 'scheduled' | 'published';
}

export interface GenerateContentRequest {
  type: 'social_posts' | 'google_ads' | 'social_ads';
  brandName: string;
  industry: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative';
  topics?: string[];
  platform?: string;
  targetKeywords?: string[];
  landingPageUrl?: string;
  budget?: number;
  objective?: 'awareness' | 'traffic' | 'conversions';
  targetAudience?: string;
}

export class ContentGenerationService {
  private static async callAPI(endpoint: string, body: any): Promise<any> {
    try {
      const { apiClient } = await import('@/lib/api-client');
      return await apiClient.generateContent(body);
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  }

  static async generateSocialPosts(
    brandName: string,
    industry: string,
    tone: 'professional' | 'casual' | 'friendly' | 'authoritative' = 'professional',
    topics?: string[],
    platform?: string
  ): Promise<GeneratedContent[]> {
    const request: GenerateContentRequest = {
      type: 'social_posts',
      brandName,
      industry,
      tone,
      topics,
      platform,
    };

    const response = await this.callAPI('generate-content', request);
    return response.content ? [{ content: response.content, type: response.type }] : [];
  }

  static async generateGoogleAds(
    brandName: string,
    industry: string,
    targetKeywords: string[],
    landingPageUrl: string,
    budget: number
  ): Promise<GeneratedContent[]> {
    const request: GenerateContentRequest = {
      type: 'google_ads',
      brandName,
      industry,
      targetKeywords,
      landingPageUrl,
      budget,
    };

    const response = await this.callAPI('generate-content', request);
    return response.content ? [{ content: response.content, type: response.type }] : [];
  }

  static async generateSocialAds(
    brandName: string,
    platform: 'facebook' | 'instagram' | 'linkedin',
    objective: 'awareness' | 'traffic' | 'conversions',
    targetAudience: string,
    budget: number
  ): Promise<GeneratedContent[]> {
    const request: GenerateContentRequest = {
      type: 'social_ads',
      brandName,
      industry: '', // Will be filled from brand context
      platform,
      objective,
      targetAudience,
      budget,
    };

    const response = await this.callAPI('generate-content', request);
    return response.content ? [{ content: response.content, type: response.type }] : [];
  }

  static parseGeneratedPosts(text: string, platform?: string): GeneratedContent[] {
    try {
      // Split the text into individual posts
      const postSections = text.split(/\n\s*\d+\./g).filter(section => section.trim());
      
      return postSections.slice(0, 5).map((section, index) => {
        const lines = section.split('\n').filter(line => line.trim());
        
        // Extract content, hashtags, and CTA
        const content = lines.find(line => !line.startsWith('#') && !line.includes('CTA:') && !line.includes('Target:'))?.trim() || '';
        const hashtagLine = lines.find(line => line.includes('#'))?.trim() || '';
        const hashtags = hashtagLine.match(/#\w+/g) || [];
        const ctaLine = lines.find(line => line.includes('CTA:'))?.replace('CTA:', '').trim() || '';
        const targetLine = lines.find(line => line.includes('Target:'))?.replace('Target:', '').trim() || '';

        return {
          id: crypto.randomUUID(),
          type: 'social_post' as const,
          platform: (platform as any) || 'twitter',
          content,
          hashtags,
          callToAction: ctaLine,
          targetAudience: targetLine,
          createdAt: new Date(),
          status: 'draft' as const,
        };
      });
    } catch (error) {
      console.error('Error parsing generated posts:', error);
      return [];
    }
  }

  static parseGeneratedAds(text: string, type: 'google_ad' | 'social_ad' = 'google_ad'): GeneratedContent[] {
    try {
      const adSections = text.split(/\n\s*\d+\./g).filter(section => section.trim());
      
      return adSections.slice(0, 3).map((section, index) => {
        const lines = section.split('\n').filter(line => line.trim());
        
        const title = lines.find(line => line.includes('Headline:') || line.includes('Title:'))?.replace(/^.*?:/, '').trim() || '';
        const content = lines.find(line => line.includes('Description:') || line.includes('Copy:'))?.replace(/^.*?:/, '').trim() || '';
        const ctaLine = lines.find(line => line.includes('CTA:'))?.replace('CTA:', '').trim() || '';
        const targetLine = lines.find(line => line.includes('Target:'))?.replace('Target:', '').trim() || '';

        return {
          id: crypto.randomUUID(),
          type,
          platform: type === 'google_ad' ? 'google' as const : 'meta' as const,
          title,
          content,
          callToAction: ctaLine,
          targetAudience: targetLine,
          createdAt: new Date(),
          status: 'draft' as const,
        };
      });
    } catch (error) {
      console.error('Error parsing generated ads:', error);
      return [];
    }
  }
}
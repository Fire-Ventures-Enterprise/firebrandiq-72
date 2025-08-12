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
    return response.content ? [{
      id: crypto.randomUUID(),
      content: response.content,
      type: 'social_post' as const,
      platform: (platform as any) || 'twitter',
      createdAt: new Date(),
      status: 'draft' as const
    }] : [];
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
    return response.content ? [{
      id: crypto.randomUUID(),
      content: response.content,
      type: 'google_ad' as const,
      platform: 'google' as const,
      createdAt: new Date(),
      status: 'draft' as const
    }] : [];
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
    return response.content ? [{
      id: crypto.randomUUID(),
      content: response.content,
      type: 'social_ad' as const,
      platform: platform as any,
      createdAt: new Date(),
      status: 'draft' as const
    }] : [];
  }

  static parseGeneratedPosts(text: string, platform?: string): GeneratedContent[] {
    try {
      // Split the text into individual posts using various patterns
      const postSections = text.split(/(?:Post \d+:|^\d+\.|\n\s*Post \d+)/gm).filter(section => section.trim());
      
      return postSections.slice(0, 5).map((section, index) => {
        // Clean up the section text
        let cleanContent = section.trim();
        
        // Extract hashtags from the content
        const hashtagMatches = cleanContent.match(/#\w+/g) || [];
        const hashtags = Array.from(new Set(hashtagMatches)); // Remove duplicates
        
        // Extract CTA if present
        const ctaMatch = cleanContent.match(/CTA:\s*([^#\n]+)/i);
        const callToAction = ctaMatch ? ctaMatch[1].trim() : '';
        
        // Extract Target audience if present  
        const targetMatch = cleanContent.match(/Target:\s*([^#\n]+)/i);
        const targetAudience = targetMatch ? targetMatch[1].trim() : '';
        
        // Clean the main content by removing CTA, Target, and excessive hashtags
        cleanContent = cleanContent
          .replace(/CTA:\s*[^#\n]+/gi, '')
          .replace(/Target:\s*[^#\n]+/gi, '')
          .replace(/(#\w+\s*){4,}/g, '') // Remove excessive hashtag clusters
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        // Format the content for better readability
        const formattedContent = this.formatPostContent(cleanContent, hashtags.slice(0, 5)); // Limit hashtags
        
        return {
          id: crypto.randomUUID(),
          type: 'social_post' as const,
          platform: (platform as any) || 'twitter',
          content: formattedContent,
          hashtags: hashtags.slice(0, 5), // Limit to 5 hashtags
          callToAction: callToAction,
          targetAudience: targetAudience,
          createdAt: new Date(),
          status: 'draft' as const,
        };
      });
    } catch (error) {
      console.error('Error parsing generated posts:', error);
      return [];
    }
  }

  private static formatPostContent(content: string, hashtags: string[]): string {
    // Remove any remaining hashtags from main content
    let formatted = content.replace(/#\w+/g, '').trim();
    
    // Add proper line breaks for readability
    formatted = formatted
      .replace(/\.\s+/g, '.\n\n') // Add breaks after sentences
      .replace(/!\s+/g, '!\n\n') // Add breaks after exclamations
      .replace(/\?\s+/g, '?\n\n') // Add breaks after questions
      .replace(/\n\n+/g, '\n\n') // Normalize multiple line breaks
      .trim();
    
    // Add hashtags at the end with proper spacing
    if (hashtags.length > 0) {
      formatted += '\n\n' + hashtags.join(' ');
    }
    
    return formatted;
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
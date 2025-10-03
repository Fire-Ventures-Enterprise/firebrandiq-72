import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://smddydqeufdgywqarbxv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZGR5ZHFldWZkZ3l3cWFyYnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTc3MDgsImV4cCI6MjA3MDIzMzcwOH0.0R2lpWCt7vgwid9gUTsVX49Ez8K8bX9tzM-po9bHd_M';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export interface PsychologyGenerationRequest {
  brandName: string;
  industry: string;
  psychologyApproach: string;
  platform: string;
  targetEmotions: string[];
  adObjective: string;
  brandVoice: string;
  audienceSegment: string;
}

export interface PsychologyResult {
  content: string;
  psychologyScore: {
    overall: number;
    breakdown: Record<string, number>;
  };
  engagementPrediction: {
    predicted: number;
    confidence: number;
  };
  conversionPotential: number;
  emotionalResonance: number;
}

export class PsychologyContentService {
  static async generatePsychologyPost(request: PsychologyGenerationRequest): Promise<PsychologyResult> {
    try {
      console.log('Calling psychology content generator edge function...');
      
      const { data, error } = await supabase.functions.invoke('psychology-content-generator', {
        body: {
          brandName: request.brandName,
          industry: request.industry,
          psychologyApproach: request.psychologyApproach,
          platform: request.platform,
          targetEmotions: request.targetEmotions,
          adObjective: request.adObjective,
          brandVoice: request.brandVoice,
          audienceSegment: request.audienceSegment
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate psychology content');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to generate psychology content');
      }

      return {
        content: data.content,
        psychologyScore: data.psychologyScore,
        engagementPrediction: data.engagementPrediction,
        conversionPotential: data.conversionPotential,
        emotionalResonance: data.emotionalResonance
      };
    } catch (error) {
      console.error('Psychology content generation error:', error);
      throw error;
    }
  }

  private static generateMockContent(request: PsychologyGenerationRequest): string {
    const { brandName, psychologyApproach, targetEmotions, audienceSegment, platform } = request;
    
    const approachTemplates = {
      'Social Proof & Trust': `🤝 Join thousands who trust ${brandName} for results that matter.`,
      'Scarcity & Urgency': `⏰ Limited time: ${brandName} exclusive offer ends soon!`,
      'Fear & Security': `🛡️ Protect your future with ${brandName}'s proven solutions.`,
      'Aspiration & Success': `🚀 Achieve the success you deserve with ${brandName}.`
    };

    const emotionTriggers = {
      'trust': '💯 Backed by proven results',
      'success': '✨ Unlock your potential',
      'urgency': '⚡ Don\'t miss out',
      'curiosity': '🤔 Discover the secret',
      'belonging': '👥 Join our community',
      'aspiration': '🌟 Reach new heights'
    };

    const segmentCustomization = {
      'security-focused': 'with guaranteed results and risk-free approach',
      'growth-oriented': 'through innovative strategies and cutting-edge solutions',
      'efficiency-driven': 'with streamlined processes and optimized outcomes'
    };

    const platformOptimization = {
      'linkedin': '\n\n#ProfessionalGrowth #Success #Leadership',
      'facebook': '\n\n👍 Like if you agree! Share with friends.',
      'instagram': '\n\n📸 #Inspiration #Success #Motivation',
      'twitter': '\n\n🧵 Thread 👆',
      'tiktok': '\n\n🎵 #ForYou #Trending #Success'
    };

    const baseContent = approachTemplates[psychologyApproach as keyof typeof approachTemplates] || approachTemplates['Social Proof & Trust'];
    const emotionContent = targetEmotions.map(emotion => emotionTriggers[emotion as keyof typeof emotionTriggers]).filter(Boolean).join('\n');
    const segmentContent = segmentCustomization[audienceSegment as keyof typeof segmentCustomization] || '';
    const platformContent = platformOptimization[platform as keyof typeof platformOptimization] || '';

    return `${baseContent}

${emotionContent}

Transform your business ${segmentContent}.

Ready to get started? 💪${platformContent}`;
  }

  static async getUserPsychologyPreferences(userId: string) {
    // Mock implementation - would use API client in real implementation
    return {
      data: {
        preferred_approach: 'Social Proof & Trust',
        preferred_emotions: ['trust', 'success'],
        default_audience_segment: 'efficiency-driven',
        psychology_intensity: 'moderate'
      },
      error: null
    };
  }

  static async savePsychologyPreferences(preferences: any) {
    // Mock implementation - would use API client in real implementation
    console.log('Saving psychology preferences:', preferences);
    return { data: preferences, error: null };
  }

  static async getAnalytics(userId: string) {
    // Mock implementation - would use API client in real implementation
    return {
      data: [
        {
          id: '1',
          brand_name: 'Sample Brand',
          psychology_approach: 'Social Proof & Trust',
          psychology_score: 85,
          engagement_prediction: 78,
          created_at: new Date().toISOString()
        }
      ],
      error: null
    };
  }
}

export default PsychologyContentService;
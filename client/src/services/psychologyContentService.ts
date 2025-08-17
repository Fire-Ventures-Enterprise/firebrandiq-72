import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

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
      const { data, error } = await (supabase as SupabaseClient).functions.invoke('psychology-content-generator', {
        body: request
      });

      if (error) {
        throw new Error(`Psychology generation failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Psychology content generation error:', error);
      throw error;
    }
  }

  static async getUserPsychologyPreferences(userId: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { data, error } = await supabase
      .from('user_psychology_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  }

  static async savePsychologyPreferences(preferences: any) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { data, error } = await supabase
      .from('user_psychology_preferences')
      .upsert(preferences);

    return { data, error };
  }

  static async getAnalytics(userId: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { data, error } = await supabase
      .from('psychology_post_generations')
      .select(`
        *,
        psychology_post_performance(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  }
}

export default PsychologyContentService;
import { BrandMention } from './aiService';

// Psychology Principles Implementation
interface PsychologyProfile {
  id: string;
  focusPreference: 'detailed' | 'summary' | 'visual';
  decisionStyle: 'analytical' | 'intuitive' | 'collaborative';
  cognitiveLoad: 'high' | 'medium' | 'low';
  engagementPattern: 'quick_scan' | 'deep_dive' | 'comparison';
}

interface OptimizedInsight {
  id: string;
  content: any;
  priority: number;
  cognitiveWeight: number;
  presentationStyle: 'highlight' | 'detail' | 'summary';
  psychologyScore: number;
}

export class PsychologyEngine {
  private static profiles: Map<string, PsychologyProfile> = new Map();

  // Core Psychology Principle: Specialization (Focus)
  static processInsights(insights: any[], userId: string): OptimizedInsight[] {
    const profile = this.getOrCreateProfile(userId);
    
    return insights.map(insight => ({
      id: insight.id,
      content: this.applySpecializationFilter(insight, profile),
      priority: this.calculatePriority(insight, profile),
      cognitiveWeight: this.calculateCognitiveLoad(insight, profile),
      presentationStyle: this.determinePresentationStyle(insight, profile),
      psychologyScore: this.calculatePsychologyScore(insight, profile)
    })).sort((a, b) => b.priority - a.priority);
  }

  // Psychology Principle: Concentration (Reduce Cognitive Load)
  private static applySpecializationFilter(insight: any, profile: PsychologyProfile): any {
    switch (profile.focusPreference) {
      case 'summary':
        return {
          ...insight,
          content: this.extractKeyPoints(insight.content),
          visualElements: this.simplifyVisuals(insight.visualElements)
        };
      case 'visual':
        return {
          ...insight,
          content: this.enhanceVisualPresentation(insight.content),
          chartEmphasis: true
        };
      default:
        return insight;
    }
  }

  // Psychology Principle: Differentiation (Unique Value Proposition)
  private static calculatePriority(insight: any, profile: PsychologyProfile): number {
    let baseScore = insight.importance || 50;
    
    // Boost priority based on user's decision style
    switch (profile.decisionStyle) {
      case 'analytical':
        if (insight.type === 'trend_analysis' || insight.type === 'competitor_insight') {
          baseScore += 30;
        }
        break;
      case 'intuitive':
        if (insight.type === 'sentiment_change' || insight.type === 'emotional_insight') {
          baseScore += 25;
        }
        break;
      case 'collaborative':
        if (insight.type === 'brand_mention' || insight.type === 'social_engagement') {
          baseScore += 20;
        }
        break;
    }

    // Apply urgency multiplier
    if (insight.urgency === 'high') baseScore *= 1.5;
    if (insight.sentiment === 'negative') baseScore *= 1.3;

    return Math.min(baseScore, 100);
  }

  // Psychology Principle: Segmentation (Personalization)
  private static calculateCognitiveLoad(insight: any, profile: PsychologyProfile): number {
    let loadScore = 10; // Base cognitive load

    if (profile.cognitiveLoad === 'high') {
      loadScore += 20; // User prefers simplified presentation
    }

    if (insight.complexity === 'high') loadScore += 15;
    if (insight.dataPoints && insight.dataPoints.length > 5) loadScore += 10;

    return loadScore;
  }

  private static determinePresentationStyle(insight: any, profile: PsychologyProfile): 'highlight' | 'detail' | 'summary' {
    if (profile.engagementPattern === 'quick_scan') return 'highlight';
    if (profile.engagementPattern === 'deep_dive') return 'detail';
    return 'summary';
  }

  private static calculatePsychologyScore(insight: any, profile: PsychologyProfile): number {
    let score = 50; // Base score

    // Reward insights that match user's psychology profile
    if (insight.type === 'emotional_insight' && profile.decisionStyle === 'intuitive') score += 30;
    if (insight.type === 'trend_analysis' && profile.decisionStyle === 'analytical') score += 25;
    if (insight.urgency === 'high' && profile.cognitiveLoad === 'low') score += 20;

    return Math.min(score, 100);
  }

  // User Profiling (Invisible Behavioral Tracking)
  static updateUserProfile(userId: string, interaction: any): void {
    const profile = this.getOrCreateProfile(userId);
    
    // Track interaction patterns
    if (interaction.type === 'quick_exit') {
      profile.cognitiveLoad = 'high';
    }
    
    if (interaction.type === 'detailed_view' && interaction.duration > 30) {
      profile.engagementPattern = 'deep_dive';
    }

    if (interaction.type === 'data_export') {
      profile.decisionStyle = 'analytical';
    }

    this.profiles.set(userId, profile);
  }

  private static getOrCreateProfile(userId: string): PsychologyProfile {
    if (!this.profiles.has(userId)) {
      this.profiles.set(userId, {
        id: userId,
        focusPreference: 'summary',
        decisionStyle: 'intuitive',
        cognitiveLoad: 'medium',
        engagementPattern: 'quick_scan'
      });
    }
    return this.profiles.get(userId)!;
  }

  // Utility Methods for Content Processing
  private static extractKeyPoints(content: string): string {
    // Extract 2-3 key sentences using psychological emphasis
    const sentences = content.split('. ');
    return sentences.slice(0, 3).join('. ') + '.';
  }

  private static simplifyVisuals(visuals: any): any {
    return {
      ...visuals,
      chartType: 'simplified',
      dataPoints: visuals?.dataPoints?.slice(0, 5) || []
    };
  }

  private static enhanceVisualPresentation(content: any): any {
    return {
      ...content,
      visualEmphasis: true,
      chartSize: 'large',
      colorEmphasis: true
    };
  }

  // Analytics for Psychology Effectiveness
  static getAnalytics(): any {
    return {
      totalProfiles: this.profiles.size,
      averagePsychologyScore: this.calculateAveragePsychologyScore(),
      engagementImprovement: this.calculateEngagementImprovement(),
      cognitiveLoadReduction: this.calculateCognitiveLoadReduction()
    };
  }

  private static calculateAveragePsychologyScore(): number {
    // Simulated analytics - would connect to real metrics
    return 73.2;
  }

  private static calculateEngagementImprovement(): number {
    // Simulated analytics - would connect to real metrics  
    return 156; // 156% improvement
  }

  private static calculateCognitiveLoadReduction(): number {
    // Simulated analytics - would connect to real metrics
    return 73; // 73% reduction
  }
}
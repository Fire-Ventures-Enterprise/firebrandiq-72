/**
 * EmotionalAnalytics Module
 * Advanced sentiment analysis engine
 * Supports Differentiation principle through unique emotional insights
 */

export interface EmotionalProfile {
  dominant_emotion: string;
  emotionalIntensity: number;
  emotionalTriggers: string[];
  sentimentScore: number;
  emotionalJourney: EmotionalState[];
}

export interface EmotionalState {
  emotion: string;
  intensity: number;
  timestamp: number;
  context?: string;
}

export interface EmotionalInsight {
  type: 'opportunity' | 'risk' | 'trend';
  emotion: string;
  insight: string;
  confidence: number;
  actionable: boolean;
  recommendation?: string;
}

export interface AudienceEmotionalPulse {
  overall_sentiment: number;
  dominant_emotions: Array<{ emotion: string; percentage: number }>;
  emotional_volatility: number;
  engagement_correlation: number;
  insights: EmotionalInsight[];
}

export class EmotionalAnalytics {
  private static readonly EMOTION_CATEGORIES = {
    positive: ['joy', 'trust', 'anticipation', 'success', 'aspiration'],
    negative: ['fear', 'anger', 'sadness', 'disgust'],
    neutral: ['surprise', 'curiosity'],
    action: ['urgency', 'longing', 'belonging']
  };

  private static readonly EMOTION_WEIGHTS = {
    // High-impact emotions (Concentration principle)
    urgency: 3.0,
    fear: 2.8,
    aspiration: 2.5,
    trust: 2.3,
    success: 2.2,
    // Medium-impact
    longing: 1.8,
    curiosity: 1.5,
    belonging: 1.5,
    // Lower-impact
    joy: 1.2,
    surprise: 1.0
  };

  /**
   * Analyze emotional content of text/post
   */
  static async analyzeEmotionalContent(content: string): Promise<EmotionalProfile> {
    // In production, this would use AI analysis
    const emotions = this.detectEmotions(content);
    const intensity = this.calculateEmotionalIntensity(emotions);
    const triggers = this.identifyEmotionalTriggers(content);
    const sentiment = this.calculateSentimentScore(emotions);

    return {
      dominant_emotion: emotions[0]?.emotion || 'neutral',
      emotionalIntensity: intensity,
      emotionalTriggers: triggers,
      sentimentScore: sentiment,
      emotionalJourney: emotions
    };
  }

  /**
   * Detect emotions from content using pattern matching
   * In production, would use ML model
   */
  private static detectEmotions(content: string): EmotionalState[] {
    const emotionPatterns: Record<string, RegExp[]> = {
      urgency: [/limited time/i, /act now/i, /don't miss/i, /ending soon/i],
      trust: [/proven/i, /reliable/i, /trusted/i, /guaranteed/i],
      aspiration: [/achieve/i, /success/i, /dream/i, /potential/i],
      fear: [/risk/i, /lose/i, /danger/i, /protect/i],
      success: [/win/i, /accomplish/i, /achieve/i, /reach/i],
      curiosity: [/discover/i, /secret/i, /hidden/i, /reveal/i],
      belonging: [/community/i, /together/i, /join/i, /we/i]
    };

    const detectedEmotions: EmotionalState[] = [];

    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
      let matchCount = 0;
      patterns.forEach(pattern => {
        if (pattern.test(content)) matchCount++;
      });

      if (matchCount > 0) {
        detectedEmotions.push({
          emotion,
          intensity: Math.min(matchCount / patterns.length, 1),
          timestamp: Date.now()
        });
      }
    });

    // Sort by intensity
    return detectedEmotions.sort((a, b) => b.intensity - a.intensity);
  }

  /**
   * Calculate overall emotional intensity
   */
  private static calculateEmotionalIntensity(emotions: EmotionalState[]): number {
    if (emotions.length === 0) return 0;

    const weightedSum = emotions.reduce((sum, state) => {
      const weight = this.EMOTION_WEIGHTS[state.emotion as keyof typeof this.EMOTION_WEIGHTS] || 1;
      return sum + (state.intensity * weight);
    }, 0);

    return Math.min(weightedSum / emotions.length, 10) / 10; // Normalize to 0-1
  }

  /**
   * Identify emotional triggers in content
   */
  private static identifyEmotionalTriggers(content: string): string[] {
    const triggers: string[] = [];

    // FOMO triggers
    if (/limited|exclusive|only|rare/i.test(content)) {
      triggers.push('Scarcity/FOMO');
    }

    // Social proof triggers
    if (/thousands|millions|everyone|join/i.test(content)) {
      triggers.push('Social Proof');
    }

    // Authority triggers
    if (/expert|proven|certified|award/i.test(content)) {
      triggers.push('Authority');
    }

    // Aspiration triggers
    if (/success|achieve|dream|potential/i.test(content)) {
      triggers.push('Aspiration');
    }

    return triggers;
  }

  /**
   * Calculate sentiment score (-1 to 1)
   */
  private static calculateSentimentScore(emotions: EmotionalState[]): number {
    let score = 0;
    let totalWeight = 0;

    emotions.forEach(state => {
      const category = this.getEmotionCategory(state.emotion);
      const weight = state.intensity;

      if (category === 'positive') {
        score += weight;
      } else if (category === 'negative') {
        score -= weight;
      }

      totalWeight += weight;
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  /**
   * Get emotion category
   */
  private static getEmotionCategory(emotion: string): string {
    for (const [category, emotions] of Object.entries(this.EMOTION_CATEGORIES)) {
      if (emotions.includes(emotion)) return category;
    }
    return 'neutral';
  }

  /**
   * Analyze audience emotional pulse
   * This provides the "Exclusive Audience Emotional Pulse" differentiation
   */
  static async analyzeAudienceEmotionalPulse(
    contentSamples: string[]
  ): Promise<AudienceEmotionalPulse> {
    const profiles = await Promise.all(
      contentSamples.map(content => this.analyzeEmotionalContent(content))
    );

    const overallSentiment = profiles.reduce((sum, p) => sum + p.sentimentScore, 0) / profiles.length;

    // Count emotion frequencies
    const emotionFrequency: Record<string, number> = {};
    profiles.forEach(profile => {
      profile.emotionalJourney.forEach(state => {
        emotionFrequency[state.emotion] = (emotionFrequency[state.emotion] || 0) + state.intensity;
      });
    });

    // Get dominant emotions
    const dominantEmotions = Object.entries(emotionFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({
        emotion,
        percentage: Math.round((count / profiles.length) * 100)
      }));

    // Calculate volatility (how much emotions fluctuate)
    const volatility = this.calculateEmotionalVolatility(profiles);

    // Generate insights
    const insights = this.generateEmotionalInsights(dominantEmotions, overallSentiment, volatility);

    return {
      overall_sentiment: Math.round(overallSentiment * 100),
      dominant_emotions: dominantEmotions,
      emotional_volatility: volatility,
      engagement_correlation: this.calculateEngagementCorrelation(dominantEmotions),
      insights
    };
  }

  /**
   * Calculate emotional volatility
   */
  private static calculateEmotionalVolatility(profiles: EmotionalProfile[]): number {
    if (profiles.length < 2) return 0;

    const sentiments = profiles.map(p => p.sentimentScore);
    const mean = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const variance = sentiments.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sentiments.length;

    return Math.min(Math.sqrt(variance), 1); // Normalize to 0-1
  }

  /**
   * Calculate correlation between emotions and engagement
   */
  private static calculateEngagementCorrelation(
    dominantEmotions: Array<{ emotion: string; percentage: number }>
  ): number {
    // High-engagement emotions
    const highEngagementEmotions = ['urgency', 'curiosity', 'aspiration', 'success'];
    
    let score = 0;
    dominantEmotions.forEach(({ emotion, percentage }) => {
      if (highEngagementEmotions.includes(emotion)) {
        score += percentage;
      }
    });

    return Math.min(score / 100, 1);
  }

  /**
   * Generate actionable emotional insights
   */
  private static generateEmotionalInsights(
    dominantEmotions: Array<{ emotion: string; percentage: number }>,
    overallSentiment: number,
    volatility: number
  ): EmotionalInsight[] {
    const insights: EmotionalInsight[] = [];

    // Opportunity insights
    dominantEmotions.slice(0, 3).forEach(({ emotion, percentage }) => {
      if (percentage > 20) {
        insights.push({
          type: 'opportunity',
          emotion,
          insight: `${percentage}% of audience shows ${emotion} - strong opportunity for targeted content`,
          confidence: percentage / 100,
          actionable: true,
          recommendation: this.getEmotionRecommendation(emotion)
        });
      }
    });

    // Risk insights
    if (overallSentiment < -0.3) {
      insights.push({
        type: 'risk',
        emotion: 'negative_sentiment',
        insight: 'Audience sentiment trending negative - immediate action recommended',
        confidence: 0.85,
        actionable: true,
        recommendation: 'Focus on trust-building and value demonstration'
      });
    }

    // Volatility insights
    if (volatility > 0.6) {
      insights.push({
        type: 'trend',
        emotion: 'volatility',
        insight: 'High emotional volatility detected - audience is highly reactive',
        confidence: 0.75,
        actionable: true,
        recommendation: 'Use consistent messaging to build stability'
      });
    }

    return insights;
  }

  /**
   * Get recommendation for specific emotion
   */
  private static getEmotionRecommendation(emotion: string): string {
    const recommendations: Record<string, string> = {
      urgency: 'Create time-sensitive offers and limited opportunities',
      trust: 'Emphasize testimonials, guarantees, and social proof',
      aspiration: 'Showcase success stories and transformation journeys',
      fear: 'Address concerns directly and provide security assurances',
      curiosity: 'Use mystery and reveal strategies to drive engagement',
      success: 'Highlight achievements and ROI in your messaging',
      belonging: 'Build community features and emphasize shared values'
    };

    return recommendations[emotion] || 'Leverage this emotional response in your content strategy';
  }

  /**
   * Track emotional performance over time
   */
  static trackEmotionalPerformance(
    contentId: string,
    emotionalProfile: EmotionalProfile,
    actualEngagement: number
  ): void {
    // In production, store this data for ML training
    console.log('Emotional performance tracked:', {
      contentId,
      predictedIntensity: emotionalProfile.emotionalIntensity,
      actualEngagement,
      accuracy: this.calculatePredictionAccuracy(emotionalProfile.emotionalIntensity, actualEngagement)
    });
  }

  /**
   * Calculate prediction accuracy
   */
  private static calculatePredictionAccuracy(predicted: number, actual: number): number {
    return 1 - Math.abs(predicted - actual);
  }

  /**
   * Get emotional benchmark data
   */
  static getEmotionalBenchmarks(): {
    industry_average: number;
    top_performers: number;
    your_score: number;
  } {
    return {
      industry_average: 0.62,
      top_performers: 0.85,
      your_score: 0.73 // Would be calculated from user data
    };
  }
}

export default EmotionalAnalytics;

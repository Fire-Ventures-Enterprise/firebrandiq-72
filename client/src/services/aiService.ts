export interface SentimentAnalysis {
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface BrandMention {
  id: string;
  content: string;
  source: string;
  url: string;
  timestamp: Date;
  sentiment: SentimentAnalysis;
  keywords: string[];
  entities: string[];
  reach: number;
  influence: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionItems: string[];
  expectedOutcome: string;
  timeline: string;
  priority: number;
}

export interface CompetitorInsight {
  competitor: string;
  metric: string;
  theirValue: number;
  yourValue: number;
  gap: number;
  recommendation: string;
}

// Mock AI service - replace with actual AI integration
export class AIService {
  static async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple sentiment analysis simulation
    const positiveWords = ['amazing', 'great', 'excellent', 'good', 'love', 'awesome', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'poor', 'worst', 'disappointing'];
    
    const words = text.toLowerCase().split(' ');
    let score = 0;
    let wordCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) {
        score += 1;
        wordCount++;
      } else if (negativeWords.includes(word)) {
        score -= 1;
        wordCount++;
      }
    });
    
    const normalizedScore = wordCount > 0 ? score / wordCount : 0;
    const magnitude = Math.abs(normalizedScore);
    
    let label: 'positive' | 'negative' | 'neutral';
    if (normalizedScore > 0.1) label = 'positive';
    else if (normalizedScore < -0.1) label = 'negative';
    else label = 'neutral';
    
    return {
      score: Math.max(-1, Math.min(1, normalizedScore)),
      magnitude: Math.min(1, magnitude),
      label,
      confidence: Math.min(0.95, 0.6 + magnitude * 0.4)
    };
  }

  static async generateRecommendations(brandData: any): Promise<AIRecommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recommendations: AIRecommendation[] = [
      {
        id: '1',
        title: 'Improve Social Media Engagement',
        description: 'Your Instagram engagement rate has decreased by 15% this month. Focus on interactive content like polls, Q&As, and user-generated content.',
        category: 'Social Media',
        impact: 'high',
        confidence: 0.87,
        actionItems: [
          'Post 2-3 Instagram Stories daily with polls or questions',
          'Create weekly user-generated content campaigns',
          'Respond to comments within 2 hours',
          'Use trending hashtags relevant to your industry'
        ],
        expectedOutcome: 'Increase engagement rate by 25% within 4 weeks',
        timeline: '4 weeks',
        priority: 1
      },
      {
        id: '2',
        title: 'Address Customer Service Concerns',
        description: 'Recent mentions show increasing complaints about response times. 23% of negative mentions relate to support issues.',
        category: 'Customer Service',
        impact: 'high',
        confidence: 0.92,
        actionItems: [
          'Implement live chat support',
          'Create comprehensive FAQ section',
          'Set up automated response system',
          'Train support team on product updates'
        ],
        expectedOutcome: 'Reduce negative support mentions by 40%',
        timeline: '6 weeks',
        priority: 2
      },
      {
        id: '3',
        title: 'Expand Content Marketing',
        description: 'Your blog content generates 3x more engagement than social posts. Increase content production and distribution.',
        category: 'Content Strategy',
        impact: 'medium',
        confidence: 0.78,
        actionItems: [
          'Publish 2 blog posts per week',
          'Create downloadable resources',
          'Start a weekly newsletter',
          'Repurpose blog content for social media'
        ],
        expectedOutcome: 'Increase organic traffic by 35%',
        timeline: '8 weeks',
        priority: 3
      }
    ];
    
    return recommendations;
  }

  static async analyzeCompetitors(competitors: string[]): Promise<CompetitorInsight[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        competitor: 'Competitor A',
        metric: 'Social Media Followers',
        theirValue: 25000,
        yourValue: 15400,
        gap: -38.4,
        recommendation: 'Focus on LinkedIn and Twitter growth through thought leadership content'
      },
      {
        competitor: 'Competitor B',
        metric: 'Content Publishing Frequency',
        theirValue: 12,
        yourValue: 6,
        gap: -50,
        recommendation: 'Double your content output to match industry standards'
      },
      {
        competitor: 'Competitor C',
        metric: 'Customer Support Response Time',
        theirValue: 2,
        yourValue: 8,
        gap: 300,
        recommendation: 'Implement faster support channels to improve customer satisfaction'
      }
    ];
  }

  static async predictTrends(mentions: BrandMention[]): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Analyze mention patterns
    const sentimentTrend = mentions.map(m => ({
      date: m.timestamp,
      sentiment: m.sentiment.score,
      volume: 1
    }));
    
    const keywordFrequency = mentions.reduce((acc, mention) => {
      mention.keywords.forEach(keyword => {
        acc[keyword] = (acc[keyword] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const trendingKeywords = Object.entries(keywordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));
    
    return {
      sentimentTrend,
      trendingKeywords,
      predictions: {
        nextWeekVolume: mentions.length * 1.15,
        sentimentDirection: 'improving',
        riskFactors: ['negative review spike', 'competitor campaign']
      }
    };
  }

  static async generateInsights(data: any): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        type: 'trend',
        title: 'Sentiment Recovery Detected',
        content: 'Your brand sentiment has improved by 23% over the past week, primarily due to positive customer service feedback.',
        confidence: 0.89,
        impact: 'positive',
        timeframe: 'last 7 days'
      },
      {
        type: 'alert',
        title: 'Competitor Activity Spike',
        content: 'Your main competitor launched a major marketing campaign. Consider counter-messaging to maintain market share.',
        confidence: 0.94,
        impact: 'negative',
        timeframe: 'last 24 hours'
      },
      {
        type: 'opportunity',
        title: 'Viral Content Potential',
        content: 'Your recent product demo video has 40% higher engagement than average. Consider boosting with paid promotion.',
        confidence: 0.76,
        impact: 'positive',
        timeframe: 'current'
      }
    ];
  }
}
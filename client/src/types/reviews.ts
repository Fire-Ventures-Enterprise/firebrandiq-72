export interface ReviewPlatform {
  platform: 'google' | 'yelp' | 'facebook' | 'trustpilot' | 'amazon' | 'glassdoor';
  businessId: string;
  averageRating: number;
  totalReviews: number;
  recentReviews: Review[];
  reviewGoals: ReviewGoals;
}

export interface Review {
  id: string;
  platform: string;
  rating: number;
  text: string;
  authorName: string;
  authorImage?: string;
  date: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  responseStatus: 'pending' | 'responded' | 'ignored';
  isVerified: boolean;
}

export interface ReviewGoals {
  targetRating: number;
  targetCount: number;
  currentGap: number;
  monthlyTarget: number;
  exposureLevel: 'low' | 'medium' | 'high' | 'excellent';
}

export interface ReviewRequest {
  id: string;
  brandId: string;
  customerEmail: string;
  customerName: string;
  platform: 'google' | 'yelp' | 'facebook';
  status: 'pending' | 'sent' | 'completed' | 'declined';
  sentDate?: Date;
  completedDate?: Date;
  reviewUrl: string;
  message?: string;
  campaignId?: string;
}

export interface ReviewAnalytics {
  overallScore: number;
  trendDirection: 'up' | 'down' | 'stable';
  platformBreakdown: PlatformStats[];
  competitorComparison: CompetitorStats[];
  actionableInsights: string[];
  exposureOpportunities: ExposureOpportunity[];
}

export interface PlatformStats {
  platform: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  monthlyGrowth: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  responseRate: number;
}

export interface CompetitorStats {
  competitorName: string;
  platform: string;
  totalReviews: number;
  averageRating: number;
  gap: number;
  opportunity: string;
}

export interface ExposureOpportunity {
  platform: string;
  opportunity: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'difficult';
  estimatedTimeframe: string;
  priority: number;
}

export interface ReviewCampaign {
  id: string;
  brandId: string;
  name: string;
  platforms: string[];
  totalCustomers: number;
  requestsSent: number;
  reviewsReceived: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  customMessage?: string;
}

// Google Business Profile recommendations
export function calculateGoogleExposureNeeds(currentReviews: number, currentRating: number) {
  let exposureLevel = 'low';
  let targetReviews = 50;
  let targetRating = 4.5;
  
  // Google algorithm preferences
  if (currentReviews < 10) {
    exposureLevel = 'low';
    targetReviews = 25;
  } else if (currentReviews < 25) {
    exposureLevel = 'medium';
    targetReviews = 50;
  } else if (currentReviews < 100) {
    exposureLevel = 'high';
    targetReviews = 100;
  } else {
    exposureLevel = 'excellent';
    targetReviews = currentReviews + 10; // Maintain momentum
  }

  return {
    currentLevel: exposureLevel,
    reviewsNeeded: Math.max(0, targetReviews - currentReviews),
    ratingImprovement: Math.max(0, targetRating - currentRating),
    monthlyTarget: Math.ceil((targetReviews - currentReviews) / 6), // 6-month goal
    recommendations: getExposureRecommendations(exposureLevel, currentReviews, currentRating)
  };
}

function getExposureRecommendations(level: string, reviews: number, rating: number) {
  const recommendations = [];
  
  if (reviews < 10) {
    recommendations.push("🎯 Priority: Get to 10 reviews ASAP for Google credibility");
    recommendations.push("📧 Send review requests to recent customers immediately");
  } else if (reviews < 25) {
    recommendations.push("📈 Good progress! Target 25 reviews for better local ranking");
    recommendations.push("🔄 Automate review requests after purchase/service");
  } else if (reviews < 100) {
    recommendations.push("🚀 You're in the competition zone! Push for 100+ reviews");
    recommendations.push("⭐ Focus on maintaining 4.5+ star average");
  }

  if (rating < 4.0) {
    recommendations.push("🚨 URGENT: Address negative reviews immediately");
    recommendations.push("💬 Implement service recovery for unhappy customers");
  } else if (rating < 4.5) {
    recommendations.push("📊 Good rating! Aim for 4.5+ for premium positioning");
  }

  return recommendations;
}
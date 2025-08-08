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
  customerEmail: string;
  customerName: string;
  platform: string;
  status: 'pending' | 'sent' | 'responded' | 'expired';
  sentDate?: Date;
  responseDate?: Date;
  reviewId?: string;
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
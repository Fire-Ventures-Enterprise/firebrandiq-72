import { ReviewAnalytics, PlatformStats, CompetitorStats, ExposureOpportunity, Review, ReviewPlatform } from "@/types/reviews";

// Mock storage service - in real implementation, this would connect to Supabase
const storage = {
  async getBrand(brandId: string) {
    return {
      id: brandId,
      name: 'Sample Business',
      industry: 'Restaurant',
      googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      yelpId: 'sample-business-san-francisco',
      facebookId: 'samplebusiness'
    };
  },
  
  async getAllReviewsForBrand(brandId: string): Promise<Review[]> {
    // Mock review data
    return [
      {
        id: '1',
        platform: 'google',
        rating: 5,
        text: 'Excellent service!',
        authorName: 'John Doe',
        date: new Date('2024-01-15'),
        sentiment: 'positive',
        responseStatus: 'responded',
        isVerified: true
      },
      {
        id: '2',
        platform: 'google',
        rating: 4,
        text: 'Good experience overall',
        authorName: 'Jane Smith',
        date: new Date('2024-01-20'),
        sentiment: 'positive',
        responseStatus: 'pending',
        isVerified: true
      },
      // Add more mock reviews...
    ];
  },
  
  async getCompetitorReviews(industry: string) {
    return [
      {
        name: 'Competitor A',
        platform: 'google',
        totalReviews: 150,
        averageRating: 4.3
      },
      {
        name: 'Competitor B',
        platform: 'google',
        totalReviews: 89,
        averageRating: 4.1
      }
    ];
  }
};

export async function calculateReviewAnalytics(brandId: string): Promise<ReviewAnalytics> {
  const brand = await storage.getBrand(brandId);
  const reviews = await storage.getAllReviewsForBrand(brandId);
  const competitors = await storage.getCompetitorReviews(brand.industry);

  // Platform breakdown
  const platformStats = calculatePlatformBreakdown(reviews);
  
  // Competitor analysis
  const competitorComparison = calculateCompetitorGaps(reviews, competitors);
  
  // Exposure opportunities
  const opportunities = identifyExposureOpportunities(platformStats, competitorComparison);

  return {
    overallScore: calculateOverallReviewScore(platformStats),
    trendDirection: calculateTrend(reviews),
    platformBreakdown: platformStats,
    competitorComparison,
    actionableInsights: generateActionableInsights(platformStats, opportunities),
    exposureOpportunities: opportunities
  };
}

function calculatePlatformBreakdown(reviews: Review[]): PlatformStats[] {
  const platforms = ['google', 'yelp', 'facebook', 'trustpilot'];
  
  return platforms.map(platform => {
    const platformReviews = reviews.filter(r => r.platform === platform);
    const totalReviews = platformReviews.length;
    
    if (totalReviews === 0) {
      return {
        platform,
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {},
        monthlyGrowth: 0,
        sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
        responseRate: 0
      };
    }

    const averageRating = platformReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    
    // Rating distribution
    const ratingDistribution = platformReviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    // Sentiment breakdown
    const sentimentBreakdown = platformReviews.reduce((acc, review) => {
      acc[review.sentiment]++;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    // Response rate
    const responded = platformReviews.filter(r => r.responseStatus === 'responded').length;
    const responseRate = totalReviews > 0 ? (responded / totalReviews) * 100 : 0;

    // Monthly growth (mock calculation)
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
    const thisMonthReviews = platformReviews.filter(r => r.date >= lastMonth).length;
    const previousMonthReviews = totalReviews - thisMonthReviews;
    const monthlyGrowth = previousMonthReviews > 0 ? ((thisMonthReviews - previousMonthReviews) / previousMonthReviews) * 100 : 0;

    return {
      platform,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingDistribution,
      monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
      sentimentBreakdown,
      responseRate: Number(responseRate.toFixed(1))
    };
  }).filter(stats => stats.totalReviews > 0);
}

function calculateCompetitorGaps(reviews: Review[], competitors: any[]): CompetitorStats[] {
  const myStats = calculatePlatformBreakdown(reviews);
  
  return competitors.map(competitor => {
    const myPlatformStats = myStats.find(s => s.platform === competitor.platform);
    const gap = competitor.totalReviews - (myPlatformStats?.totalReviews || 0);
    const ratingGap = competitor.averageRating - (myPlatformStats?.averageRating || 0);
    
    let opportunity = '';
    if (gap > 50) {
      opportunity = `Significant review volume gap - focus on increasing ${competitor.platform} reviews`;
    } else if (ratingGap > 0.3) {
      opportunity = `Rating improvement opportunity - focus on service quality for ${competitor.platform}`;
    } else {
      opportunity = `Competitive position - maintain current strategy for ${competitor.platform}`;
    }

    return {
      competitorName: competitor.name,
      platform: competitor.platform,
      totalReviews: competitor.totalReviews,
      averageRating: competitor.averageRating,
      gap,
      opportunity
    };
  });
}

function identifyExposureOpportunities(platforms: PlatformStats[], competitors: CompetitorStats[]): ExposureOpportunity[] {
  const opportunities: ExposureOpportunity[] = [];

  // Google-specific opportunities
  const googleStats = platforms.find(p => p.platform === 'google');
  if (googleStats) {
    if (googleStats.totalReviews < 10) {
      opportunities.push({
        platform: 'google',
        opportunity: `Get ${10 - googleStats.totalReviews} more Google reviews for basic credibility`,
        impact: 'high',
        effort: 'easy',
        estimatedTimeframe: '2-4 weeks',
        priority: 1
      });
    } else if (googleStats.totalReviews < 25) {
      opportunities.push({
        platform: 'google',
        opportunity: `Get ${25 - googleStats.totalReviews} more Google reviews for local SEO boost`,
        impact: 'high',
        effort: 'moderate',
        estimatedTimeframe: '2-3 months',
        priority: 2
      });
    } else if (googleStats.totalReviews < 100) {
      opportunities.push({
        platform: 'google',
        opportunity: `Reach 100+ Google reviews for premium local ranking`,
        impact: 'medium',
        effort: 'moderate',
        estimatedTimeframe: '3-6 months',
        priority: 3
      });
    }

    if (googleStats.averageRating < 4.5 && googleStats.totalReviews > 5) {
      opportunities.push({
        platform: 'google',
        opportunity: `Improve Google rating from ${googleStats.averageRating} to 4.5+ for better visibility`,
        impact: 'high',
        effort: 'moderate',
        estimatedTimeframe: '1-2 months',
        priority: 1
      });
    }

    if (googleStats.responseRate < 70) {
      opportunities.push({
        platform: 'google',
        opportunity: `Increase response rate to 70%+ to show customer engagement`,
        impact: 'medium',
        effort: 'easy',
        estimatedTimeframe: '2-4 weeks',
        priority: 2
      });
    }
  }

  // Platform-specific opportunities
  platforms.forEach(platform => {
    if (platform.sentimentBreakdown.negative > platform.sentimentBreakdown.positive * 0.2) {
      opportunities.push({
        platform: platform.platform,
        opportunity: `Address negative sentiment on ${platform.platform} - implement service recovery`,
        impact: 'high',
        effort: 'moderate',
        estimatedTimeframe: '1-3 months',
        priority: 1
      });
    }

    if (platform.monthlyGrowth < 5 && platform.totalReviews > 0) {
      opportunities.push({
        platform: platform.platform,
        opportunity: `Accelerate review acquisition on ${platform.platform} - monthly growth below 5%`,
        impact: 'medium',
        effort: 'moderate',
        estimatedTimeframe: '1-2 months',
        priority: 3
      });
    }
  });

  // Competitor gap opportunities
  competitors.forEach(competitor => {
    if (competitor.gap > 30) {
      opportunities.push({
        platform: competitor.platform,
        opportunity: `Close ${competitor.gap} review gap with ${competitor.competitorName} on ${competitor.platform}`,
        impact: 'high',
        effort: 'difficult',
        estimatedTimeframe: '3-6 months',
        priority: 2
      });
    }
  });

  return opportunities.sort((a, b) => a.priority - b.priority);
}

function calculateOverallReviewScore(platforms: PlatformStats[]): number {
  if (platforms.length === 0) return 0;
  
  let totalScore = 0;
  let weightedSum = 0;
  
  platforms.forEach(platform => {
    // Weight Google more heavily
    const weight = platform.platform === 'google' ? 0.4 : 0.2;
    
    // Calculate platform score (0-100)
    let platformScore = 0;
    
    // Review count score (40% of platform score)
    let reviewCountScore = Math.min(platform.totalReviews / 100, 1) * 40;
    
    // Rating score (40% of platform score)
    let ratingScore = (platform.averageRating / 5) * 40;
    
    // Response rate score (20% of platform score)
    let responseScore = (platform.responseRate / 100) * 20;
    
    platformScore = reviewCountScore + ratingScore + responseScore;
    
    totalScore += platformScore * weight;
    weightedSum += weight;
  });
  
  return Math.round(totalScore / weightedSum);
}

function calculateTrend(reviews: Review[]): 'up' | 'down' | 'stable' {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2);
  
  const thisMonth = reviews.filter(r => r.date >= lastMonth).length;
  const previousMonth = reviews.filter(r => r.date >= twoMonthsAgo && r.date < lastMonth).length;
  
  if (thisMonth > previousMonth * 1.1) return 'up';
  if (thisMonth < previousMonth * 0.9) return 'down';
  return 'stable';
}

function generateActionableInsights(platforms: PlatformStats[], opportunities: ExposureOpportunity[]): string[] {
  const insights: string[] = [];
  
  const totalReviews = platforms.reduce((sum, p) => sum + p.totalReviews, 0);
  const avgRating = platforms.reduce((sum, p) => sum + (p.averageRating * p.totalReviews), 0) / totalReviews;
  
  if (totalReviews < 50) {
    insights.push("🎯 Priority Focus: Increase review volume to build credibility and improve search visibility");
  }
  
  if (avgRating < 4.0) {
    insights.push("🚨 Critical: Address service quality issues immediately - rating below 4.0 hurts visibility");
  } else if (avgRating < 4.5) {
    insights.push("📈 Opportunity: Improve to 4.5+ stars for premium positioning in search results");
  }
  
  const googlePlatform = platforms.find(p => p.platform === 'google');
  if (googlePlatform) {
    if (googlePlatform.responseRate < 50) {
      insights.push("💬 Quick Win: Respond to more Google reviews to show engagement and improve local SEO");
    }
    
    if (googlePlatform.sentimentBreakdown.negative > googlePlatform.sentimentBreakdown.positive * 0.15) {
      insights.push("⚠️ Service Recovery: Implement process to address negative feedback proactively");
    }
  }
  
  // Add top 3 high-impact opportunities
  const highImpactOpportunities = opportunities
    .filter(o => o.impact === 'high')
    .slice(0, 3);
    
  highImpactOpportunities.forEach(opp => {
    insights.push(`🚀 ${opp.platform.toUpperCase()}: ${opp.opportunity}`);
  });
  
  return insights;
}
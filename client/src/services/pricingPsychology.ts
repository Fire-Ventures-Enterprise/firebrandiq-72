/**
 * PricingPsychology Module - FirebrandIQ Premium Feature
 * Revenue optimization based on user behavior patterns
 * Implements Concentration principle with 3x weighting for high-revenue opportunities
 */

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  psychologyScore: number;
  revenueWeight: number;
}

export interface UserBehaviorProfile {
  userId: string;
  engagementLevel: 'high' | 'medium' | 'low';
  featureUsage: Record<string, number>;
  willingness_to_pay: number;
  urgencyScore: number;
  valuePerception: number;
}

export interface PricingRecommendation {
  recommendedTier: string;
  confidence: number;
  reasoning: string;
  urgencyTriggers: string[];
  valuePropositions: string[];
  psychologyTactics: string[];
}

export class PricingPsychology {
  private static readonly REVENUE_MULTIPLIER = 3;
  private static readonly BASE_TIERS: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 299,
      features: ['Basic Analytics', '5 Brands', 'Standard Support'],
      psychologyScore: 50,
      revenueWeight: 1
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 599,
      features: ['Advanced Analytics', '15 Brands', 'Priority Support', 'AI Insights'],
      psychologyScore: 75,
      revenueWeight: 2
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 999,
      features: ['Full Analytics Suite', 'Unlimited Brands', 'White-Label', 'Dedicated Account Manager'],
      psychologyScore: 90,
      revenueWeight: 3
    }
  ];

  /**
   * Analyze user behavior and recommend optimal pricing tier
   */
  static analyzeUserForPricing(behaviorProfile: UserBehaviorProfile): PricingRecommendation {
    const tierScores = this.calculateTierScores(behaviorProfile);
    const recommendedTier = this.selectOptimalTier(tierScores, behaviorProfile);
    const psychologyTactics = this.generatePsychologyTactics(behaviorProfile, recommendedTier);

    return {
      recommendedTier: recommendedTier.id,
      confidence: tierScores[recommendedTier.id] / 100,
      reasoning: this.generateReasoning(behaviorProfile, recommendedTier),
      urgencyTriggers: this.generateUrgencyTriggers(behaviorProfile),
      valuePropositions: this.generateValuePropositions(recommendedTier, behaviorProfile),
      psychologyTactics
    };
  }

  /**
   * Calculate weighted scores for each pricing tier based on user behavior
   */
  private static calculateTierScores(profile: UserBehaviorProfile): Record<string, number> {
    const scores: Record<string, number> = {};

    this.BASE_TIERS.forEach(tier => {
      let score = tier.psychologyScore;

      // Apply engagement multiplier
      if (profile.engagementLevel === 'high') {
        score *= 1.3;
      } else if (profile.engagementLevel === 'low') {
        score *= 0.7;
      }

      // Apply willingness to pay
      score *= profile.willingness_to_pay;

      // Apply revenue weight (Concentration principle - 3x for high-revenue)
      score *= tier.revenueWeight;

      scores[tier.id] = Math.min(score, 100);
    });

    return scores;
  }

  /**
   * Select optimal tier based on scores and behavior
   */
  private static selectOptimalTier(
    scores: Record<string, number>,
    profile: UserBehaviorProfile
  ): PricingTier {
    // Find highest scoring tier
    let bestTierId = 'starter';
    let highestScore = 0;

    Object.entries(scores).forEach(([tierId, score]) => {
      if (score > highestScore) {
        highestScore = score;
        bestTierId = tierId;
      }
    });

    return this.BASE_TIERS.find(t => t.id === bestTierId) || this.BASE_TIERS[0];
  }

  /**
   * Generate psychological reasoning for recommendation
   */
  private static generateReasoning(
    profile: UserBehaviorProfile,
    tier: PricingTier
  ): string {
    const reasons: string[] = [];

    if (profile.engagementLevel === 'high') {
      reasons.push('Your high engagement indicates you value comprehensive features');
    }

    if (profile.valuePerception > 0.8) {
      reasons.push('You recognize the value of premium capabilities');
    }

    if (tier.revenueWeight === 3) {
      reasons.push('This tier offers the highest ROI for power users');
    }

    return reasons.join('. ') + '.';
  }

  /**
   * Generate urgency triggers based on psychology principles
   */
  private static generateUrgencyTriggers(profile: UserBehaviorProfile): string[] {
    const triggers: string[] = [];

    if (profile.urgencyScore > 0.7) {
      triggers.push('Limited time: 20% off for first 3 months');
      triggers.push('Only 5 spots left at this price');
    } else if (profile.urgencyScore > 0.4) {
      triggers.push('Special offer ends this month');
      triggers.push('Join 500+ successful brands');
    }

    return triggers;
  }

  /**
   * Generate value propositions tailored to user
   */
  private static generateValuePropositions(
    tier: PricingTier,
    profile: UserBehaviorProfile
  ): string[] {
    const propositions: string[] = [];

    // Specialization: Focus on key benefits
    propositions.push(`${tier.features[0]} - Your most-used feature`);

    // Differentiation: Exclusive benefits
    if (tier.revenueWeight === 3) {
      propositions.push('Exclusive: White-label capabilities unavailable elsewhere');
    }

    // Concentration: Revenue-focused
    propositions.push(`Expected ROI: ${tier.revenueWeight * 150}% in first year`);

    return propositions;
  }

  /**
   * Generate psychology-based pricing tactics
   */
  private static generatePsychologyTactics(
    profile: UserBehaviorProfile,
    tier: PricingTier
  ): string[] {
    const tactics: string[] = [];

    // Social Proof
    tactics.push(`${tier.name} is chosen by 67% of successful brands`);

    // Anchoring
    const higherTier = this.BASE_TIERS.find(t => t.price > tier.price);
    if (higherTier) {
      tactics.push(`Save $${higherTier.price - tier.price}/mo vs ${higherTier.name}`);
    }

    // Scarcity
    if (profile.urgencyScore > 0.6) {
      tactics.push('Limited slots available this month');
    }

    // Authority
    tactics.push('Trusted by Fortune 500 companies');

    return tactics;
  }

  /**
   * Calculate upgrade probability based on behavior
   */
  static calculateUpgradeProbability(
    currentTier: string,
    behaviorProfile: UserBehaviorProfile
  ): number {
    let probability = 0.3; // Base 30% chance

    // Increase based on engagement
    if (behaviorProfile.engagementLevel === 'high') {
      probability += 0.25;
    }

    // Increase based on willingness to pay
    probability += behaviorProfile.willingness_to_pay * 0.3;

    // Increase based on value perception
    probability += behaviorProfile.valuePerception * 0.15;

    return Math.min(probability, 0.95); // Cap at 95%
  }

  /**
   * Get pricing presentation optimized for psychology
   */
  static getOptimizedPricingDisplay(
    recommendation: PricingRecommendation
  ): {
    highlightTier: string;
    presentationOrder: string[];
    emphasizedFeatures: string[];
  } {
    // Concentration principle: Put recommended tier in center
    const presentationOrder = ['starter', recommendation.recommendedTier, 'enterprise']
      .filter((tier, index, self) => self.indexOf(tier) === index);

    // Specialization: Highlight top 3 features
    const tier = this.BASE_TIERS.find(t => t.id === recommendation.recommendedTier);
    const emphasizedFeatures = tier?.features.slice(0, 3) || [];

    return {
      highlightTier: recommendation.recommendedTier,
      presentationOrder,
      emphasizedFeatures
    };
  }

  /**
   * Track pricing interaction for optimization
   */
  static trackPricingInteraction(
    userId: string,
    interaction: {
      tierViewed: string;
      timeSpent: number;
      clicked: boolean;
    }
  ): void {
    // In production, this would send to analytics
    console.log('Pricing interaction tracked:', {
      userId,
      ...interaction,
      timestamp: Date.now()
    });
  }

  /**
   * Generate upgrade path recommendations
   */
  static generateUpgradePath(
    currentTier: string,
    behaviorProfile: UserBehaviorProfile
  ): {
    nextTier: string;
    triggerPoints: string[];
    incentives: string[];
  } {
    const currentIndex = this.BASE_TIERS.findIndex(t => t.id === currentTier);
    const nextTier = this.BASE_TIERS[currentIndex + 1];

    if (!nextTier) {
      return {
        nextTier: currentTier,
        triggerPoints: [],
        incentives: []
      };
    }

    return {
      nextTier: nextTier.id,
      triggerPoints: [
        'Using 80% of current tier features',
        'Requesting features from higher tier',
        'High engagement for 3+ months'
      ],
      incentives: [
        `Unlock ${nextTier.features.length - this.BASE_TIERS[currentIndex].features.length} new features`,
        '20% discount for loyal customers',
        'Priority onboarding included'
      ]
    };
  }
}

export default PricingPsychology;

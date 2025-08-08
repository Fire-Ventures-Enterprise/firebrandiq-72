import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const brandId = url.searchParams.get('brandId') || 'default-brand';

    // Mock review analytics calculation
    const analytics = {
      overallScore: 78,
      trendDirection: 'up',
      platformBreakdown: [
        {
          platform: 'google',
          totalReviews: 45,
          averageRating: 4.2,
          ratingDistribution: { 5: 20, 4: 15, 3: 8, 2: 2, 1: 0 },
          monthlyGrowth: 12.5,
          sentimentBreakdown: { positive: 38, neutral: 5, negative: 2 },
          responseRate: 85.2
        },
        {
          platform: 'yelp',
          totalReviews: 28,
          averageRating: 4.1,
          ratingDistribution: { 5: 12, 4: 10, 3: 4, 2: 2, 1: 0 },
          monthlyGrowth: 8.3,
          sentimentBreakdown: { positive: 22, neutral: 4, negative: 2 },
          responseRate: 67.9
        }
      ],
      competitorComparison: [
        {
          competitorName: 'Competitor A',
          platform: 'google',
          totalReviews: 89,
          averageRating: 4.3,
          gap: 44,
          opportunity: 'Significant review volume gap - focus on increasing Google reviews'
        }
      ],
      actionableInsights: [
        '🎯 Priority Focus: Increase review volume to build credibility and improve search visibility',
        '📈 Opportunity: Improve to 4.5+ stars for premium positioning in search results',
        '💬 Quick Win: Respond to more Google reviews to show engagement and improve local SEO'
      ],
      exposureOpportunities: [
        {
          platform: 'google',
          opportunity: 'Get 25 more Google reviews for local SEO boost',
          impact: 'high',
          effort: 'moderate',
          estimatedTimeframe: '2-3 months',
          priority: 1
        },
        {
          platform: 'google',
          opportunity: 'Improve Google rating from 4.2 to 4.5+ for better visibility',
          impact: 'high',
          effort: 'moderate',
          estimatedTimeframe: '1-2 months',
          priority: 1
        }
      ]
    };

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in review-analytics function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
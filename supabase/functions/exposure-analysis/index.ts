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

    // Mock Google exposure analysis
    const mockReviews = 18; // Current Google reviews
    const mockRating = 4.2; // Current average rating

    const exposureAnalysis = calculateGoogleExposureNeeds(mockReviews, mockRating);

    const response = {
      platform: 'google',
      current: {
        reviews: mockReviews,
        rating: mockRating
      },
      analysis: exposureAnalysis
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in exposure-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateGoogleExposureNeeds(currentReviews: number, currentRating: number) {
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
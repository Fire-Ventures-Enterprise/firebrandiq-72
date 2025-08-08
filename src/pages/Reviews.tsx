import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ReviewPlatformCard } from "@/components/reviews/ReviewPlatformCard";
import { ReviewRequestForm } from "@/components/reviews/ReviewRequestForm";
import { CampaignBuilder } from "@/components/reviews/CampaignBuilder";
import { ReviewAnalytics } from "@/components/reviews/ReviewAnalytics";
import { ExposureInsights } from "@/components/reviews/ExposureInsights";
import { CampaignDashboard } from "@/components/reviews/CampaignDashboard";
import { ReviewAnalyticsDashboard } from "@/components/reviews/ReviewAnalyticsDashboard";
import { ReviewPlatform, calculateGoogleExposureNeeds } from "@/types/reviews";
import { Star, TrendingUp, Send, Target } from "lucide-react";

// Mock data
const mockReviewPlatforms: ReviewPlatform[] = [
  {
    platform: 'google',
    businessId: 'google-business-123',
    averageRating: 4.2,
    totalReviews: 18,
    recentReviews: [],
    reviewGoals: {
      targetRating: 4.5,
      targetCount: 25,
      currentGap: 7,
      monthlyTarget: 4,
      exposureLevel: 'medium'
    }
  },
  {
    platform: 'yelp',
    businessId: 'yelp-business-456',
    averageRating: 4.1,
    totalReviews: 12,
    recentReviews: [],
    reviewGoals: {
      targetRating: 4.3,
      targetCount: 20,
      currentGap: 8,
      monthlyTarget: 3,
      exposureLevel: 'low'
    }
  },
  {
    platform: 'facebook',
    businessId: 'fb-business-789',
    averageRating: 4.6,
    totalReviews: 34,
    recentReviews: [],
    reviewGoals: {
      targetRating: 4.7,
      targetCount: 50,
      currentGap: 16,
      monthlyTarget: 5,
      exposureLevel: 'high'
    }
  }
];

export default function Reviews() {
  const [platforms] = useState<ReviewPlatform[]>(mockReviewPlatforms);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);

  const totalReviews = platforms.reduce((sum, platform) => sum + platform.totalReviews, 0);
  const averageRating = platforms.reduce((sum, platform) => sum + (platform.averageRating * platform.totalReviews), 0) / totalReviews;
  const totalGap = platforms.reduce((sum, platform) => sum + platform.reviewGoals.currentGap, 0);

  const googlePlatform = platforms.find(p => p.platform === 'google');
  const googleExposure = googlePlatform ? calculateGoogleExposureNeeds(googlePlatform.totalReviews, googlePlatform.averageRating) : null;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Review Management</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCampaignBuilder(true)} className="gap-2">
            <Target className="h-4 w-4" />
            Create Campaign
          </Button>
          <Button variant="outline" onClick={() => setShowRequestForm(true)} className="gap-2">
            <Send className="h-4 w-4" />
            Single Request
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              +0.2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Needed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGap}</div>
            <p className="text-xs text-muted-foreground">
              To reach all goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Google Exposure</CardTitle>
            <Badge variant={googleExposure?.currentLevel === 'excellent' ? 'default' : 'secondary'}>
              {googleExposure?.currentLevel || 'Low'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{googleExposure?.reviewsNeeded || 0}</div>
            <p className="text-xs text-muted-foreground">
              Reviews needed for better exposure
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="chart-analytics">Chart Analytics</TabsTrigger>
          <TabsTrigger value="exposure">Exposure Insights</TabsTrigger>
          <TabsTrigger value="requests">Review Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => (
              <ReviewPlatformCard key={platform.platform} platform={platform} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <CampaignDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ReviewAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="chart-analytics" className="space-y-4">
          <ReviewAnalytics platforms={platforms} />
        </TabsContent>

        <TabsContent value="exposure" className="space-y-4">
          <ExposureInsights platforms={platforms} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Request Management</CardTitle>
              <CardDescription>
                Track and manage review requests sent to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No review requests sent yet</p>
                <Button onClick={() => setShowRequestForm(true)}>
                  Send Your First Review Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showRequestForm && (
        <ReviewRequestForm onClose={() => setShowRequestForm(false)} />
      )}

      {showCampaignBuilder && (
        <CampaignBuilder 
          onClose={() => setShowCampaignBuilder(false)}
          onCampaignCreated={(campaign) => {
            console.log('Campaign created:', campaign);
            setShowCampaignBuilder(false);
          }}
        />
      )}
    </div>
  );
}
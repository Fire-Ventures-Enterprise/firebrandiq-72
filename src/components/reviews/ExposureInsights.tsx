import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ReviewPlatform, calculateGoogleExposureNeeds } from "@/types/reviews";
import { TrendingUp, Target, AlertTriangle, CheckCircle } from "lucide-react";

interface ExposureInsightsProps {
  platforms: ReviewPlatform[];
}

export function ExposureInsights({ platforms }: ExposureInsightsProps) {
  const googlePlatform = platforms.find(p => p.platform === 'google');
  const googleInsights = googlePlatform ? calculateGoogleExposureNeeds(googlePlatform.totalReviews, googlePlatform.averageRating) : null;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getInsightType = (recommendation: string) => {
    if (recommendation.includes('🚨 URGENT')) return 'urgent';
    if (recommendation.includes('✅') || recommendation.includes('excellent')) return 'success';
    if (recommendation.includes('🚀') || recommendation.includes('📈')) return 'opportunity';
    return 'target';
  };

  const allRecommendations = platforms.flatMap(platform => {
    const insights = calculateGoogleExposureNeeds(platform.totalReviews, platform.averageRating);
    return insights.recommendations.map(rec => ({
      platform: platform.platform,
      recommendation: rec,
      type: getInsightType(rec)
    }));
  });

  return (
    <div className="space-y-6">
      {/* Google Exposure Focus */}
      {googleInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌐 Google Business Exposure Analysis
              <Badge variant={googleInsights.currentLevel === 'excellent' ? 'default' : 'secondary'}>
                {googleInsights.currentLevel}
              </Badge>
            </CardTitle>
            <CardDescription>
              Strategic insights for improving Google Business Profile visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Reviews Needed</p>
                <p className="text-2xl font-bold">{googleInsights.reviewsNeeded}</p>
                <p className="text-xs text-muted-foreground">For next exposure level</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Monthly Target</p>
                <p className="text-2xl font-bold">{googleInsights.monthlyTarget}</p>
                <p className="text-xs text-muted-foreground">Reviews per month</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Rating Gap</p>
                <p className="text-2xl font-bold">{googleInsights.ratingImprovement.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Points to improve</p>
              </div>
            </div>

            {googleInsights.reviewsNeeded > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Next Level</span>
                  <span>{googlePlatform?.totalReviews} / {(googlePlatform?.totalReviews || 0) + googleInsights.reviewsNeeded}</span>
                </div>
                <Progress 
                  value={(googlePlatform?.totalReviews || 0) / ((googlePlatform?.totalReviews || 0) + googleInsights.reviewsNeeded) * 100} 
                  className="h-3" 
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Platform Insights */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => {
          const insights = calculateGoogleExposureNeeds(platform.totalReviews, platform.averageRating);
          return (
            <Card key={platform.platform}>
              <CardHeader className="pb-3">
                <CardTitle className="capitalize text-lg flex items-center gap-2">
                  {platform.platform === 'google' && '🌐'}
                  {platform.platform === 'yelp' && '🍽️'}
                  {platform.platform === 'facebook' && '📘'}
                  {platform.platform}
                </CardTitle>
                <Badge className={
                  insights.currentLevel === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  insights.currentLevel === 'high' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  insights.currentLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }>
                  {insights.currentLevel} exposure
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">{platform.totalReviews} reviews</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Needed</span>
                    <span className="font-medium">{insights.reviewsNeeded} more</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly</span>
                    <span className="font-medium">{insights.monthlyTarget}/month</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  View Strategy
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Recommendations</CardTitle>
          <CardDescription>
            Action items to improve your review presence and platform exposure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allRecommendations.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                {getInsightIcon(item.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.platform}
                    </Badge>
                    <Badge variant={item.type === 'urgent' ? 'destructive' : item.type === 'success' ? 'default' : 'secondary'} className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
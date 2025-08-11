import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ReviewAnalytics } from "@/types/reviews";
import { calculateReviewAnalytics } from "@/services/reviewAnalyticsService";
import { TrendingUp, TrendingDown, Minus, Target, Clock, Zap, AlertTriangle, CheckCircle } from "lucide-react";

interface ReviewAnalyticsDashboardProps {
  brandId?: string;
}

export function ReviewAnalyticsDashboard({ brandId = 'default-brand' }: ReviewAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [brandId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await calculateReviewAnalytics(brandId);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'easy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'difficult':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Failed to load analytics data</p>
          <Button onClick={loadAnalytics} className="mt-2">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            {getTrendIcon(analytics.trendDirection)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallScore}/100</div>
            <p className={`text-xs ${getTrendColor(analytics.trendDirection)}`}>
              {analytics.trendDirection === 'up' && 'Trending up'}
              {analytics.trendDirection === 'down' && 'Trending down'}
              {analytics.trendDirection === 'stable' && 'Stable'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.platformBreakdown.reduce((sum, p) => sum + p.totalReviews, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {analytics.platformBreakdown.length} platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.platformBreakdown.reduce((sum, p) => sum + (p.averageRating * p.totalReviews), 0) / 
                analytics.platformBreakdown.reduce((sum, p) => sum + p.totalReviews, 0) || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Overall rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.exposureOpportunities.length}</div>
            <p className="text-xs text-muted-foreground">
              Growth opportunities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Detailed breakdown by review platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.platformBreakdown.map((platform) => (
              <div key={platform.platform} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium capitalize">{platform.platform}</h4>
                    <Badge variant="outline">{platform.totalReviews} reviews</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{platform.averageRating}/5.0</p>
                    <p className="text-xs text-muted-foreground">
                      {platform.monthlyGrowth > 0 ? '+' : ''}{platform.monthlyGrowth}% monthly
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Response Rate</p>
                    <div className="flex items-center gap-2">
                      <Progress value={platform.responseRate} className="flex-1 h-2" />
                      <span className="text-xs">{platform.responseRate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Positive Sentiment</p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(platform.sentimentBreakdown.positive / platform.totalReviews) * 100} 
                        className="flex-1 h-2" 
                      />
                      <span className="text-xs">
                        {Math.round((platform.sentimentBreakdown.positive / platform.totalReviews) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating Distribution</p>
                    <div className="flex gap-1">
                      {[5, 4, 3, 2, 1].map(rating => (
                        <div
                          key={rating}
                          className="h-2 bg-muted rounded-sm flex-1"
                          style={{
                            backgroundColor: platform.ratingDistribution[rating] 
                              ? `hsl(${rating * 40}, 70%, 50%)`
                              : undefined
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exposure Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Opportunities</CardTitle>
          <CardDescription>Prioritized opportunities to improve your review presence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.exposureOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getEffortIcon(opportunity.effort)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {opportunity.platform}
                    </Badge>
                    <Badge className={getImpactColor(opportunity.impact)} variant="secondary">
                      {opportunity.impact} impact
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {opportunity.effort} effort
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {opportunity.opportunity}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {opportunity.estimatedTimeframe}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Comparison */}
      {analytics.competitorComparison.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Competitor Analysis</CardTitle>
            <CardDescription>How you compare to competitors in your industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.competitorComparison.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{competitor.competitorName}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {competitor.platform} • {competitor.totalReviews} reviews • {competitor.averageRating}/5.0
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={competitor.gap > 0 ? 'destructive' : 'secondary'}>
                      {competitor.gap > 0 ? '+' : ''}{competitor.gap} gap
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {competitor.opportunity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actionable Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Actionable Insights</CardTitle>
          <CardDescription>Key recommendations based on your review data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.actionableInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
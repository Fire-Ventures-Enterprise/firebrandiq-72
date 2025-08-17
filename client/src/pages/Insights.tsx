import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Eye,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const mockInsights = [
  {
    id: "1",
    type: "opportunity",
    title: "Trending Topic Opportunity",
    description: "Your industry is discussing 'AI automation' - 347% increase in mentions this week. Consider joining the conversation.",
    priority: "high",
    confidence: 92,
    impact: "high",
    effort: "low",
    timeline: "24-48 hours",
    actionable: true,
    relatedData: {
      mentions: 2847,
      sentiment: 8.2,
      reach: "1.2M",
      engagement: "4.8%"
    }
  },
  {
    id: "2",
    type: "threat",
    title: "Competitor Content Strategy",
    description: "CompetitorCorp increased their content frequency by 200% last month, gaining 15% more share of voice.",
    priority: "medium",
    confidence: 87,
    impact: "medium",
    effort: "medium",
    timeline: "1-2 weeks",
    actionable: true,
    relatedData: {
      competitorGrowth: "+15%",
      yourGrowth: "+3%",
      gap: "12%"
    }
  },
  {
    id: "3",
    type: "performance",
    title: "Content Performance Pattern",
    description: "Your video content generates 340% more engagement than static posts. Consider shifting content strategy.",
    priority: "high",
    confidence: 94,
    impact: "high",
    effort: "low",
    timeline: "Immediate",
    actionable: true,
    relatedData: {
      videoEngagement: "7.2%",
      staticEngagement: "2.1%",
      videoReach: "2.3x higher"
    }
  },
  {
    id: "4",
    type: "audience",
    title: "Audience Behavior Shift",
    description: "Your audience is 60% more active on weekday mornings. Optimal posting window: 8-10 AM, Tue-Thu.",
    priority: "medium",
    confidence: 89,
    impact: "medium",
    effort: "low",
    timeline: "Next week",
    actionable: true,
    relatedData: {
      optimalTimes: "8-10 AM",
      bestDays: "Tue-Thu",
      engagementLift: "+60%"
    }
  }
];

const mockRecommendations = [
  {
    id: "1",
    title: "Increase Video Content Production",
    description: "Based on performance data, video content should comprise 60% of your content mix",
    category: "Content Strategy",
    priority: "high",
    estimatedImpact: "+45% engagement",
    implementation: "2-3 weeks",
    resources: ["Video equipment", "Editing software", "Creative team"],
    steps: [
      "Audit current video content performance",
      "Develop video content calendar",
      "Create video production workflow",
      "Launch pilot video series"
    ]
  },
  {
    id: "2", 
    title: "Optimize Posting Schedule",
    description: "Shift 70% of posts to weekday mornings for maximum audience engagement",
    category: "Timing Optimization",
    priority: "medium",
    estimatedImpact: "+25% reach",
    implementation: "1 week",
    resources: ["Social media scheduler"],
    steps: [
      "Update content calendar",
      "Reschedule existing posts",
      "Monitor performance changes"
    ]
  },
  {
    id: "3",
    title: "Competitive Response Strategy",
    description: "Develop counter-narrative to competitor's recent campaign messaging",
    category: "Competitive Intelligence",
    priority: "high",
    estimatedImpact: "+20% share of voice",
    implementation: "3-4 weeks",
    resources: ["Marketing team", "PR agency", "Creative assets"],
    steps: [
      "Analyze competitor messaging",
      "Develop differentiation strategy",
      "Create response campaign",
      "Execute across channels"
    ]
  }
];

const getInsightIcon = (type: string) => {
  switch (type) {
    case "opportunity": return Lightbulb;
    case "threat": return AlertTriangle;
    case "performance": return BarChart3;
    case "audience": return Eye;
    default: return Brain;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case "opportunity": return "text-blue-500";
    case "threat": return "text-orange-500";
    case "performance": return "text-green-500";
    case "audience": return "text-purple-500";
    default: return "text-primary";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-500 text-white";
    case "medium": return "bg-yellow-500 text-black";
    case "low": return "bg-green-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

export default function Insights() {
  const [insights, setInsights] = useState(mockInsights);
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImplementRecommendation = (recommendationId: string) => {
    setLoading(true);
    const recommendation = recommendations.find(r => r.id === recommendationId);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Implementation Started",
        description: `Started implementing: ${recommendation?.title}`,
      });
    }, 1500);
  };

  const handleDismissInsight = (insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
    toast({
      title: "Insight Dismissed",
      description: "This insight has been marked as reviewed.",
    });
  };

  const generateNewInsights = () => {
    setLoading(true);
    toast({
      title: "Generating Insights",
      description: "AI is analyzing your latest data for new insights...",
    });
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Analysis Complete",
        description: "New insights have been generated based on latest data.",
      });
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">
            Data-driven insights and recommendations powered by AI analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateNewInsights} disabled={loading}>
            <Brain className="h-4 w-4 mr-2" />
            Generate New Insights
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Auto-Insights
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">Current Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Insights Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insights.length}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {insights.filter(i => i.priority === 'high').length}
                </div>
                <p className="text-xs text-muted-foreground">Need immediate action</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
                </div>
                <p className="text-xs text-muted-foreground">AI confidence level</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Actionable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {insights.filter(i => i.actionable).length}
                </div>
                <p className="text-xs text-muted-foreground">Ready to implement</p>
              </CardContent>
            </Card>
          </div>

          {/* Insights List */}
          <div className="space-y-4">
            {insights.map((insight) => {
              const InsightIcon = getInsightIcon(insight.type);
              
              return (
                <Card key={insight.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-muted ${getInsightColor(insight.type)}`}>
                          <InsightIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Badge className={getPriorityColor(insight.priority)}>
                              {insight.priority} priority
                            </Badge>
                            <Badge variant="outline">
                              {insight.confidence}% confidence
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {insight.timeline}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {insight.actionable && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{insight.description}</p>
                    
                    {/* Related Data */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      {Object.entries(insight.relatedData).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="font-semibold">{value}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Impact Indicators */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Impact</div>
                        <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                          {insight.impact}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Effort</div>
                        <Badge variant={insight.effort === 'low' ? 'default' : 'secondary'}>
                          {insight.effort}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Confidence</div>
                        <div className="flex items-center space-x-2">
                          <Progress value={insight.confidence} className="flex-1" />
                          <span className="text-sm">{insight.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" onClick={() => handleImplementRecommendation(insight.id)}>
                        Take Action
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDismissInsight(insight.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{recommendation.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{recommendation.category}</Badge>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {recommendation.estimatedImpact}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {recommendation.implementation}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{recommendation.description}</p>
                  
                  {/* Resources Needed */}
                  <div>
                    <h4 className="font-medium mb-2">Resources Needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.resources.map((resource, index) => (
                        <Badge key={index} variant="secondary">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Implementation Steps */}
                  <div>
                    <h4 className="font-medium mb-2">Implementation Steps:</h4>
                    <div className="space-y-2">
                      {recommendation.steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={() => handleImplementRecommendation(recommendation.id)}
                      disabled={loading}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Start Implementation
                    </Button>
                    <Button variant="outline">
                      Export Plan
                    </Button>
                    <Button variant="ghost">
                      Save for Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>
                Advanced trend analysis and pattern detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trend Analysis Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced trend analysis features are in development.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Forecasts</CardTitle>
              <CardDescription>
                AI-powered forecasting and predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Forecasting Coming Soon</h3>
                <p className="text-muted-foreground">
                  Predictive analytics and forecasting tools are being developed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
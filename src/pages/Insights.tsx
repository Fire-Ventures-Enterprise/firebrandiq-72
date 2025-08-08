import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const mockRecommendations = [
  {
    id: "1",
    title: "Improve Social Media Engagement",
    description: "Your Instagram engagement rate has dropped 12% this month. Consider posting more interactive content like polls and questions.",
    category: "Social Media",
    impact: "High",
    status: "pending",
    progress: 0
  },
  {
    id: "2",
    title: "Address Negative Review Sentiment",
    description: "Recent reviews on TechCrunch mention pricing concerns. Consider a competitive analysis of your pricing strategy.",
    category: "Brand Reputation",
    impact: "Medium", 
    status: "in-progress",
    progress: 65
  },
  {
    id: "3",
    title: "Optimize Content Marketing",
    description: "Your blog content generates 40% more engagement than social posts. Focus more resources on blog content creation.",
    category: "Content Strategy",
    impact: "High",
    status: "completed",
    progress: 100
  },
  {
    id: "4",
    title: "Expand LinkedIn Presence",
    description: "Your competitors have 3x more LinkedIn followers. Consider investing in LinkedIn advertising and thought leadership content.",
    category: "Social Media", 
    impact: "Medium",
    status: "pending",
    progress: 0
  }
];

const mockInsights = [
  {
    type: "trend",
    title: "Rising Mention Volume",
    content: "Brand mentions have increased 34% this week, primarily driven by your recent product launch announcement."
  },
  {
    type: "sentiment",
    title: "Improved Customer Sentiment", 
    content: "Overall sentiment score improved from 7.2 to 8.1 following your customer service improvements."
  },
  {
    type: "competitor",
    title: "Competitor Analysis",
    content: "Your main competitor launched a similar feature. Consider highlighting your unique advantages in upcoming marketing."
  }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'High': return 'bg-destructive text-destructive-foreground';
    case 'Medium': return 'bg-warning text-warning-foreground';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
    case 'in-progress': return <RefreshCw className="h-4 w-4 text-warning" />;
    default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function Insights() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">
            AI-powered recommendations and insights for your brand growth
          </p>
        </div>
        <Button>
          <Bot className="h-4 w-4 mr-2" />
          Generate New Insights
        </Button>
      </div>

      {/* Quick Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        {mockInsights.map((insight, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{insight.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>
            Actionable insights to improve your brand performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockRecommendations.map((rec) => (
            <div key={rec.id} className="space-y-4 pb-6 border-b last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(rec.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{rec.category}</Badge>
                  <Badge className={getImpactColor(rec.impact)}>
                    {rec.impact} Impact
                  </Badge>
                </div>
              </div>

              {rec.status !== 'pending' && (
                <div className="ml-7 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{rec.progress}%</span>
                  </div>
                  <Progress value={rec.progress} className="h-2" />
                </div>
              )}

              <div className="ml-7 flex gap-2">
                {rec.status === 'pending' && (
                  <Button size="sm">Start Implementation</Button>
                )}
                {rec.status === 'in-progress' && (
                  <Button size="sm" variant="outline">Update Progress</Button>
                )}
                {rec.status === 'completed' && (
                  <Button size="sm" variant="outline">View Results</Button>
                )}
                <Button size="sm" variant="ghost">Dismiss</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
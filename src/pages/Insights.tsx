import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Sparkles, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { AIService, AIRecommendation } from "@/services/aiService";
import RecommendationCard from "@/components/ai/RecommendationCard";
import SentimentChart from "@/components/analytics/SentimentChart";

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
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentimentData, setSentimentData] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [recs, aiInsights, sentiment] = await Promise.all([
        AIService.generateRecommendations({}),
        AIService.generateInsights({}),
        generateMockSentimentData()
      ]);
      
      setRecommendations(recs);
      setInsights(aiInsights);
      setSentimentData(sentiment);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSentimentData = () => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        positive: Math.round(40 + Math.random() * 20),
        negative: Math.round(10 + Math.random() * 15),
        neutral: Math.round(35 + Math.random() * 20),
        overall: 6.5 + Math.random() * 2.5
      });
    }
    return data;
  };

  const handleGenerateInsights = async () => {
    setLoading(true);
    const newInsights = await AIService.generateInsights({});
    setInsights(newInsights);
    setLoading(false);
  };

  const handleAcceptRecommendation = (id: string) => {
    console.log('Accepting recommendation:', id);
    // Implement recommendation acceptance logic
  };

  const handleDismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

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
        <div className="flex gap-2">
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            AI Analysis
          </Button>
          <Button onClick={handleGenerateInsights} disabled={loading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'New Insights'}
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        {insights.map((insight, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {insight.title}
                <Badge variant="outline" className="ml-auto">
                  {Math.round(insight.confidence * 100)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{insight.content}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge 
                  variant={insight.impact === 'positive' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {insight.impact}
                </Badge>
                <span className="text-xs text-muted-foreground">{insight.timeframe}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sentiment Analysis */}
      <SentimentChart 
        data={sentimentData}
        title="Brand Sentiment Analysis"
        timeframe="Last 30 days"
      />

      {/* AI Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">AI Recommendations</h2>
            <p className="text-muted-foreground">
              Personalized action items based on your brand data
            </p>
          </div>
          <Badge variant="outline" className="text-primary">
            {recommendations.length} Active
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAccept={handleAcceptRecommendation}
              onDismiss={handleDismissRecommendation}
              onViewDetails={(id) => console.log('View details:', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
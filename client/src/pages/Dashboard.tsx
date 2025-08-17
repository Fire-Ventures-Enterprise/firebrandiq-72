import { MessageSquare, Users, Heart, TrendingUp, Plus, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import MetricCard from "@/components/dashboard/MetricCard";
import SentimentChart from "@/components/dashboard/SentimentChart";
import BrandHealthScore from "@/components/dashboard/BrandHealthScore";
import AIInsights from "@/components/dashboard/AIInsights";
import EnhancedActivity from "@/components/dashboard/EnhancedActivity";
import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import QuickActionsEnhanced from "@/components/dashboard/QuickActionsEnhanced";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CrisisAlert from "@/components/dashboard/CrisisAlert";
import MentionsMap from "@/components/dashboard/MentionsMap";
import TrendingTopics from "@/components/dashboard/TrendingTopics";
import InfluencerMentions from "@/components/dashboard/InfluencerMentions";
import { SmartDashboard } from "@/components/psychology/SmartDashboard";

// Mock sparkline data
const generateSparklineData = () => 
  Array.from({ length: 30 }, (_, i) => ({ 
    day: i + 1, 
    value: Math.floor(Math.random() * 100) + 50 
  }));

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for psychology engine
  const mockInsights = [
    {
      id: '1',
      title: 'Sentiment Trend Alert',
      content: 'Brand sentiment has improved by 15% over the last week, driven by positive customer reviews and social media engagement.',
      type: 'sentiment_change',
      importance: 85,
      urgency: 'high',
      sentiment: 'positive',
      complexity: 'medium',
      dataPoints: [
        { label: 'Positive Mentions', value: '847' },
        { label: 'Sentiment Score', value: '72%' },
        { label: 'Engagement Rate', value: '4.2%' },
        { label: 'Reach', value: '2.4M' }
      ]
    },
    {
      id: '2',
      title: 'Competitor Analysis',
      content: 'Your main competitor launched a new campaign that is gaining traction. Consider developing a response strategy.',
      type: 'competitor_insight',
      importance: 70,
      urgency: 'medium',
      sentiment: 'neutral',
      complexity: 'high',
      dataPoints: [
        { label: 'Competitor Mentions', value: '432' },
        { label: 'Share of Voice', value: '28%' },
        { label: 'Engagement Gap', value: '-12%' }
      ]
    },
    {
      id: '3',
      title: 'Trending Topic Opportunity',
      content: 'There is a trending topic in your industry that aligns with your brand values. Consider joining the conversation.',
      type: 'trend_analysis',
      importance: 65,
      urgency: 'low',
      sentiment: 'positive',
      complexity: 'low'
    }
  ];

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    try {
      toast({
        title: "Action Started",
        description: `Executing ${action}...`,
      });
      
      // Simulate action delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (action) {
        case 'new-campaign':
          navigate('/campaigns');
          break;
        case 'generate-content':
          navigate('/content');
          break;
        case 'monitor-brand':
          navigate('/monitoring');
          break;
        case 'view-analytics':
          navigate('/analytics');
          break;
        default:
          toast({
            title: "Action Complete",
            description: `${action} has been completed successfully.`,
          });
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your brand today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => handleQuickAction('new-campaign')} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Psychology-Enhanced Dashboard */}
      <SmartDashboard 
        userId="current-user"
        rawInsights={mockInsights}
        className="mb-6"
      />

      {/* Crisis Alert */}
      <CrisisAlert
        severity="high"
        title="Negative Sentiment Spike Detected"
        description="Unusual increase in negative mentions about customer support response times."
        affectedMentions={15}
        timeDetected="23 minutes ago"
      />

      {/* Enhanced Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Brand Mentions"
          value="1,234"
          change={12.5}
          changeLabel="+142 from last month"
          icon={MessageSquare}
          sparklineData={generateSparklineData()}
          benchmark="Above industry avg"
        />
        <MetricCard
          title="Social Followers"
          value="45.2K"
          change={8.3}
          changeLabel="+3.1K new followers"
          icon={Users}
          sparklineData={generateSparklineData()}
          benchmark="Growing steadily"
        />
        <MetricCard
          title="Avg Sentiment"
          value="8.2/10"
          change={3.7}
          changeLabel="+0.3 improvement"
          icon={Heart}
          sparklineData={generateSparklineData()}
          benchmark="Excellent score"
        />
        <MetricCard
          title="Growth Score"
          value="92"
          change={5.4}
          changeLabel="+5 points this week"
          icon={TrendingUp}
          sparklineData={generateSparklineData()}
          benchmark="Top 10% brands"
        />
      </div>

      {/* Performance Overview */}
      <PerformanceOverview />

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Activity */}
        <div className="lg:col-span-2 space-y-6">
          <EnhancedActivity />
          <AIInsights />
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          <BrandHealthScore score={87} previousScore={82} />
          <SentimentChart />
          <QuickActionsEnhanced />
        </div>
      </div>

      {/* Additional Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MentionsMap />
        <TrendingTopics />
        <InfluencerMentions />
      </div>
    </div>
  );
}
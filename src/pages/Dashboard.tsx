import { MessageSquare, Users, Heart, TrendingUp } from "lucide-react";
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

// Mock sparkline data
const generateSparklineData = () => 
  Array.from({ length: 30 }, (_, i) => ({ 
    day: i + 1, 
    value: Math.floor(Math.random() * 100) + 50 
  }));

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

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
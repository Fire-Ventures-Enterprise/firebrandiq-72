import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  MessageSquare,
  Share2,
  ExternalLink,
  Filter,
  BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const mockCompetitors = [
  {
    id: "1",
    name: "CompetitorCorp",
    domain: "competitorcorp.com",
    industry: "Technology",
    mentions: 2856,
    sentiment: 7.8,
    shareOfVoice: 34.2,
    followers: 45600,
    engagement: 3.9,
    growth: "+12%",
    trending: "up",
    recentActivity: "Launched new product line",
    strengths: ["Strong social presence", "High engagement rates"],
    weaknesses: ["Limited content variety", "Slower response time"]
  },
  {
    id: "2", 
    name: "TechRival Solutions",
    domain: "techrival.com",
    industry: "Technology",
    mentions: 1923,
    sentiment: 6.9,
    shareOfVoice: 28.7,
    followers: 32100,
    engagement: 4.3,
    growth: "+8%",
    trending: "up",
    recentActivity: "Expanded to new markets",
    strengths: ["Innovative features", "Strong customer support"],
    weaknesses: ["Higher pricing", "Limited integrations"]
  },
  {
    id: "3",
    name: "InnovateTech",
    domain: "innovatetech.io",
    industry: "Technology", 
    mentions: 1456,
    sentiment: 8.2,
    shareOfVoice: 21.5,
    followers: 28900,
    engagement: 5.1,
    growth: "-3%",
    trending: "down",
    recentActivity: "CEO change announcement",
    strengths: ["Premium positioning", "Excellent reviews"],
    weaknesses: ["Slow feature updates", "Limited marketing"]
  }
];

const mockBenchmarks = [
  {
    metric: "Average Sentiment",
    yourBrand: 8.2,
    industry: 7.1,
    topCompetitor: 8.2,
    status: "tied"
  },
  {
    metric: "Share of Voice", 
    yourBrand: 15.6,
    industry: 18.3,
    topCompetitor: 34.2,
    status: "below"
  },
  {
    metric: "Engagement Rate",
    yourBrand: 4.2,
    industry: 4.5,
    topCompetitor: 5.1,
    status: "below"
  },
  {
    metric: "Follower Growth",
    yourBrand: 12,
    industry: 8.5,
    topCompetitor: 12,
    status: "above"
  }
];

const getTrendIcon = (trending: string) => {
  return trending === "up" ? TrendingUp : TrendingDown;
};

const getTrendColor = (trending: string) => {
  return trending === "up" ? "text-success" : "text-destructive";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "above": return "text-success";
    case "below": return "text-destructive";
    default: return "text-muted-foreground";
  }
};

export default function Competitors() {
  const [competitors, setCompetitors] = useState(mockCompetitors);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddCompetitor = () => {
    toast({
      title: "Add Competitor",
      description: "Competitor tracking feature coming soon!",
    });
  };

  const handleAnalyzeCompetitor = (competitorId: string) => {
    setLoading(true);
    const competitor = competitors.find(c => c.id === competitorId);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Analysis Complete",
        description: `Detailed analysis for ${competitor?.name} has been generated.`,
      });
    }, 2000);
  };

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    competitor.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Analysis</h1>
          <p className="text-muted-foreground">
            Track and analyze your competition across digital channels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleAddCompetitor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search & Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Search competitors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Discover
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Competitors Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompetitors.map((competitor) => {
              const TrendIcon = getTrendIcon(competitor.trending);
              
              return (
                <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{competitor.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span>{competitor.domain}</span>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{competitor.industry}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-semibold">{competitor.mentions}</div>
                        <div className="text-xs text-muted-foreground">Mentions</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-semibold">{competitor.sentiment}/10</div>
                        <div className="text-xs text-muted-foreground">Sentiment</div>
                      </div>
                    </div>

                    {/* Share of Voice */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Share of Voice</span>
                        <span className="font-medium">{competitor.shareOfVoice}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${competitor.shareOfVoice}%` }}
                        />
                      </div>
                    </div>

                    {/* Social Metrics */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{(competitor.followers / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{competitor.engagement}%</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${getTrendColor(competitor.trending)}`}>
                        <TrendIcon className="h-4 w-4" />
                        <span>{competitor.growth}</span>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Recent Activity</p>
                      <p className="text-sm font-medium">{competitor.recentActivity}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAnalyzeCompetitor(competitor.id)}
                        disabled={loading}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Analyze
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarks</CardTitle>
              <CardDescription>
                Compare your brand performance against competitors and industry averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockBenchmarks.map((benchmark, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{benchmark.metric}</h4>
                      <Badge className={getStatusColor(benchmark.status)}>
                        {benchmark.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <div className="font-semibold text-primary">{benchmark.yourBrand}</div>
                        <div className="text-muted-foreground">Your Brand</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold">{benchmark.industry}</div>
                        <div className="text-muted-foreground">Industry Avg</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-orange-700">{benchmark.topCompetitor}</div>
                        <div className="text-muted-foreground">Top Competitor</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance Analysis</CardTitle>
              <CardDescription>
                Analyze competitor content strategies and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Content Analysis Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced content analysis features will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Comparison</CardTitle>
              <CardDescription>
                Compare social media performance across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Share2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Social Analysis Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed social media comparison tools are in development.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
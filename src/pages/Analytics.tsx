import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Eye, MessageSquare, Heart, Share2, Download, Filter, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sentimentData = [
  { name: 'Jan', positive: 65, neutral: 25, negative: 10 },
  { name: 'Feb', positive: 70, neutral: 22, negative: 8 },
  { name: 'Mar', positive: 68, neutral: 24, negative: 8 },
  { name: 'Apr', positive: 72, neutral: 20, negative: 8 },
  { name: 'May', positive: 75, neutral: 18, negative: 7 },
  { name: 'Jun', positive: 73, neutral: 19, negative: 8 },
];

const mentionsData = [
  { name: 'Mon', mentions: 245 },
  { name: 'Tue', mentions: 190 },
  { name: 'Wed', mentions: 330 },
  { name: 'Thu', mentions: 280 },
  { name: 'Fri', mentions: 420 },
  { name: 'Sat', mentions: 180 },
  { name: 'Sun', mentions: 150 },
];

const competitorData = [
  { name: 'Your Brand', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Competitor A', value: 25, color: 'hsl(var(--destructive))' },
  { name: 'Competitor B', value: 20, color: 'hsl(var(--warning))' },
  { name: 'Others', value: 20, color: 'hsl(var(--muted-foreground))' },
];

const platformData = [
  { platform: 'Instagram', mentions: 1240, engagement: 4.2, sentiment: 85 },
  { platform: 'Twitter', mentions: 890, engagement: 3.8, sentiment: 72 },
  { platform: 'Facebook', mentions: 650, engagement: 5.1, sentiment: 78 },
  { platform: 'YouTube', mentions: 340, engagement: 6.2, sentiment: 88 },
  { platform: 'TikTok', mentions: 520, engagement: 7.3, sentiment: 91 },
];

export default function Analytics() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("7d");
  const [selectedBrand, setSelectedBrand] = useState("firebrand");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been updated with the latest information.",
      });
    }, 2000);
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive brand performance insights and competitor analysis
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DatePickerWithRange />
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firebrand">FirebrandIQ</SelectItem>
              <SelectItem value="competitor1">Competitor A</SelectItem>
              <SelectItem value="competitor2">Competitor B</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,642</div>
            <div className="flex items-center space-x-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <div className="flex items-center space-x-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+3.2% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <div className="flex items-center space-x-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+8.7% increase</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <div className="flex items-center space-x-1 text-xs text-destructive">
              <TrendingDown className="h-3 w-3" />
              <span>-1.2% decline</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sentiment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="mentions">Mention Trends</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Over Time</CardTitle>
                <CardDescription>Track sentiment changes across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sentimentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="positive" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success))" />
                      <Area type="monotone" dataKey="neutral" stackId="1" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" />
                      <Area type="monotone" dataKey="negative" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Sentiment Distribution</CardTitle>
                <CardDescription>Overall sentiment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Positive', value: 73, fill: 'hsl(var(--success))' },
                          { name: 'Neutral', value: 19, fill: 'hsl(var(--muted-foreground))' },
                          { name: 'Negative', value: 8, fill: 'hsl(var(--destructive))' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mentions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mention Volume Trends</CardTitle>
              <CardDescription>Daily mention volume across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mentionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mentions" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Share</CardTitle>
                <CardDescription>Share of voice comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={competitorData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {competitorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
                <CardDescription>Brand performance comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {competitorData.slice(0, 3).map((competitor, index) => (
                  <div key={competitor.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: competitor.color }} />
                      <span className="font-medium">{competitor.name}</span>
                      {index === 0 && <Badge variant="outline" className="text-success border-success">Leading</Badge>}
                    </div>
                    <span className="text-sm text-muted-foreground">{competitor.value}% share</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Detailed metrics across social platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform) => (
                  <div key={platform.platform} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{platform.platform}</div>
                      <div className="text-sm text-muted-foreground">Platform</div>
                    </div>
                    <div>
                      <div className="font-medium">{platform.mentions}</div>
                      <div className="text-sm text-muted-foreground">Mentions</div>
                    </div>
                    <div>
                      <div className="font-medium">{platform.engagement}%</div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </div>
                    <div>
                      <div className="font-medium">{platform.sentiment}%</div>
                      <div className="text-sm text-muted-foreground">Sentiment</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageSquare,
  Share,
  Eye,
  BarChart3,
  Calendar,
  RefreshCw,
  Target,
  Zap,
  Award,
  Clock,
  Filter
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface ChartData {
  date: string;
  followers: number;
  engagement: number;
  reach: number;
  posts: number;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function PerformanceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  // Mock data - in real app, this would come from your API
  const metricsData: MetricCard[] = [
    {
      title: 'Total Followers',
      value: '24.7K',
      change: 12.5,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Engagement Rate',
      value: '4.8%',
      change: -2.1,
      changeType: 'decrease',
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      title: 'Total Reach',
      value: '156K',
      change: 18.7,
      changeType: 'increase',
      icon: Eye,
      color: 'text-green-500'
    },
    {
      title: 'Posts Published',
      value: 47,
      change: 8.3,
      changeType: 'increase',
      icon: BarChart3,
      color: 'text-purple-500'
    }
  ];

  const chartData: ChartData[] = [
    { date: '2024-01-01', followers: 22000, engagement: 4.2, reach: 45000, posts: 8 },
    { date: '2024-01-02', followers: 22150, engagement: 4.5, reach: 48000, posts: 6 },
    { date: '2024-01-03', followers: 22300, engagement: 4.1, reach: 52000, posts: 9 },
    { date: '2024-01-04', followers: 22480, engagement: 4.8, reach: 58000, posts: 7 },
    { date: '2024-01-05', followers: 22650, engagement: 5.2, reach: 62000, posts: 10 },
    { date: '2024-01-06', followers: 23100, engagement: 4.9, reach: 65000, posts: 8 },
    { date: '2024-01-07', followers: 24700, engagement: 4.8, reach: 156000, posts: 12 }
  ];

  const platformData = [
    { name: 'Instagram', value: 45, color: '#e91e63' },
    { name: 'Twitter', value: 25, color: '#1da1f2' },
    { name: 'LinkedIn', value: 20, color: '#0077b5' },
    { name: 'Facebook', value: 10, color: '#4267b2' }
  ];

  const bestPerformingPosts = [
    {
      id: '1',
      content: '🚀 Exciting news! Our new AI features are now live. Transform your social media strategy...',
      platform: 'twitter',
      likes: 1247,
      comments: 89,
      shares: 156,
      reach: 12500,
      engagementRate: 12.1,
      publishedAt: '2024-01-06T10:30:00Z'
    },
    {
      id: '2',
      content: 'Behind the scenes: Our team working on revolutionary brand intelligence solutions 💡',
      platform: 'instagram',
      likes: 892,
      comments: 67,
      shares: 23,
      reach: 8900,
      engagementRate: 11.0,
      publishedAt: '2024-01-05T14:15:00Z'
    },
    {
      id: '3',
      content: 'The future of social media analytics is here. Discover insights that drive real results.',
      platform: 'linkedin',
      likes: 445,
      comments: 123,
      shares: 89,
      reach: 6700,
      engagementRate: 9.8,
      publishedAt: '2024-01-04T09:00:00Z'
    }
  ];

  const hourlyEngagement = [
    { hour: '00', engagement: 2.1 },
    { hour: '03', engagement: 1.8 },
    { hour: '06', engagement: 2.5 },
    { hour: '09', engagement: 4.2 },
    { hour: '12', engagement: 5.8 },
    { hour: '15', engagement: 4.9 },
    { hour: '18', engagement: 6.2 },
    { hour: '21', engagement: 5.1 }
  ];

  // Animation effect for metric values
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number) => {
      const startTimestamp = Date.now();
      
      const step = () => {
        const elapsed = Date.now() - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        
        return progress < 1 ? current : end;
      };
      
      return step;
    };

    // Simulate loading and animation
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Animate metric values
      metricsData.forEach((metric, index) => {
        let currentValue = 0;
        const targetValue = typeof metric.value === 'string' 
          ? parseFloat(metric.value.replace(/[^\d.]/g, ''))
          : metric.value;
        
        const animation = animateValue(0, targetValue, 1500);
        const interval = setInterval(() => {
          currentValue = animation();
          setAnimatedValues(prev => ({
            ...prev,
            [index]: currentValue
          }));
          
          if (currentValue >= targetValue) {
            clearInterval(interval);
          }
        }, 16);
      });
    }, 800);
  }, [selectedPeriod, selectedPlatform]);

  const formatValue = (value: string | number, animated: number, index: number): string => {
    if (typeof value === 'string') {
      const suffix = value.replace(/[\d.]/g, '');
      return animated.toFixed(suffix.includes('%') ? 1 : 0) + suffix;
    }
    return Math.floor(animated).toString();
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6" data-testid="performance-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">Real-time analytics and insights for your social media</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1D</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="90d">90D</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isLoading}
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          const animatedValue = animatedValues[index] || 0;
          const displayValue = isLoading ? '...' : formatValue(metric.value, animatedValue, index);
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold mt-2" data-testid={`metric-value-${index}`}>
                      {displayValue}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-slate-100 ${metric.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : metric.changeType === 'decrease' ? (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  ) : null}
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'increase' ? 'text-green-500' :
                    metric.changeType === 'decrease' ? 'text-red-500' :
                    'text-muted-foreground'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    vs last {selectedPeriod}
                  </span>
                </div>

                {/* Animated progress bar */}
                <Progress 
                  value={Math.abs(metric.change) * 5} 
                  className="h-1 mt-3"
                />
              </CardContent>
              
              {/* Animated background element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Growth Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Growth Analytics
            </CardTitle>
            <CardDescription>Track your social media growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date as string).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      name === 'followers' ? value.toLocaleString() : 
                      name === 'engagement' ? `${value}%` :
                      value.toLocaleString(),
                      name
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="followers"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="reach"
                    stackId="2"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Platform Distribution
            </CardTitle>
            <CardDescription>Engagement across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Engagement']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: platform.color }}
                    />
                    <span>{platform.name}</span>
                  </div>
                  <span className="font-medium">{platform.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Top Performing Posts
            </CardTitle>
            <CardDescription>Your most successful content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bestPerformingPosts.map((post, index) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm flex-1 mr-2">{post.content}</p>
                    <Badge variant="outline" className={`text-xs ${
                      post.platform === 'twitter' ? 'border-blue-400 text-blue-600' :
                      post.platform === 'instagram' ? 'border-pink-400 text-pink-600' :
                      'border-blue-600 text-blue-700'
                    }`}>
                      {post.platform}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {post.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {post.comments}
                    </div>
                    <div className="flex items-center">
                      <Share className="h-3 w-3 mr-1" />
                      {post.shares}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.reach.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="font-medium text-green-600">{post.engagementRate}% engagement</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimal Posting Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Optimal Posting Times
            </CardTitle>
            <CardDescription>When your audience is most active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyEngagement}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Engagement Rate']} />
                  <Bar 
                    dataKey="engagement" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">Best Time</span>
                <span className="text-sm text-green-600">6:00 PM - 8:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-700">Second Best</span>
                <span className="text-sm text-blue-600">12:00 PM - 2:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-orange-700">Avoid</span>
                <span className="text-sm text-orange-600">3:00 AM - 6:00 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Automated recommendations to boost your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📈 Growth Opportunity</h4>
              <p className="text-sm text-blue-700">
                Your engagement rate on Instagram is 23% higher on weekends. Consider posting more content Friday-Sunday.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">🎯 Content Strategy</h4>
              <p className="text-sm text-green-700">
                Posts with questions generate 45% more comments. Try ending posts with engaging questions.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">⏰ Timing Optimization</h4>
              <p className="text-sm text-purple-700">
                Posting at 6 PM gets 2.3x more engagement than your current average. Adjust your schedule.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
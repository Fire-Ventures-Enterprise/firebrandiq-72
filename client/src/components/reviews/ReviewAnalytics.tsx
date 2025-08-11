import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewPlatform } from "@/types/reviews";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface ReviewAnalyticsProps {
  platforms: ReviewPlatform[];
}

export function ReviewAnalytics({ platforms }: ReviewAnalyticsProps) {
  const chartData = platforms.map(platform => ({
    platform: platform.platform,
    reviews: platform.totalReviews,
    rating: platform.averageRating,
    target: platform.reviewGoals.targetCount,
    gap: platform.reviewGoals.currentGap
  }));

  const exposureData = platforms.map(platform => ({
    platform: platform.platform,
    level: platform.reviewGoals.exposureLevel,
    count: 1
  }));

  const exposureCounts = exposureData.reduce((acc, item) => {
    acc[item.level] = (acc[item.level] || 0) + item.count;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(exposureCounts).map(([level, count]) => ({
    name: level,
    value: count
  }));

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  // Mock trend data
  const trendData = [
    { month: 'Jan', reviews: 45, rating: 4.1 },
    { month: 'Feb', reviews: 52, rating: 4.2 },
    { month: 'Mar', reviews: 48, rating: 4.0 },
    { month: 'Apr', reviews: 61, rating: 4.3 },
    { month: 'May', reviews: 55, rating: 4.2 },
    { month: 'Jun', reviews: 64, rating: 4.4 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Review Trends</CardTitle>
          <CardDescription>Review count and rating trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[3.5, 5]} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="reviews" fill="hsl(var(--primary))" />
              <Line yAxisId="right" type="monotone" dataKey="rating" stroke="hsl(var(--destructive))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Comparison</CardTitle>
          <CardDescription>Reviews vs targets by platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reviews" fill="hsl(var(--primary))" name="Current Reviews" />
              <Bar dataKey="target" fill="hsl(var(--muted))" name="Target Reviews" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exposure Level Distribution</CardTitle>
          <CardDescription>Current exposure levels across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
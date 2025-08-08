import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar } from "lucide-react";

const monthlyData = [
  { month: 'Jan', current: 2400, previous: 2100 },
  { month: 'Feb', current: 2800, previous: 2400 },
  { month: 'Mar', current: 3200, previous: 2900 },
  { month: 'Apr', current: 3800, previous: 3200 },
  { month: 'May', current: 4200, previous: 3600 },
  { month: 'Jun', current: 4800, previous: 4100 }
];

const platformData = [
  { name: 'Instagram', value: 45, growth: 12 },
  { name: 'Twitter', value: 30, growth: 8 },
  { name: 'LinkedIn', value: 15, growth: 15 },
  { name: 'TikTok', value: 7, growth: 25 },
  { name: 'Other', value: 3, growth: -2 }
];

export default function PerformanceOverview() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            <p className="text-primary">Current: {payload[0]?.value?.toLocaleString()}</p>
            <p className="text-muted-foreground">Previous: {payload[1]?.value?.toLocaleString()}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Growth Trajectory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Growth Trajectory</span>
            <Badge variant="outline" className="text-success border-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.5%
            </Badge>
          </CardTitle>
          <CardDescription>Month-over-month comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stackId="1"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted-foreground))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stackId="2"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">4.8K</div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-muted-foreground">4.1K</div>
              <div className="text-xs text-muted-foreground">Last Month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Platform Breakdown</span>
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              Last 30 days
            </Badge>
          </CardTitle>
          <CardDescription>Mention distribution across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value}%`, 
                    name === 'value' ? 'Share' : name
                  ]}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 mt-4 pt-4 border-t">
            {platformData.map((platform, index) => (
              <div key={platform.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full bg-primary" 
                    style={{ opacity: 1 - (index * 0.15) }}
                  />
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{platform.value}%</span>
                  <Badge 
                    variant="outline" 
                    className={platform.growth > 0 ? 'text-success border-success' : 'text-destructive border-destructive'}
                  >
                    {platform.growth > 0 ? '+' : ''}{platform.growth}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
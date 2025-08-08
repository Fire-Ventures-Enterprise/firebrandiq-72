import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SentimentDataPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  overall: number;
}

interface SentimentChartProps {
  data: SentimentDataPoint[];
  title?: string;
  timeframe?: string;
}

const getSentimentTrend = (data: SentimentDataPoint[]) => {
  if (data.length < 2) return { direction: 'stable', change: 0 };
  
  const recent = data.slice(-7); // Last 7 data points
  const earlier = data.slice(-14, -7); // Previous 7 data points
  
  const recentAvg = recent.reduce((sum, d) => sum + d.overall, 0) / recent.length;
  const earlierAvg = earlier.reduce((sum, d) => sum + d.overall, 0) / earlier.length;
  
  const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;
  
  if (change > 5) return { direction: 'up', change };
  if (change < -5) return { direction: 'down', change };
  return { direction: 'stable', change };
};

const getTrendIcon = (direction: string) => {
  switch (direction) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
    default: return <Minus className="h-4 w-4 text-gray-600" />;
  }
};

const getTrendColor = (direction: string) => {
  switch (direction) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export default function SentimentChart({ 
  data, 
  title = "Sentiment Analysis", 
  timeframe = "Last 30 days" 
}: SentimentChartProps) {
  const trend = getSentimentTrend(data);
  const latestData = data[data.length - 1];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            <p className="text-green-600">Positive: {payload[0]?.value}%</p>
            <p className="text-red-600">Negative: {payload[1]?.value}%</p>
            <p className="text-gray-600">Neutral: {payload[2]?.value}%</p>
            <p className="font-medium border-t pt-1">Overall: {payload[3]?.value.toFixed(1)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              {getTrendIcon(trend.direction)}
            </CardTitle>
            <CardDescription>{timeframe}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {latestData?.overall.toFixed(1) || '0.0'}
            </div>
            <div className={`text-sm ${getTrendColor(trend.direction)}`}>
              {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Distribution */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-700">
              {latestData?.positive || 0}%
            </div>
            <div className="text-xs text-green-600">Positive</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-700">
              {latestData?.neutral || 0}%
            </div>
            <div className="text-xs text-gray-600">Neutral</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-semibold text-red-700">
              {latestData?.negative || 0}%
            </div>
            <div className="text-xs text-red-600">Negative</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="positive"
                stackId="1"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="neutral"
                stackId="1"
                stroke="#6b7280"
                fill="#6b7280"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="negative"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
              
              <Line
                type="monotone"
                dataKey="overall"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="space-y-2">
          <h4 className="font-medium">Key Insights</h4>
          <div className="space-y-2">
            {trend.direction === 'up' && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                📈 Sentiment improving by {Math.abs(trend.change).toFixed(1)}%
              </Badge>
            )}
            {trend.direction === 'down' && (
              <Badge variant="outline" className="text-red-600 border-red-600">
                📉 Sentiment declining by {Math.abs(trend.change).toFixed(1)}%
              </Badge>
            )}
            {trend.direction === 'stable' && (
              <Badge variant="outline" className="text-gray-600 border-gray-600">
                📊 Sentiment remains stable
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
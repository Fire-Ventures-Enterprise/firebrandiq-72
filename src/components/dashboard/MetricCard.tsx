import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineData {
  day: number;
  value: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  sparklineData: SparklineData[];
  benchmark?: string;
  lastUpdated?: string;
  isClickable?: boolean;
  onClick?: () => void;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  sparklineData,
  benchmark,
  lastUpdated = "2 min ago",
  isClickable = true,
  onClick
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-success" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card 
      className={`transition-all duration-200 ${isClickable ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : ''} border-l-4 border-l-primary/20`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <span className={getTrendColor()}>{changeLabel}</span>
        </div>

        {/* Sparkline Chart */}
        <div className="h-12 -mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Updated {lastUpdated}</span>
          {benchmark && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              {benchmark}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
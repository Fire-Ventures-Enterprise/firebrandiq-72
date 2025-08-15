import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Target, Eye, Mail } from "lucide-react";
import type { ClientPerformanceMetrics } from "@/types/agency";

interface ClientMetricsCardProps {
  metric: ClientPerformanceMetrics;
}

export const ClientMetricsCard: React.FC<ClientMetricsCardProps> = ({ metric }) => {
  const { client, analytics } = metric;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceBadge = (roi: number) => {
    if (roi > 15) return <Badge variant="secondary" className="bg-green-100 text-green-800">High Performer</Badge>;
    if (roi > 8) return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Good</Badge>;
    if (roi > 3) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge variant="secondary" className="bg-red-100 text-red-800">Needs Attention</Badge>;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{client.name}</CardTitle>
            {client.companyName && (
              <p className="text-sm text-muted-foreground">{client.companyName}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`}></div>
            <span className="text-xs text-muted-foreground capitalize">{client.status}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          {getPerformanceBadge(analytics.avg_roi)}
          {client.industry && (
            <Badge variant="outline">{client.industry}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <p className="text-sm font-semibold">${analytics.total_revenue.toLocaleString()}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Leads</span>
            </div>
            <p className="text-sm font-semibold">{analytics.total_leads.toLocaleString()}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">ROI</span>
            </div>
            <p className="text-sm font-semibold">{analytics.avg_roi.toFixed(1)}%</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              {analytics.monthly_growth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className="text-xs text-muted-foreground">Growth</span>
            </div>
            <p className={`text-sm font-semibold ${analytics.monthly_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.monthly_growth >= 0 ? '+' : ''}{analytics.monthly_growth.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Budget Info */}
        {client.monthlyBudget && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Monthly Budget</span>
              <span className="text-sm font-medium">${client.monthlyBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-muted-foreground">Spend</span>
              <span className="text-sm">${analytics.total_ad_spend.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Mail className="w-3 h-3 mr-1" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
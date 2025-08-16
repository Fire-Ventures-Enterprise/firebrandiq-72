import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangleIcon,
  TrendingUpIcon,
  UsersIcon,
  MessageSquareIcon,
  ZapIcon,
  CheckCircleIcon,
  XIcon
} from 'lucide-react';
import { SocialMetricsService, type SocialAlert } from '@/services/socialMetricsService';

const severityConfig = {
  low: { color: 'bg-blue-500', textColor: 'text-blue-700', icon: CheckCircleIcon },
  medium: { color: 'bg-yellow-500', textColor: 'text-yellow-700', icon: TrendingUpIcon },
  high: { color: 'bg-orange-500', textColor: 'text-orange-700', icon: AlertTriangleIcon },
  critical: { color: 'bg-red-500', textColor: 'text-red-700', icon: AlertTriangleIcon }
};

const platformColors = {
  Instagram: 'text-pink-600',
  Twitter: 'text-blue-600',
  LinkedIn: 'text-blue-700',
  Facebook: 'text-blue-800'
};

export function SocialMediaAlerts() {
  const [alerts, setAlerts] = useState<SocialAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const alertsData = await SocialMetricsService.getAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load social media alerts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAction = (alert: SocialAlert) => {
    toast({
      title: "Action Started",
      description: `Taking action on ${alert.title}...`,
    });
    
    // Navigate to relevant page based on alert type
    switch (alert.type) {
      case 'milestone':
        navigate('/social?tab=analytics');
        break;
      case 'trending':
        navigate('/social?tab=performance');
        break;
      case 'mention':
        navigate('/mentions');
        break;
      case 'crisis':
        navigate('/monitoring');
        break;
      default:
        navigate('/social');
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...Array.from(prev), alertId]));
    toast({
      title: "Alert Dismissed",
      description: "Alert has been dismissed",
    });
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading alerts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (visibleAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ZapIcon className="h-5 w-5" />
            Social Media Alerts
          </CardTitle>
          <CardDescription>Real-time notifications about your social media performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No active alerts. Your social media accounts are performing well!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ZapIcon className="h-5 w-5" />
          Social Media Alerts
        </CardTitle>
        <CardDescription>Real-time notifications about your social media performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleAlerts.map(alert => {
          const severityInfo = severityConfig[alert.severity];
          const SeverityIcon = severityInfo.icon;
          const timeAgo = new Date(Date.now() - alert.timestamp.getTime()).getMinutes();
          
          return (
            <div
              key={alert.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={severityInfo.textColor}>
                    {alert.severity}
                  </Badge>
                  <span className={`text-sm font-medium ${platformColors[alert.platform as keyof typeof platformColors] || 'text-gray-600'}`}>
                    {alert.platform}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {timeAgo < 60 ? `${timeAgo} minutes ago` : 'Recently'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {alert.actionRequired && (
                      <Button
                        size="sm"
                        onClick={() => handleTakeAction(alert)}
                        className="h-8"
                      >
                        Take Action
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissAlert(alert.id)}
                      className="h-8 w-8 p-0"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
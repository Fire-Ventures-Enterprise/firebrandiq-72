import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, Bell, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CrisisAlertProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedMentions: number;
  timeDetected: string;
  onDismiss?: () => void;
  onViewDetails?: () => void;
}

export default function CrisisAlert({
  severity = 'high',
  title = 'Negative Sentiment Spike Detected',
  description = 'Unusual increase in negative mentions about customer support response times. 15 mentions in the last hour.',
  affectedMentions = 15,
  timeDetected = '23 minutes ago',
  onDismiss,
  onViewDetails
}: CrisisAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isVisible) return null;

  const handleNotifyTeam = () => {
    toast({
      title: "Team Notified",
      description: "Alert sent to all team members about this crisis",
    });
  };

  const handleViewDetails = () => {
    navigate('/mentions');
    toast({
      title: "Crisis Analysis",
      description: "Viewing detailed mention analysis",
    });
  };

  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-destructive/10 border-destructive',
          textColor: 'text-destructive',
          badgeColor: 'bg-destructive text-destructive-foreground',
          icon: <AlertTriangle className="h-5 w-5" />
        };
      case 'high':
        return {
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-700',
          badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
          icon: <AlertTriangle className="h-5 w-5" />
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-700',
          badgeColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <Bell className="h-5 w-5" />
        };
      default:
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Bell className="h-5 w-5" />
        };
    }
  };

  const config = getSeverityConfig();

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <Card className={`border-l-4 ${config.bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={config.textColor}>
              {config.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-base flex items-center space-x-2">
                <span className={config.textColor}>{title}</span>
                <Badge className={config.badgeColor}>
                  {severity.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                Detected {timeDetected} • {affectedMentions} mentions affected
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Sentiment Score:</span> -2.3 (↓15%)
            </div>
            <div>
              <span className="font-medium">Trend:</span> Worsening
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleNotifyTeam}>
              Notify Team
            </Button>
            <Button 
              size="sm" 
              onClick={handleViewDetails}
              className={severity === 'critical' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              View Details
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
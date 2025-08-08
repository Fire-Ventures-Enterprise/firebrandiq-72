import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  FileDown, 
  Calendar, 
  Bell, 
  Users, 
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface SyncStatus {
  platform: string;
  status: 'synced' | 'syncing' | 'error';
  lastSync: string;
  progress?: number;
}

const syncStatuses: SyncStatus[] = [
  { platform: 'Twitter', status: 'synced', lastSync: '2 min ago' },
  { platform: 'Instagram', status: 'syncing', lastSync: '5 min ago', progress: 65 },
  { platform: 'LinkedIn', status: 'synced', lastSync: '1 min ago' },
  { platform: 'TikTok', status: 'error', lastSync: '15 min ago' }
];

export default function QuickActionsEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddBrand = () => {
    navigate('/brands');
    toast({
      title: "Navigate to Brands",
      description: "Add a new brand to monitor",
    });
  };

  const handleExportDashboard = () => {
    toast({
      title: "Exporting Dashboard",
      description: "Your dashboard data is being exported...",
    });
    // Simulate export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Dashboard data exported successfully",
      });
    }, 2000);
  };

  const handleScheduleContent = () => {
    navigate('/content/generator');
    toast({
      title: "Content Scheduler",
      description: "Create and schedule new content",
    });
  };

  const handleSetAlert = () => {
    toast({
      title: "Alert Settings",
      description: "Configure your monitoring alerts",
    });
  };

  const handleAddCompetitor = () => {
    navigate('/competitors');
    toast({
      title: "Competitor Analysis",
      description: "Add competitors to track",
    });
  };

  const handleRefreshSync = () => {
    toast({
      title: "Refreshing Data",
      description: "Syncing latest data from all platforms...",
    });
    // Simulate refresh functionality
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "All platforms updated successfully",
      });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="h-3 w-3 text-success" />;
      case 'syncing': return <Clock className="h-3 w-3 text-warning" />;
      case 'error': return <AlertCircle className="h-3 w-3 text-destructive" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-success';
      case 'syncing': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Fast access to common tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full justify-start" variant="outline" onClick={handleAddBrand}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Brand
          </Button>
          
          <Button className="w-full justify-start" variant="outline" onClick={handleExportDashboard}>
            <FileDown className="h-4 w-4 mr-2" />
            Export Dashboard
          </Button>
          
          <Button className="w-full justify-start" variant="outline" onClick={handleScheduleContent}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Content
          </Button>
          
          <Button className="w-full justify-start" variant="outline" onClick={handleSetAlert}>
            <Bell className="h-4 w-4 mr-2" />
            Set Alert
          </Button>
          
          <Button className="w-full justify-start" variant="outline" onClick={handleAddCompetitor}>
            <Users className="h-4 w-4 mr-2" />
            Add Competitor
          </Button>
        </div>

        {/* Sync Status */}
        <div className="pt-4 border-t space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Platform Sync Status</h4>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleRefreshSync}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {syncStatuses.map((sync) => (
              <div key={sync.platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(sync.status)}
                  <span className="text-sm font-medium">{sync.platform}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {sync.status === 'syncing' && sync.progress && (
                    <div className="w-12">
                      <Progress value={sync.progress} className="h-1" />
                    </div>
                  )}
                  <span className={`text-xs ${getStatusColor(sync.status)}`}>
                    {sync.lastSync}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <Badge variant="outline" className="w-full justify-center text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            All platforms monitored
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
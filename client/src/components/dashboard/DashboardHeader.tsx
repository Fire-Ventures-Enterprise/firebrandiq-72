import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  RefreshCw, 
  Plus, 
  Search, 
  Calendar,
  Filter,
  Download
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });

  const handleRefresh = () => {
    toast({
      title: "Refreshing Dashboard",
      description: "Loading latest data...",
    });
    // Simulate refresh
    setTimeout(() => {
      toast({
        title: "Dashboard Updated",
        description: "All data has been refreshed successfully",
      });
    }, 2000);
  };

  const handleNewBrand = () => {
    navigate('/brands');
    toast({
      title: "Create New Brand",
      description: "Set up a new brand to monitor",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Preparing your dashboard export...",
    });
    // Simulate export
    setTimeout(() => {
      toast({
        title: "Export Ready",
        description: "Your data has been exported successfully",
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your brand performance overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleNewBrand}>
            <Plus className="h-4 w-4 mr-2" />
            New Brand
          </Button>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="flex items-center justify-between gap-4 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mentions, competitors..."
              className="pl-10"
            />
          </div>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Filters */}
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-success border-success">
            All systems operational
          </Badge>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
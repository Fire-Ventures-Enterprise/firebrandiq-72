import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, DollarSign, Target, Filter, Plus, Mail, BarChart3 } from "lucide-react";
import { AgencyService } from "@/services/agencyService";
import type { ClientPerformanceMetrics, FilterOptions } from "@/types/agency";
import { ClientMetricsCard } from "./ClientMetricsCard";
import { ClientListView } from "./ClientListView";
import { TeamManagement } from "./TeamManagement";
import { EmailCampaignManager } from "./EmailCampaignManager";

export const AgencyDashboard: React.FC = () => {
  const [clientMetrics, setClientMetrics] = useState<ClientPerformanceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'revenue',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    loadClientMetrics();
  }, [filters]);

  const loadClientMetrics = async () => {
    try {
      setLoading(true);
      const data = await AgencyService.getClientPerformanceMetrics(filters);
      setClientMetrics(data);
    } catch (error) {
      console.error('Failed to load client metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clientMetrics.filter(metric =>
    metric.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.client.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = clientMetrics.reduce((sum, metric) => sum + metric.analytics.total_revenue, 0);
  const totalLeads = clientMetrics.reduce((sum, metric) => sum + metric.analytics.total_leads, 0);
  const avgROI = clientMetrics.length > 0 
    ? clientMetrics.reduce((sum, metric) => sum + metric.analytics.avg_roi, 0) / clientMetrics.length 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agency Dashboard</h1>
          <p className="text-muted-foreground">Manage all your clients and campaigns from one place</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientMetrics.length}</div>
            <p className="text-xs text-muted-foreground">
              {clientMetrics.filter(m => m.client.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgROI.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all clients
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="md:max-w-xs"
                />
                
                <Select value={filters.status || ''} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, status: value || undefined }))
                }>
                  <SelectTrigger className="md:max-w-xs">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.performance || ''} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, performance: value as any || undefined }))
                }>
                  <SelectTrigger className="md:max-w-xs">
                    <SelectValue placeholder="Filter by performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Performance</SelectItem>
                    <SelectItem value="best">Top Performers</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="needs_attention">Needs Attention</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.sortBy || 'revenue'} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, sortBy: value as any }))
                }>
                  <SelectTrigger className="md:max-w-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="roi">ROI</SelectItem>
                    <SelectItem value="leads">Leads</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Client Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredClients.length > 0 ? (
              filteredClients.map((metric) => (
                <ClientMetricsCard key={metric.client.id} metric={metric} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No clients found matching your criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <ClientListView />
        </TabsContent>

        <TabsContent value="team">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="campaigns">
          <EmailCampaignManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
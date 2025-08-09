import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCampaign, ReviewRequest } from "@/types/reviews";
import { Play, Pause, MoreHorizontal, Users, Send, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockCampaigns: ReviewCampaign[] = [
  {
    id: '1',
    name: 'Holiday 2024 Campaign',
    brandId: 'brand-1',
    platforms: ['google', 'yelp'],
    totalCustomers: 150,
    requestsSent: 120,
    reviewsReceived: 35,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    customMessage: 'We hope you had a wonderful holiday experience with us!'
  },
  {
    id: '2',
    name: 'New Customer Onboarding',
    brandId: 'brand-1',
    platforms: ['google', 'facebook'],
    totalCustomers: 85,
    requestsSent: 85,
    reviewsReceived: 22,
    status: 'completed',
    createdAt: new Date('2024-01-10'),
  }
];

const mockRequests: ReviewRequest[] = [
  {
    id: '1',
    brandId: 'brand-1',
    customerEmail: 'john@example.com',
    customerName: 'John Smith',
    platform: 'google',
    status: 'completed',
    sentDate: new Date('2024-01-16'),
    completedDate: new Date('2024-01-18'),
    reviewUrl: 'https://google.com/review/1',
    campaignId: '1'
  },
  {
    id: '2',
    brandId: 'brand-1',
    customerEmail: 'sarah@example.com',
    customerName: 'Sarah Johnson',
    platform: 'yelp',
    status: 'sent',
    sentDate: new Date('2024-01-17'),
    reviewUrl: 'https://yelp.com/review/2',
    campaignId: '1'
  }
];

export function CampaignDashboard() {
  const [campaigns] = useState<ReviewCampaign[]>(mockCampaigns);
  const [requests] = useState<ReviewRequest[]>(mockRequests);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const { toast } = useToast();

  const handleManageCampaign = (campaignId: string) => {
    toast({
      title: "Campaign Management",
      description: "Opening campaign management interface...",
    });
  };

  const handleCampaignOptions = (campaignId: string) => {
    toast({
      title: "Campaign Options",
      description: "Opening campaign settings and options...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRequestStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredRequests = selectedCampaign 
    ? requests.filter(r => r.campaignId === selectedCampaign)
    : requests;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="requests">All Requests</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const completionRate = (campaign.reviewsReceived / campaign.requestsSent) * 100;
              const sentRate = (campaign.requestsSent / campaign.totalCustomers) * 100;
              
              return (
                <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedCampaign(campaign.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Created {campaign.createdAt.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{campaign.totalCustomers}</p>
                        <p className="text-xs text-muted-foreground">Customers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{campaign.requestsSent}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{campaign.reviewsReceived}</p>
                        <p className="text-xs text-muted-foreground">Reviews</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Sent Progress</span>
                        <span>{sentRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={sentRate} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Conversion Rate</span>
                        <span>{completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleManageCampaign(campaign.id)}>
                        <Play className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCampaignOptions(campaign.id)}>
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Requests</CardTitle>
              <CardDescription>
                Track individual review request status and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getRequestStatusIcon(request.status)}
                      <div>
                        <p className="font-medium">{request.customerName}</p>
                        <p className="text-sm text-muted-foreground">{request.customerEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {request.platform}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      {request.sentDate && (
                        <span className="text-xs text-muted-foreground">
                          {request.sentDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.length}</div>
                <p className="text-xs text-muted-foreground">Active campaigns</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Requests Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.requestsSent, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total sent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reviews Received</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.reviewsReceived, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(() => {
                    const totalSent = campaigns.reduce((sum, c) => sum + c.requestsSent, 0);
                    const totalReceived = campaigns.reduce((sum, c) => sum + c.reviewsReceived, 0);
                    return totalSent > 0 ? ((totalReceived / totalSent) * 100).toFixed(1) : '0';
                  })()}%
                </div>
                <p className="text-xs text-muted-foreground">Response rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
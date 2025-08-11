import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Plus, Send, Edit, Trash2, Users, Calendar } from "lucide-react";
import { AgencyService } from "@/services/agencyService";
import type { EmailCampaign, Client } from "@/types/agency";
import { useToast } from "@/hooks/use-toast";

export const EmailCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    content: '',
    is_bulk: false,
    client_ids: [] as string[],
    scheduled_at: '',
    status: 'draft' as const,
    metrics: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campaignsData, clientsData] = await Promise.all([
        AgencyService.getEmailCampaigns(),
        AgencyService.getClients()
      ]);
      setCampaigns(campaignsData);
      setClients(clientsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await AgencyService.createEmailCampaign(campaignForm);
      toast({
        title: "Success",
        description: "Email campaign created successfully"
      });
      
      setShowCreateDialog(false);
      setCampaignForm({
        name: '',
        subject: '',
        content: '',
        is_bulk: false,
        client_ids: [],
        scheduled_at: '',
        status: 'draft' as const,
        metrics: {}
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;

    try {
      await AgencyService.sendBulkEmail(campaignId);
      toast({
        title: "Success",
        description: "Campaign sent successfully"
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send campaign",
        variant: "destructive"
      });
    }
  };

  const handleClientSelection = (clientId: string, checked: boolean) => {
    setCampaignForm(prev => ({
      ...prev,
      client_ids: checked 
        ? [...prev.client_ids, clientId]
        : prev.client_ids.filter(id => id !== clientId)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSelectedClientsText = () => {
    if (campaignForm.is_bulk) {
      return campaignForm.client_ids.length === 0 ? 'All clients' : `${campaignForm.client_ids.length} selected clients`;
    }
    return `${campaignForm.client_ids.length} selected clients`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Email Campaigns</CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Email Campaign</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Email Subject *</Label>
                    <Input
                      id="subject"
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Email Content *</Label>
                    <Textarea
                      id="content"
                      value={campaignForm.content}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, content: e.target.value }))}
                      rows={8}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_bulk"
                      checked={campaignForm.is_bulk}
                      onCheckedChange={(checked) => setCampaignForm(prev => ({ 
                        ...prev, 
                        is_bulk: checked,
                        client_ids: checked ? [] : prev.client_ids
                      }))}
                    />
                    <Label htmlFor="is_bulk">Send to all clients (bulk campaign)</Label>
                  </div>

                  {!campaignForm.is_bulk && (
                    <div className="space-y-2">
                      <Label>Select Clients ({getSelectedClientsText()})</Label>
                      <div className="max-h-40 overflow-y-auto border rounded-md p-3 space-y-2">
                        {clients.map((client) => (
                          <div key={client.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`client-${client.id}`}
                              checked={campaignForm.client_ids.includes(client.id)}
                              onCheckedChange={(checked) => handleClientSelection(client.id, checked as boolean)}
                            />
                            <Label htmlFor={`client-${client.id}`} className="flex-1">
                              {client.name} {client.company_name && `(${client.company_name})`}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="scheduled_at">Schedule Send (optional)</Label>
                    <Input
                      id="scheduled_at"
                      type="datetime-local"
                      value={campaignForm.scheduled_at}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">Create Campaign</Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <div className="h-12 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {campaign.is_bulk ? 'Bulk' : 'Targeted'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          {campaign.is_bulk 
                            ? 'All clients' 
                            : `${campaign.client_ids?.length || 0} clients`
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {campaign.status === 'draft' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendCampaign(campaign.id)}
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          {campaign.status === 'draft' && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No email campaigns found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
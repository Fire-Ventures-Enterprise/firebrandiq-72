import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { createReviewCampaign, bulkSendRequests } from "@/services/reviewCampaignService";
import { Upload, Send, Users, Target, CheckCircle, AlertCircle } from "lucide-react";

interface CampaignBuilderProps {
  onClose: () => void;
  onCampaignCreated?: (campaign: any) => void;
}

export function CampaignBuilder({ onClose, onCampaignCreated }: CampaignBuilderProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const [campaignData, setCampaignData] = useState({
    name: '',
    platforms: [] as string[],
    customMessage: '',
    customers: [] as Array<{email: string, name: string}>
  });

  const [sendResults, setSendResults] = useState<{
    sent: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const platforms = [
    { id: 'google', name: 'Google Business', icon: '🌐' },
    { id: 'yelp', name: 'Yelp', icon: '🍽️' },
    { id: 'facebook', name: 'Facebook', icon: '📘' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setCampaignData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleCustomerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').slice(1); // Skip header
        const customers = lines
          .filter(line => line.trim())
          .map(line => {
            const [name, email] = line.split(',').map(s => s.trim());
            return { name, email };
          })
          .filter(customer => customer.name && customer.email);
        
        setCampaignData(prev => ({ ...prev, customers }));
      };
      reader.readAsText(file);
    }
  };

  const addCustomerManually = () => {
    setCampaignData(prev => ({
      ...prev,
      customers: [...prev.customers, { name: '', email: '' }]
    }));
  };

  const updateCustomer = (index: number, field: 'name' | 'email', value: string) => {
    setCampaignData(prev => ({
      ...prev,
      customers: prev.customers.map((customer, i) => 
        i === index ? { ...customer, [field]: value } : customer
      )
    }));
  };

  const removeCustomer = (index: number) => {
    setCampaignData(prev => ({
      ...prev,
      customers: prev.customers.filter((_, i) => i !== index)
    }));
  };

  const createAndSendCampaign = async () => {
    if (!campaignData.name || campaignData.platforms.length === 0 || campaignData.customers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { campaign, requests } = await createReviewCampaign(
        'default-brand', // In real app, get from context
        campaignData.name,
        campaignData.customers,
        campaignData.platforms,
        campaignData.customMessage
      );

      // Send all requests
      const results = await bulkSendRequests(campaign.id, requests);
      setSendResults(results);
      setStep(4);
      
      if (onCampaignCreated) {
        onCampaignCreated(campaign);
      }

      toast({
        title: "Campaign Created!",
        description: `Sent ${results.sent} review requests successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={campaignData.name}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Holiday 2024 Review Campaign"
              />
            </div>
            
            <div>
              <Label>Select Platforms</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={campaignData.platforms.includes(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <Label htmlFor={platform.id} className="flex items-center gap-2">
                      <span>{platform.icon}</span>
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="customMessage">Custom Message (Optional)</Label>
              <Textarea
                id="customMessage"
                value={campaignData.customMessage}
                onChange={(e) => setCampaignData(prev => ({ ...prev, customMessage: e.target.value }))}
                placeholder="Add a personal touch to your review requests..."
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Upload Customer List</Label>
              <div className="mt-2 space-y-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleCustomerUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Upload a CSV file with columns: Name, Email
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Customer List ({campaignData.customers.length})</Label>
                <Button variant="outline" size="sm" onClick={addCustomerManually}>
                  Add Manually
                </Button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {campaignData.customers.map((customer, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Name"
                      value={customer.name}
                      onChange={(e) => updateCustomer(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={customer.email}
                      onChange={(e) => updateCustomer(index, 'email', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomer(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Review Campaign Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign:</span>
                    <span className="font-medium">{campaignData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platforms:</span>
                    <span className="font-medium">{campaignData.platforms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customers:</span>
                    <span className="font-medium">{campaignData.customers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Requests:</span>
                    <span className="font-medium">{campaignData.customers.length * campaignData.platforms.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground text-xs">Selected Platforms:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaignData.platforms.map(platformId => {
                        const platform = platforms.find(p => p.id === platformId);
                        return (
                          <Badge key={platformId} variant="secondary" className="text-xs">
                            {platform?.icon} {platform?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Campaign Launched Successfully!</h3>
              {sendResults && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sent:</span>
                      <span className="font-medium text-green-600">{sendResults.sent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Failed:</span>
                      <span className="font-medium text-red-600">{sendResults.failed}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Your review requests have been sent to customers. You can track responses in the campaign dashboard.
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create Review Campaign
          </DialogTitle>
          <DialogDescription>
            Build and launch automated review request campaigns
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center space-x-2 mb-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && <div className="w-8 h-0.5 bg-muted" />}
            </div>
          ))}
        </div>

        <div className="min-h-[300px]">
          {renderStep()}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            disabled={isProcessing}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {step < 3 && (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!campaignData.name || campaignData.platforms.length === 0)) ||
                (step === 2 && campaignData.customers.length === 0)
              }
            >
              Next
            </Button>
          )}
          
          {step === 3 && (
            <Button onClick={createAndSendCampaign} disabled={isProcessing}>
              {isProcessing ? 'Launching...' : 'Launch Campaign'}
            </Button>
          )}
          
          {step === 4 && (
            <Button onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
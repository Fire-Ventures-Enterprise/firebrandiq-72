import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Globe,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Key,
  User,
  Settings,
  Zap,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface ConnectionStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const platformConfigs = {
  twitter: {
    name: 'Twitter/X',
    icon: Twitter,
    color: 'text-blue-400',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    steps: [
      { id: 'setup', title: 'Developer Setup', description: 'Create Twitter Developer Account', icon: Settings },
      { id: 'credentials', title: 'Get API Keys', description: 'Obtain API credentials from Twitter', icon: Key },
      { id: 'permissions', title: 'Set Permissions', description: 'Configure read/write permissions', icon: Settings },
      { id: 'test', title: 'Test Connection', description: 'Verify your API connection', icon: CheckCircle }
    ],
    instructions: {
      setup: "1. Visit https://developer.twitter.com\n2. Apply for a developer account\n3. Create a new app in the dashboard",
      credentials: "1. Navigate to your app settings\n2. Go to 'Keys and Tokens' tab\n3. Generate API Key, Secret, Access Token, and Access Token Secret",
      permissions: "1. In app settings, go to 'App permissions'\n2. Set to 'Read and Write'\n3. Enable 'Direct message' if needed",
      test: "We'll test your connection automatically once you provide the credentials"
    }
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    steps: [
      { id: 'setup', title: 'Meta Developer Setup', description: 'Create Meta for Developers account', icon: Settings },
      { id: 'credentials', title: 'Get App Credentials', description: 'Create Instagram Basic Display app', icon: Key },
      { id: 'permissions', title: 'Configure Permissions', description: 'Set up required permissions', icon: Settings },
      { id: 'test', title: 'Test Connection', description: 'Verify Instagram API access', icon: CheckCircle }
    ],
    instructions: {
      setup: "1. Visit https://developers.facebook.com\n2. Create a developer account\n3. Create a new app and select 'Consumer' type",
      credentials: "1. Add Instagram Basic Display product\n2. Go to Instagram Basic Display > Basic Display\n3. Copy App ID and App Secret",
      permissions: "1. Add 'instagram_graph_user_profile' permission\n2. Add 'instagram_graph_user_media' permission\n3. Complete app review if needed",
      test: "We'll guide you through the OAuth flow to test the connection"
    }
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    steps: [
      { id: 'setup', title: 'LinkedIn App Setup', description: 'Create LinkedIn application', icon: Settings },
      { id: 'credentials', title: 'Get Client Credentials', description: 'Obtain Client ID and Secret', icon: Key },
      { id: 'permissions', title: 'Request Permissions', description: 'Apply for required API permissions', icon: Settings },
      { id: 'test', title: 'Test Connection', description: 'Verify LinkedIn API access', icon: CheckCircle }
    ],
    instructions: {
      setup: "1. Visit https://developer.linkedin.com\n2. Create an application\n3. Fill in required company and app details",
      credentials: "1. Go to 'Auth' tab in your app\n2. Copy Client ID and Client Secret\n3. Add redirect URL: https://your-domain.com/auth/linkedin",
      permissions: "1. Request 'r_liteprofile' permission\n2. Request 'w_member_social' for posting\n3. Submit for review if needed",
      test: "We'll test the OAuth flow and API connection"
    }
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    steps: [
      { id: 'setup', title: 'Meta App Setup', description: 'Create Facebook app', icon: Settings },
      { id: 'credentials', title: 'Get App Credentials', description: 'Obtain App ID and Secret', icon: Key },
      { id: 'permissions', title: 'Configure Permissions', description: 'Set up required permissions', icon: Settings },
      { id: 'test', title: 'Test Connection', description: 'Verify Facebook API access', icon: CheckCircle }
    ],
    instructions: {
      setup: "1. Visit https://developers.facebook.com\n2. Create a new app\n3. Select 'Business' type for company pages",
      credentials: "1. Go to App Settings > Basic\n2. Copy App ID and App Secret\n3. Add your domain to App Domains",
      permissions: "1. Add 'pages_manage_posts' permission\n2. Add 'pages_read_engagement' permission\n3. Complete business verification if needed",
      test: "We'll test the connection to your Facebook pages"
    }
  }
};

interface SocialConnectionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SocialConnectionWizard({ isOpen, onClose, onSuccess }: SocialConnectionWizardProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);

  const resetWizard = () => {
    setSelectedPlatform('');
    setCurrentStep(0);
    setCredentials({});
    setConnectionResult(null);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setCurrentStep(0);
    setCredentials({});
    setConnectionResult(null);
  };

  const handleNext = () => {
    if (selectedPlatform) {
      const config = platformConfigs[selectedPlatform as keyof typeof platformConfigs];
      if (currentStep < config.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setSelectedPlatform('');
    }
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    try {
      // Simulate API call to test connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/failure based on platform
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setConnectionResult({
        success,
        message: success 
          ? `Successfully connected to ${platformConfigs[selectedPlatform as keyof typeof platformConfigs].name}!`
          : 'Connection failed. Please check your credentials and try again.'
      });
      
      if (success) {
        setTimeout(() => {
          onSuccess();
          onClose();
          resetWizard();
          toast({
            title: "Connection Successful",
            description: `${platformConfigs[selectedPlatform as keyof typeof platformConfigs].name} has been connected successfully.`,
          });
        }, 2000);
      }
    } catch (error) {
      setConnectionResult({
        success: false,
        message: 'An error occurred while testing the connection.'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const renderPlatformSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Connect Your Social Media</h3>
        <p className="text-muted-foreground">Choose a platform to get started with step-by-step guidance</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(platformConfigs).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${config.borderColor} ${config.bgColor}`}
              onClick={() => handlePlatformSelect(key)}
            >
              <CardContent className="p-6 text-center">
                <Icon className={`h-12 w-12 mx-auto mb-3 ${config.color}`} />
                <h4 className="font-semibold mb-2">{config.name}</h4>
                <p className="text-sm text-muted-foreground">Connect your {config.name.toLowerCase()} account</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (!selectedPlatform) return null;
    
    const config = platformConfigs[selectedPlatform as keyof typeof platformConfigs];
    const step = config.steps[currentStep];
    const Icon = step.icon;
    const PlatformIcon = config.icon;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PlatformIcon className={`h-8 w-8 ${config.color}`} />
            <div>
              <h3 className="text-xl font-bold">{config.name} Setup</h3>
              <p className="text-muted-foreground">Step {currentStep + 1} of {config.steps.length}</p>
            </div>
          </div>
          <Badge variant="outline" className={config.color}>
            {step.title}
          </Badge>
        </div>

        {/* Progress */}
        <Progress value={(currentStep + 1) / config.steps.length * 100} className="w-full" />

        {/* Step Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {step.id === 'test' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="api-key">API Key / Client ID</Label>
                    <Input
                      id="api-key"
                      value={credentials.apiKey || ''}
                      onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Enter your API key"
                      data-testid="input-api-key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-secret">API Secret / Client Secret</Label>
                    <Input
                      id="api-secret"
                      type="password"
                      value={credentials.apiSecret || ''}
                      onChange={(e) => setCredentials(prev => ({ ...prev, apiSecret: e.target.value }))}
                      placeholder="Enter your API secret"
                      data-testid="input-api-secret"
                    />
                  </div>
                  {selectedPlatform === 'twitter' && (
                    <>
                      <div>
                        <Label htmlFor="access-token">Access Token</Label>
                        <Input
                          id="access-token"
                          value={credentials.accessToken || ''}
                          onChange={(e) => setCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
                          placeholder="Enter access token"
                          data-testid="input-access-token"
                        />
                      </div>
                      <div>
                        <Label htmlFor="access-token-secret">Access Token Secret</Label>
                        <Input
                          id="access-token-secret"
                          type="password"
                          value={credentials.accessTokenSecret || ''}
                          onChange={(e) => setCredentials(prev => ({ ...prev, accessTokenSecret: e.target.value }))}
                          placeholder="Enter access token secret"
                          data-testid="input-access-token-secret"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                {connectionResult && (
                  <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                    connectionResult.success 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {connectionResult.success ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span>{connectionResult.message}</span>
                  </div>
                )}
                
                <Button
                  onClick={handleTestConnection}
                  disabled={isConnecting || !credentials.apiKey || !credentials.apiSecret}
                  className="w-full"
                  data-testid="button-test-connection"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Instructions
                  </h4>
                  <pre className="text-sm text-slate-600 whitespace-pre-wrap">
                    {config.instructions[step.id as keyof typeof config.instructions]}
                  </pre>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Need help?</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={
                        selectedPlatform === 'twitter' ? 'https://developer.twitter.com' :
                        selectedPlatform === 'instagram' ? 'https://developers.facebook.com' :
                        selectedPlatform === 'linkedin' ? 'https://developer.linkedin.com' :
                        'https://developers.facebook.com'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Developer Portal
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 0 ? 'Back to Platforms' : 'Previous'}
          </Button>
          
          {step.id !== 'test' && (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Social Media Connection Wizard</DialogTitle>
          <DialogDescription>
            Follow our step-by-step guide to connect your social media accounts securely
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {selectedPlatform ? renderStepContent() : renderPlatformSelection()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
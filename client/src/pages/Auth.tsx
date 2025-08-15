import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SMSAuthForm } from "@/components/auth/SMSAuthForm";
import { Brain, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSMSVerification = (phoneNumber: string) => {
    setVerifiedPhone(phoneNumber);
    // In a real app, you'd set the user session here
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">FireBrandIQ</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <Tabs defaultValue="sms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>SMS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Email Authentication</CardTitle>
                <CardDescription>
                  Email authentication coming soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="mt-6">
            {verifiedPhone ? (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-green-600">Phone Verified!</CardTitle>
                  <CardDescription>
                    Redirecting to dashboard...
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Verified: {verifiedPhone}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <SMSAuthForm onVerificationComplete={handleSMSVerification} />
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
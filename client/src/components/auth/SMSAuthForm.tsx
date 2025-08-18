import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Phone, Shield } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface SMSAuthFormProps {
  onVerificationComplete: (phoneNumber: string) => void;
}

export function SMSAuthForm({ onVerificationComplete }: SMSAuthFormProps) {
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentOtp, setSentOtp] = useState('');
  const { toast } = useToast();

  const sendOTP = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://smddydqeufdgywqarbxv.supabase.co/functions/v1/send-sms-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZGR5ZHFldWZkZ3l3cWFyYnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTc3MDgsImV4cCI6MjA3MDIzMzcwOH0.0R2lpWCt7vgwid9gUTsVX49Ez8K8bX9tzM-po9bHd_M`
        },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // SECURITY FIX: OTP is no longer returned from server
      setStep('verify');
      
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });

    } catch (error) {
      console.error('Send OTP error:', error);
      toast({
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast({
        title: "Verification code required",
        description: "Please enter the 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // SECURITY FIX: Verify OTP server-side
      const response = await fetch('https://smddydqeufdgywqarbxv.supabase.co/functions/v1/verify-sms-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZGR5ZHFldWZkZ3l3cWFyYnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTc3MDgsImV4cCI6MjA3MDIzMzcwOH0.0R2lpWCt7vgwid9gUTsVX49Ez8K8bX9tzM-po9bHd_M`
        },
        body: JSON.stringify({ 
          phoneNumber,
          otp 
        })
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.success) {
        // Store session token securely
        if (result.sessionToken) {
          localStorage.setItem('authToken', result.sessionToken);
        }
        onVerificationComplete(result.phoneNumber);
        toast({
          title: "Phone verified!",
          description: "Your phone number has been successfully verified",
        });
      } else {
        throw new Error('Invalid verification code');
      }

    } catch (error) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    await sendOTP();
  };

  if (step === 'phone') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle>Verify Your Phone</CardTitle>
          <CardDescription>
            Enter your phone number to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <Button
            onClick={sendOTP}
            disabled={loading || !phoneNumber}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle>Enter Verification Code</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={loading}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>
        
        <Button
          onClick={verifyOTP}
          disabled={loading || otp.length !== 6}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>

        <Separator />

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={resendOTP}
            disabled={loading}
          >
            Resend Code
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep('phone')}
            disabled={loading}
          >
            Change Phone Number
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
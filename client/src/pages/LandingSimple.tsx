import React from 'react';
import { Button } from '@/components/ui/button';

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            FireBrandIQ
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            AI-Powered Brand Intelligence Platform
          </p>
          <div className="space-y-4">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started
            </Button>
            <div className="text-sm text-muted-foreground">
              Build is working! 🎉
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
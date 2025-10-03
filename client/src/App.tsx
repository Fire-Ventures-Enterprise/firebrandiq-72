import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Brands from "./pages/Brands";
import Mentions from "./pages/Mentions";
import Social from "./pages/Social";
import Insights from "./pages/Insights";
import Competitors from "./pages/Competitors";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Content from "./pages/Content";
import ContentGenerator from "./pages/ContentGenerator";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import Monitoring from "./pages/Monitoring";
import Reviews from "./pages/Reviews";
import Agency from "./pages/Agency";
import ContentCalendar from "./pages/ContentCalendar";
import BrandAssets from "./pages/BrandAssets";
import AdCreator from "./pages/AdCreator";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verify Supabase client is initialized
    const checkInit = async () => {
      try {
        await supabase.auth.getSession();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setIsInitialized(true); // Still proceed even if auth check fails
      }
    };
    checkInit();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Landing page */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Index />} />
          
          {/* Main app routes with layout */}
          <Route path="/dashboard" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/brands" element={<AppLayout />}>
            <Route index element={<Brands />} />
          </Route>
          <Route path="/mentions" element={<AppLayout />}>
            <Route index element={<Mentions />} />
          </Route>
          <Route path="/social" element={<AppLayout />}>
            <Route index element={<Social />} />
          </Route>
          <Route path="/insights" element={<AppLayout />}>
            <Route index element={<Insights />} />
          </Route>
          <Route path="/analytics" element={<AppLayout />}>
            <Route index element={<Analytics />} />
          </Route>
          <Route path="/monitoring" element={<AppLayout />}>
            <Route index element={<Monitoring />} />
          </Route>
          <Route path="/competitors" element={<AppLayout />}>
            <Route index element={<Competitors />} />
          </Route>
          <Route path="/content" element={<AppLayout />}>
            <Route index element={<Content />} />
          </Route>
          <Route path="/content/generator" element={<AppLayout />}>
            <Route index element={<ContentGenerator />} />
          </Route>
          <Route path="/content/calendar" element={<AppLayout />}>
            <Route index element={<ContentCalendar />} />
          </Route>
          <Route path="/content/assets" element={<AppLayout />}>
            <Route index element={<BrandAssets />} />
          </Route>
          <Route path="/campaigns/ads" element={<AppLayout />}>
            <Route index element={<AdCreator />} />
          </Route>
          <Route path="/campaigns" element={<AppLayout />}>
            <Route index element={<Campaigns />} />
          </Route>
          <Route path="/reports" element={<AppLayout />}>
            <Route index element={<Reports />} />
          </Route>
          <Route path="/settings" element={<AppLayout />}>
            <Route index element={<Settings />} />
          </Route>
          <Route path="/reviews" element={<AppLayout />}>
            <Route index element={<Reviews />} />
          </Route>
          <Route path="/agency" element={<AppLayout />}>
            <Route index element={<Agency />} />
          </Route>
          
          {/* Redirect from app root to dashboard */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;

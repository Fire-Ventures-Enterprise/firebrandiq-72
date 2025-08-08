import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Index />} />
          
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
          <Route path="/competitors" element={<AppLayout />}>
            <Route index element={<Competitors />} />
          </Route>
          <Route path="/reports" element={<AppLayout />}>
            <Route index element={<Reports />} />
          </Route>
          <Route path="/settings" element={<AppLayout />}>
            <Route index element={<Settings />} />
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

export default App;

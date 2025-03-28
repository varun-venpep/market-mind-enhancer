
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Research from "./pages/Research";
import ContentBrief from "./pages/ContentBrief";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import AuthLayout from "./components/Auth/AuthLayout";
import { ThemeProvider } from "./components/Theme/ThemeProvider";
import { supabase } from "./integrations/supabase/client";
import { AuthProvider } from "./contexts/AuthContext";
import { Briefs } from "./pages/Briefs";
import { Settings } from "./pages/Settings";
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/research" element={<Research />} />
              <Route path="/dashboard/briefs" element={<Briefs />} />
              <Route path="/dashboard/briefs/:id" element={<ContentBrief />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

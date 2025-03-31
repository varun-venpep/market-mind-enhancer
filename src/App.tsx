
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
import Login from "./components/Auth/Login";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import AuthLayout from "./components/Auth/AuthLayout";
import { ThemeProvider } from "./components/Theme/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { Briefs } from "./pages/Briefs";
import { Settings } from "./pages/Settings";
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";
import ShopifyStores from "./pages/ShopifyStores";
import ShopifyCallback from "./pages/ShopifyCallback";
import ShopifyStore from "./pages/ShopifyStore";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/research" element={<ProtectedRoute><Research /></ProtectedRoute>} />
              <Route path="/dashboard/briefs" element={<ProtectedRoute><Briefs /></ProtectedRoute>} />
              <Route path="/dashboard/briefs/:id" element={<ProtectedRoute><ContentBrief /></ProtectedRoute>} />
              <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard/shopify" element={<ProtectedRoute><ShopifyStores /></ProtectedRoute>} />
              <Route path="/dashboard/shopify/:storeId" element={<ProtectedRoute><ShopifyStore /></ProtectedRoute>} />
              <Route path="/shopify-callback" element={<ProtectedRoute><ShopifyCallback /></ProtectedRoute>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;


import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import SignUp from "@/pages/SignUp";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import CampaignDetail from "@/pages/CampaignDetail";
import ArticleDetail from "@/pages/ArticleDetail";
import ArticleEditor from "@/pages/ArticleEditor";
import ArticleGenerator from "@/pages/ArticleGenerator";
import ArticlePublisher from "@/pages/ArticlePublisher";
import BlogIntegrations from "@/pages/BlogIntegrations";
import ShopifyStores from "@/pages/ShopifyStores";
import ShopifyStore from "@/pages/ShopifyStore";
import ShopifyCallback from "@/pages/ShopifyCallback";
import ApiIntegrations from "@/pages/ApiIntegrations";
import Profile from "@/pages/Profile";
import Research from "@/pages/Research";
import Settings from "@/pages/Settings";
import ContentBriefs from "@/pages/ContentBriefs";
import BriefDetail from "@/pages/BriefDetail";
import ContentGenerator from "@/pages/ContentGenerator";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import ShopifyProtected from "@/components/ShopifyProtected";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      
      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Article Routes */}
      <Route
        path="/dashboard/campaigns"
        element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/campaigns/:campaignId"
        element={
          <ProtectedRoute>
            <CampaignDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/article/:id"
        element={
          <ProtectedRoute>
            <ArticleDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/article-editor/:articleId"
        element={
          <ProtectedRoute>
            <ArticleEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/article-generator"
        element={
          <ProtectedRoute>
            <ArticleGenerator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/article-publisher/:articleId"
        element={
          <ProtectedRoute>
            <ArticlePublisher />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/blog-integrations"
        element={
          <ProtectedRoute>
            <BlogIntegrations />
          </ProtectedRoute>
        }
      />
      
      {/* Briefs Routes */}
      <Route
        path="/dashboard/content-briefs"
        element={
          <ProtectedRoute>
            <ContentBriefs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/briefs/:id"
        element={
          <ProtectedRoute>
            <BriefDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/content-generator"
        element={
          <ProtectedRoute>
            <ContentGenerator />
          </ProtectedRoute>
        }
      />
      
      {/* Shopify Routes */}
      <Route
        path="/dashboard/shopify"
        element={
          <ProtectedRoute>
            <ShopifyStores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/shopify/store/:storeId"
        element={
          <ShopifyProtected>
            <ShopifyStore />
          </ShopifyProtected>
        }
      />
      <Route path="/shopify/callback" element={<ShopifyCallback />} />
      
      {/* Integrations */}
      <Route
        path="/dashboard/integrations"
        element={
          <ProtectedRoute>
            <ApiIntegrations />
          </ProtectedRoute>
        }
      />
      
      {/* Research */}
      <Route
        path="/dashboard/research"
        element={
          <ProtectedRoute>
            <Research />
          </ProtectedRoute>
        }
      />
      
      {/* Profile and Settings */}
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

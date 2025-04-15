
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AuthLayout from "@/components/Auth/AuthLayout";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import ContentBrief from "@/pages/ContentBrief";
import Research from "@/pages/Research";
import Profile from "@/pages/Profile";
import Briefs from "@/pages/Briefs";
import ShopifyStores from "@/pages/ShopifyStores";
import Settings from "@/pages/Settings";
import ShopifyStore from "@/pages/ShopifyStore";
import ShopifyCallback from "@/pages/ShopifyCallback";
import BriefDetail from "@/pages/BriefDetail";
import ContentBriefs from "@/pages/ContentBriefs";
import Workspaces from "@/pages/Workspaces";
import CustomSiteIntegration from "@/pages/CustomSiteIntegration";
import Campaigns from "@/pages/Campaigns";
import CampaignDetail from "@/pages/CampaignDetail";
import ArticleGenerator from "@/pages/ArticleGenerator";
import ArticleEditor from "@/pages/ArticleEditor";
import ArticleDetail from "@/pages/ArticleDetail";
import Integrations from "@/pages/Integrations";
import ApiIntegrations from "@/pages/ApiIntegrations";
import ContentGenerator from "@/pages/ContentGenerator";
import Analytics from "@/pages/Analytics";

export const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout>
        <SignUp />
      </AuthLayout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/briefs",
    element: (
      <ProtectedRoute>
        <Briefs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/content-briefs",
    element: (
      <ProtectedRoute>
        <ContentBriefs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/content-briefs/:id",
    element: (
      <ProtectedRoute>
        <BriefDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/brief/:id",
    element: (
      <ProtectedRoute>
        <ContentBrief />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/research",
    element: (
      <ProtectedRoute>
        <Research />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/shopify",
    element: (
      <ProtectedRoute>
        <ShopifyStores />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/shopify/:id",
    element: (
      <ProtectedRoute>
        <ShopifyStore />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/shopify/callback",
    element: (
      <ProtectedRoute>
        <ShopifyCallback />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/workspaces",
    element: (
      <ProtectedRoute>
        <Workspaces />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/custom-site",
    element: (
      <ProtectedRoute>
        <CustomSiteIntegration />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/campaigns",
    element: (
      <ProtectedRoute>
        <Campaigns />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/campaigns/:id",
    element: (
      <ProtectedRoute>
        <CampaignDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/article-generator",
    element: (
      <ProtectedRoute>
        <ArticleGenerator />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/article-editor/:id",
    element: (
      <ProtectedRoute>
        <ArticleEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/articles/:id",
    element: (
      <ProtectedRoute>
        <ArticleDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/integrations",
    element: (
      <ProtectedRoute>
        <Integrations />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/api-integrations",
    element: (
      <ProtectedRoute>
        <ApiIntegrations />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/content-generator",
    element: (
      <ProtectedRoute>
        <ContentGenerator />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/analytics",
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);

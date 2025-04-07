
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Research from "@/pages/Research";
import Briefs from "@/pages/Briefs";
import BriefDetail from "@/pages/BriefDetail";
import ContentBrief from "@/pages/ContentBrief";
import ContentGenerator from "@/pages/ContentGenerator";
import Login from "@/pages/Login";
import Integrations from "@/pages/Integrations";
import ShopifyStores from "@/pages/ShopifyStores";
import ShopifyStore from "@/pages/ShopifyStore";
import ShopifyCallback from "@/pages/ShopifyCallback";
import Pricing from "@/pages/Pricing";
import SignUp from "@/pages/SignUp";
import { Analytics } from "@/pages/Analytics";
import { Settings } from "@/pages/Settings";
import { Profile } from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Features from "@/pages/Features";

const routes = [
  {
    path: "/",
    component: Index,
    protected: false,
  },
  {
    path: "/login",
    component: Login,
    protected: false,
  },
  {
    path: "/signup",
    component: SignUp,
    protected: false,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    protected: true,
  },
  {
    path: "/dashboard/briefs",
    component: Briefs,
    protected: true,
  },
  {
    path: "/dashboard/briefs/:id",
    component: BriefDetail,
    protected: true,
  },
  {
    path: "/dashboard/brief/:id",
    component: ContentBrief,
    protected: true,
  },
  {
    path: "/dashboard/research",
    component: Research,
    protected: true,
  },
  {
    path: "/dashboard/analytics",
    component: Analytics,
    protected: true,
  },
  {
    path: "/dashboard/settings",
    component: Settings,
    protected: true,
  },
  {
    path: "/dashboard/profile",
    component: Profile,
    protected: true,
  },
  {
    path: "/dashboard/integrations",
    component: Integrations,
    protected: true,
  },
  {
    path: "/dashboard/shopify",
    component: ShopifyStores,
    protected: true,
  },
  {
    path: "/dashboard/shopify/:id",
    component: ShopifyStore,
    protected: true,
  },
  {
    path: "/dashboard/shopify-callback",
    component: ShopifyCallback,
    protected: true,
  },
  {
    path: "/dashboard/admin-subscription",
    component: AdminSubscriptionPage,
    protected: true,
  },
  {
    path: "/content-generator",
    component: ContentGenerator,
    protected: true,
  },
  {
    path: "/features",
    component: Features,
    protected: false,
  },
  {
    path: "/pricing",
    component: Pricing,
    protected: false,
  },
  {
    path: "*",
    component: NotFound,
    protected: false,
  },
];

export default routes;

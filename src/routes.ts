
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Research from "@/pages/Research";
import ShopifyStores from "@/pages/ShopifyStores";
import ShopifyStore from "@/pages/ShopifyStore";
import ShopifyCallback from "@/pages/ShopifyCallback";
import Integrations from "@/pages/Integrations";
import ContentBriefs from "@/pages/ContentBriefs";
import Index from "@/pages/Index";
import ApiIntegrations from "@/pages/ApiIntegrations";
import CustomSiteIntegration from "@/pages/CustomSiteIntegration";
import Workspaces from "@/pages/Workspaces";
import ArticleGenerator from "@/pages/ArticleGenerator";
import Campaigns from "@/pages/Campaigns";
import CampaignDetail from "@/pages/CampaignDetail";

const routes = [
  {
    path: "/",
    component: Index,
    protected: false
  },
  {
    path: "/dashboard",
    component: Dashboard,
    protected: true
  },
  {
    path: "/login",
    component: Login,
    protected: false
  },
  {
    path: "/register",
    component: Login,
    protected: false
  },
  {
    path: "/password-reset",
    component: Login,
    protected: false
  },
  {
    path: "/dashboard/research",
    component: Research,
    protected: true
  },
  {
    path: "/dashboard/shopify",
    component: ShopifyStores,
    protected: true
  },
  {
    path: "/dashboard/shopify/:storeId",
    component: ShopifyStore,
    protected: true
  },
  {
    path: "/shopify-callback",
    component: ShopifyCallback, 
    protected: false
  },
  {
    path: "/dashboard/integrations",
    component: Integrations,
    protected: true
  },
  {
    path: "/dashboard/api-integrations",
    component: ApiIntegrations,
    protected: true
  },
  {
    path: "/dashboard/custom-site",
    component: CustomSiteIntegration,
    protected: true
  },
  {
    path: "/dashboard/content-briefs",
    component: ContentBriefs,
    protected: true
  },
  {
    path: "/dashboard/workspaces",
    component: Workspaces,
    protected: true
  },
  {
    path: "/dashboard/article-generator",
    component: ArticleGenerator,
    protected: true
  },
  {
    path: "/dashboard/campaigns",
    component: Campaigns,
    protected: true
  },
  {
    path: "/dashboard/campaigns/:campaignId",
    component: CampaignDetail,
    protected: true
  }
];

export default routes;

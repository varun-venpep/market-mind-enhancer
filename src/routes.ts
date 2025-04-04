
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Research from "@/pages/Research";
import Briefs from "@/pages/Briefs";
import BriefDetail from "@/pages/BriefDetail";
import ContentGenerator from "@/pages/ContentGenerator";
import Login from "@/pages/Login";
import Integrations from "@/pages/Integrations";
import ShopifyStores from "@/pages/ShopifyStores";
import ShopifyStore from "@/pages/ShopifyStore";
import ShopifyCallback from "@/pages/ShopifyCallback";

// Define routes
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
    path: "/dashboard",
    component: Dashboard,
    protected: true,
  },
  {
    path: "/dashboard/research",
    component: Research,
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
    path: "/dashboard/content-generator",
    component: ContentGenerator,
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
    path: "/dashboard/shopify/:storeId",
    component: ShopifyStore,
    protected: true,
  },
  {
    path: "/shopify-callback",
    component: ShopifyCallback,
    protected: true,
  },
];

export default routes;

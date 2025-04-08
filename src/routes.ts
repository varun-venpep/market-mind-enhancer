
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Research from "@/pages/Research";
import ShopifyStores from "@/pages/ShopifyStores";
import ShopifyStore from "@/pages/ShopifyStore";
import Integrations from "@/pages/Integrations";
import ContentBriefs from "@/pages/ContentBriefs";
import Index from "@/pages/Index"; // Import Index component correctly
import ApiIntegrations from "@/pages/ApiIntegrations"; // Add missing import

const routes = [
  {
    path: "/",
    component: Index, // Use Index component for home route
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
    component: Login, // Temporarily use Login for register route
    protected: false
  },
  {
    path: "/password-reset",
    component: Login, // Temporarily use Login for password-reset route
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
    path: "/dashboard/content-briefs",
    component: ContentBriefs,
    protected: true
  }
];

export default routes;

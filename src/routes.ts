
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { Research } from "@/pages/Research";
import { Briefs } from "@/pages/Briefs";
import BriefDetail from "@/pages/BriefDetail";
import { ContentGenerator } from "@/pages/ContentGenerator";
import { Login } from "@/components/Auth/Login";
import { Integrations } from "@/pages/Integrations";
import { ShopifyStores } from "@/pages/ShopifyStores";
import { ShopifyStore } from "@/pages/ShopifyStore";
import { ShopifyConnect } from "@/pages/ShopifyConnect";

// Define routes
const routes = [
  {
    path: "/",
    component: Home,
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
    path: "/dashboard/shopify/:id",
    component: ShopifyStore,
    protected: true,
  },
  {
    path: "/shopify-connect",
    component: ShopifyConnect,
    protected: true,
  },
];

export default routes;

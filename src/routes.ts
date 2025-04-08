
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Research from "@/pages/Research";
import ShopifyStores from "@/pages/ShopifyStores";
import ShopifyStore from "@/pages/ShopifyStore";
import Integrations from "@/pages/Integrations";
import ContentBriefs from "@/pages/ContentBriefs";
import Home from "@/pages/Index"; // Fixed: Home should be Index
import PasswordReset from "@/pages/Login"; // Temporarily point to Login since PasswordReset doesn't exist
import Register from "@/pages/Login"; // Temporarily point to Login since Register doesn't exist

const routes = [
  {
    path: "/",
    component: Home,
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
    component: Register,
    protected: false
  },
  {
    path: "/password-reset",
    component: PasswordReset,
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
    path: "/dashboard/content-briefs",
    component: ContentBriefs,
    protected: true
  }
];

export default routes;


import { lazy } from 'react';

// Main Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Briefs = lazy(() => import('./pages/Briefs'));
const BriefDetail = lazy(() => import('./pages/BriefDetail'));
const KeywordResearch = lazy(() => import('./pages/KeywordResearch'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'));
const ArticleGenerator = lazy(() => import('./pages/ArticleGenerator'));
const ArticleEditor = lazy(() => import('./pages/ArticleEditor'));

// Shopify Pages
const Shopify = lazy(() => import('./pages/Shopify'));
const ShopifyDetail = lazy(() => import('./pages/ShopifyDetail'));

const routes = [
  {
    path: '/',
    component: Home,
    protected: false
  },
  {
    path: '/login',
    component: Login,
    protected: false
  },
  {
    path: '/signup',
    component: SignUp,
    protected: false
  },
  {
    path: '/dashboard',
    component: Dashboard,
    protected: true
  },
  {
    path: '/dashboard/settings',
    component: Settings,
    protected: true
  },
  {
    path: '/pricing',
    component: Pricing,
    protected: false
  },
  {
    path: '/dashboard/briefs',
    component: Briefs,
    protected: true
  },
  {
    path: '/dashboard/briefs/:id',
    component: BriefDetail,
    protected: true
  },
  {
    path: '/dashboard/keyword-research',
    component: KeywordResearch,
    protected: true
  },
  {
    path: '/dashboard/campaigns',
    component: Campaigns,
    protected: true
  },
  {
    path: '/dashboard/campaigns/:campaignId',
    component: CampaignDetail,
    protected: true
  },
  {
    path: '/dashboard/article-generator',
    component: ArticleGenerator,
    protected: true
  },
  {
    path: '/dashboard/article-editor/:articleId',
    component: ArticleEditor,
    protected: true
  },
  {
    path: '/dashboard/shopify',
    component: Shopify,
    protected: true
  },
  {
    path: '/dashboard/shopify/:storeId',
    component: ShopifyDetail,
    protected: true
  }
];

export default routes;

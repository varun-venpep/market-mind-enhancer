
import { lazy } from 'react';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import { Profile } from './pages/Profile';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Research from './pages/Research';
import Workspaces from './pages/Workspaces';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import { Analytics } from './pages/Analytics';
import ContentBriefs from './pages/ContentBriefs';
import Briefs from './pages/Briefs';
import BriefDetail from './pages/BriefDetail';
import ApiIntegrations from './pages/ApiIntegrations';
import ShopifyStores from './pages/ShopifyStores';
import ShopifyStore from './pages/ShopifyStore';
import ShopifyCallback from './pages/ShopifyCallback';
import ArticleDetail from './pages/ArticleDetail';
import ArticleEditor from './pages/ArticleEditor';
import ContentBrief from './pages/ContentBrief';
import CustomSiteIntegration from './pages/CustomSiteIntegration';
import ArticleGenerator from './pages/ArticleGenerator';
import ContentGenerator from './pages/ContentGenerator';
import Integrations from './pages/Integrations';
import BlogIntegrations from './pages/BlogIntegrations';
import ArticlePublisher from './pages/ArticlePublisher';
import { Settings } from './pages/Settings';
import BloggerAuthCallback from './components/Articles/BloggerAuthCallback';

const routes = [
  {
    path: '/',
    component: Index,
    protected: false,
  },
  {
    path: '/login',
    component: Login,
    protected: false,
  },
  {
    path: '/sign-up',
    component: SignUp,
    protected: false,
  },
  {
    path: '/features',
    component: Features,
    protected: false,
  },
  {
    path: '/pricing',
    component: Pricing,
    protected: false,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    protected: true,
  },
  {
    path: '/dashboard/profile',
    component: Profile,
    protected: true,
  },
  {
    path: '/dashboard/settings',
    component: Settings,
    protected: true,
  },
  {
    path: '/dashboard/research',
    component: Research,
    protected: true,
  },
  {
    path: '/dashboard/workspaces',
    component: Workspaces,
    protected: true,
  },
  {
    path: '/dashboard/campaigns',
    component: Campaigns,
    protected: true,
  },
  {
    path: '/dashboard/campaign/:campaignId',
    component: CampaignDetail,
    protected: true,
  },
  {
    path: '/dashboard/analytics',
    component: Analytics,
    protected: true,
  },
  {
    path: '/dashboard/content-briefs',
    component: ContentBriefs,
    protected: true,
  },
  {
    path: '/dashboard/briefs',
    component: Briefs,
    protected: true,
  },
  {
    path: '/dashboard/brief/:briefId',
    component: BriefDetail,
    protected: true,
  },
  {
    path: '/dashboard/api-integrations',
    component: ApiIntegrations,
    protected: true,
  },
  {
    path: '/dashboard/shopify',
    component: ShopifyStores,
    protected: true,
  },
  {
    path: '/dashboard/shopify/:storeId',
    component: ShopifyStore,
    protected: true,
  },
  {
    path: '/dashboard/shopify-callback',
    component: ShopifyCallback,
    protected: true,
  },
  {
    path: '/dashboard/article/:articleId',
    component: ArticleDetail,
    protected: true,
  },
  {
    path: '/dashboard/article-editor/:articleId',
    component: ArticleEditor,
    protected: true,
  },
  {
    path: '/dashboard/article-publisher/:articleId',
    component: ArticlePublisher,
    protected: true,
  },
  {
    path: '/dashboard/content-brief/:briefId',
    component: ContentBrief,
    protected: true,
  },
  {
    path: '/dashboard/custom-site',
    component: CustomSiteIntegration,
    protected: true,
  },
  {
    path: '/dashboard/article-generator',
    component: ArticleGenerator,
    protected: true,
  },
  {
    path: '/dashboard/content-generator',
    component: ContentGenerator,
    protected: true,
  },
  {
    path: '/dashboard/integrations',
    component: Integrations,
    protected: true,
  },
  {
    path: '/dashboard/blog-integrations',
    component: BlogIntegrations,
    protected: true,
  },
  {
    path: '/dashboard/blogger-callback',
    component: BloggerAuthCallback,
    protected: true,
  },
  {
    path: '*',
    component: NotFound,
    protected: false,
  },
];

export default routes;

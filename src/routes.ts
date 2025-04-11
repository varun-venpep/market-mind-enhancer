
import { RouteObject } from 'react-router-dom';
import { Main } from "./pages/Main";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ContentBrief from "./pages/ContentBrief";
import ContentBriefList from "./pages/ContentBriefList";
import RelatedKeywords from "./pages/RelatedKeywords";
import ContentBriefEditor from "./pages/ContentBriefEditor";
import { Settings } from "./pages/Settings";
import ArticleGenerator from "./pages/ArticleGenerator";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import ActivityFeed from './pages/ActivityFeed';

// Define routes for the application
export const routes = [
  {
    path: '/',
    element: Main
  },
  {
    path: '/login',
    element: Login
  },
  {
    path: '/register',
    element: Register
  },
  {
    path: '/dashboard',
    element: Dashboard
  },
  {
    path: '/dashboard/content-brief/:id',
    element: ContentBrief
  },
  {
    path: '/dashboard/content-brief-list',
    element: ContentBriefList
  },
  {
    path: '/dashboard/related-keywords',
    element: RelatedKeywords
  },
  {
    path: '/dashboard/content-brief-editor',
    element: ContentBriefEditor
  },
  {
    path: '/dashboard/settings',
    element: Settings
  },
  {
    path: '/dashboard/article-generator',
    element: ArticleGenerator
  },
  {
    path: '/dashboard/campaigns',
    element: Campaigns
  },
  {
    path: '/dashboard/campaigns/:campaignId',
    element: CampaignDetail
  },
  {
    path: '/dashboard/activity',
    element: ActivityFeed
  }
];

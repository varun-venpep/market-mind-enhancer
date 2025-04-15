
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  ShoppingBag, 
  Zap,
  Share2,
  User,
  Settings,
  BookOpen
} from "lucide-react";

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Campaigns",
    href: "/dashboard/campaigns",
    icon: FileText,
  },
  {
    name: "Content Briefs",
    href: "/dashboard/content-briefs",
    icon: BookOpen,
  },
  {
    name: "Research",
    href: "/dashboard/research",
    icon: Search,
  },
  {
    name: "Shopify",
    href: "/dashboard/shopify",
    icon: ShoppingBag,
  },
  {
    name: "Integrations",
    href: "/dashboard/integrations",
    icon: Zap,
  },
  {
    name: "Blog Integrations",
    href: "/dashboard/blog-integrations",
    icon: Share2,
  },
];

export const profileItems = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

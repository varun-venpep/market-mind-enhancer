
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText,
  Settings,
  LayoutGrid,
  ChevronDown,
  ScrollText,
  Share2,
  Sliders,
  Shield,
  Star,
  Megaphone,
  Gauge,
  Rss
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed?: boolean;
}

const menuItems = [
  {
    title: "Articles",
    icon: FileText,
    path: "/dashboard/articles",
    submenu: [
      { title: "All Articles", path: "/dashboard/articles" },
      { title: "Create New", path: "/dashboard/article-generator" },
    ]
  },
  {
    title: "Blog Automation",
    icon: ScrollText,
    path: "/dashboard/blog-automation",
    submenu: [
      { title: "Settings", path: "/dashboard/blog-automation/settings" },
      { title: "Analytics", path: "/dashboard/blog-automation/analytics" },
    ]
  },
  {
    title: "Social Media",
    icon: Share2,
    path: "/dashboard/social-media",
    submenu: [
      { title: "Accounts", path: "/dashboard/social-media/accounts" },
      { title: "Calendar", path: "/dashboard/social-media/calendar" },
    ]
  },
  {
    title: "AutoSocial",
    icon: Gauge,
    path: "/dashboard/auto-social",
  },
  {
    title: "Customization",
    icon: Sliders,
    path: "/dashboard/customization",
  },
  {
    title: "Lead Magnets",
    icon: Megaphone,
    path: "/dashboard/lead-magnets",
  },
  {
    title: "Blog Publishing",
    icon: Rss,
    path: "/dashboard/blog-integrations",
    badge: "New"
  },
  {
    title: "AI SEO Tracker",
    icon: Star,
    path: "/dashboard/seo-tracker",
    badge: "New"
  },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  return (
    <div className={cn(
      "h-screen flex flex-col bg-background border-r",
      collapsed ? "w-[60px]" : "w-[250px]"
    )}>
      <div className="p-4 border-b">
        <h2 className={cn(
          "font-semibold",
          collapsed ? "hidden" : "text-lg"
        )}>
          MarketMind
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {menuItems.map((item) => (
          item.submenu ? (
            <Collapsible key={item.title} className="mb-2">
              <CollapsibleTrigger className="flex items-center w-full p-2 rounded-md hover:bg-accent text-sm group">
                <item.icon className="h-4 w-4 mr-2" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 mt-1">
                {item.submenu.map((subItem) => (
                  <NavLink
                    key={subItem.path}
                    to={subItem.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center p-2 rounded-md text-sm hover:bg-accent",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )
                    }
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center p-2 mb-1 rounded-md text-sm hover:bg-accent group",
                  isActive && "bg-primary/10 text-primary font-medium"
                )
              }
            >
              <item.icon className="h-4 w-4 mr-2" />
              {!collapsed && (
                <span className="flex-1">{item.title}</span>
              )}
              {!collapsed && item.badge && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        ))}
      </nav>

      <div className={cn(
        "p-4 border-t",
        collapsed ? "hidden" : "block"
      )}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {}}
        >
          <Shield className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

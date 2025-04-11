
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, ChevronDown, LogOut, Home, Search, ShoppingBag, Settings, FileText, MessagesSquare, LayoutGrid, FileEdit, ListChecks } from 'lucide-react';
import { useTheme } from "@/components/theme-provider";
import { useAuth } from '@/contexts/AuthContext';
import { WorkspaceSelector } from '@/components/Workspace/WorkspaceSelector';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { currentWorkspace } = useWorkspace();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Research", icon: Search, path: "/dashboard/research" },
    { name: "Content Briefs", icon: FileText, path: "/dashboard/content-briefs" },
    { name: "Article Generator", icon: FileEdit, path: "/dashboard/article-generator" },
    { name: "Campaigns", icon: ListChecks, path: "/dashboard/campaigns" },
    { name: "Shopify", icon: ShoppingBag, path: "/dashboard/shopify" },
    { name: "Integrations", icon: LayoutGrid, path: "/dashboard/integrations" }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-1 text-primary font-bold">
              <span className="hidden md:inline-block">SEO Wizard</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MessagesSquare className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          
          <div className="hidden md:flex ml-4">
            <WorkspaceSelector />
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="" />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm">
                    {user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/workspaces')}>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Manage Workspaces
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex h-10 items-center gap-4 px-4 md:px-6 border-t md:hidden">
          <WorkspaceSelector />
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className={`hidden md:flex w-56 flex-col border-r px-4 py-6 ${isMobileMenuOpen ? 'block' : ''}`}>
          <div className="font-medium text-xs text-muted-foreground mb-2">
            WORKSPACE: {currentWorkspace?.name}
          </div>
          
          <nav className="flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <Separator className="my-4" />
          
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/dashboard/workspaces"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`
              }
            >
              <LayoutGrid className="h-4 w-4" />
              Workspaces
            </NavLink>
          </nav>
          
          <div className="mt-auto">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </aside>
        
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

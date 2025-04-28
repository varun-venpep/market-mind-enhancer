
import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from "@/components/Theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Search, 
  LineChart, 
  AlignJustify, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronDown,
  BarChart3,
  Layers,
  Database,
  FileCode2,
  BookOpen,
  ListTodo,
  User,
  Store,
  Link as LinkIcon,
  Rss,
} from "lucide-react";
import { WorkspaceSelector } from '../Workspace/WorkspaceSelector';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  endContent?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarSubMenuProps {
  icon: React.ReactNode;
  text: string;
  children: React.ReactNode;
}

// Sidebar Link Component
const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon, 
  text, 
  endContent,
  active,
  onClick 
}) => {
  const isActive = active || false;

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-muted/60 hover:text-primary"
        )
      }
    >
      <div className="flex items-center gap-3">
        <div className="w-5 h-5">{icon}</div>
        <span>{text}</span>
      </div>
      {endContent && (
        <div>{endContent}</div>
      )}
    </NavLink>
  );
};

// Sidebar Submenu Component
const SidebarSubMenu: React.FC<SidebarSubMenuProps> = ({ 
  icon, 
  text, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Check if any child route is active
  const childPaths = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return child.props.to;
    }
    return null;
  });
  
  const isActive = childPaths?.some(path => location.pathname.startsWith(path)) || false;

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-between px-3 py-2 text-sm font-medium transition-colors",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-muted/60 hover:text-primary"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5">{icon}</div>
          <span>{text}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>
      {isOpen && (
        <div className="ml-8 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

// Main Dashboard Layout Component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const closeSidebar = () => {
    setIsSheetOpen(false);
  };

  // Sidebar content component to avoid duplication between desktop and mobile views
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-md opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">M</div>
          </div>
          <span className="text-xl font-bold">MarketMind</span>
        </Link>
      </div>
      
      <div className="px-3 py-4">
        <nav className="space-y-1">
          <SidebarLink 
            to="/dashboard" 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            text="Dashboard"
            onClick={closeSidebar}
          />
          
          <SidebarLink 
            to="/dashboard/research" 
            icon={<Search className="h-5 w-5" />} 
            text="Keyword Research"
            onClick={closeSidebar}
          />

          <SidebarSubMenu 
            icon={<Layers className="h-5 w-5" />} 
            text="Content"
          >
            <SidebarLink 
              to="/dashboard/article-generator" 
              icon={<FileText className="h-5 w-5" />} 
              text="Article Generator"
              onClick={closeSidebar}
            />
            <SidebarLink 
              to="/dashboard/content-generator" 
              icon={<BookOpen className="h-5 w-5" />} 
              text="Content Generator"
              onClick={closeSidebar}
            />
            <SidebarLink 
              to="/dashboard/content-briefs" 
              icon={<ListTodo className="h-5 w-5" />} 
              text="Content Briefs"
              onClick={closeSidebar}
            />
          </SidebarSubMenu>

          <SidebarLink 
            to="/dashboard/campaigns" 
            icon={<BarChart3 className="h-5 w-5" />} 
            text="Campaigns"
            onClick={closeSidebar}
          />

          <SidebarLink 
            to="/dashboard/analytics" 
            icon={<LineChart className="h-5 w-5" />} 
            text="Analytics" 
            onClick={closeSidebar}
          />

          <SidebarSubMenu 
            icon={<Database className="h-5 w-5" />} 
            text="Integrations"
          >
            <SidebarLink 
              to="/dashboard/shopify" 
              icon={<Store className="h-5 w-5" />} 
              text="Shopify"
              onClick={closeSidebar}
            />
            <SidebarLink 
              to="/dashboard/blog-integrations" 
              icon={<Rss className="h-5 w-5" />} 
              text="Blog Publishing"
              onClick={closeSidebar}
            />
            <SidebarLink 
              to="/dashboard/custom-site" 
              icon={<FileCode2 className="h-5 w-5" />} 
              text="Custom Website"
              onClick={closeSidebar}
            />
            <SidebarLink 
              to="/dashboard/integrations" 
              icon={<LinkIcon className="h-5 w-5" />} 
              text="All Integrations"
              onClick={closeSidebar}
            />
          </SidebarSubMenu>

          <SidebarLink 
            to="/dashboard/workspaces" 
            icon={<Layers className="h-5 w-5" />} 
            text="Workspaces"
            onClick={closeSidebar}
          />
        </nav>
      </div>

      <div className="mt-auto px-3 py-4 border-t">
        <SidebarLink 
          to="/dashboard/settings" 
          icon={<Settings className="h-5 w-5" />} 
          text="Settings"
          onClick={closeSidebar}
        />
        <Button 
          variant="ghost" 
          className="w-full justify-start px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted/60 hover:text-primary"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5">
              <LogOut className="h-5 w-5" />
            </div>
            <span>Log out</span>
          </div>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 border-r flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-background border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <AlignJustify className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              {/* Workspace Selector */}
              <WorkspaceSelector />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">Account</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

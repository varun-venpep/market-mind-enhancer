
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from "@/components/theme-provider";
import { useAuth } from '@/contexts/AuthContext';
import { WorkspaceSelector } from '@/components/Workspace/WorkspaceSelector';
import { useWorkspace } from '@/contexts/WorkspaceContext';

// Material Tailwind components
import {
  Button,
  IconButton,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemPrefix,
  Navbar,
} from "@material-tailwind/react";

// Heroicons (use v2 import syntax)
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  Cog8ToothIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ServerStackIcon,
  DocumentPlusIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

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
    { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    { name: "Research", icon: MagnifyingGlassIcon, path: "/dashboard/research" },
    { name: "Content Briefs", icon: DocumentTextIcon, path: "/dashboard/content-briefs" },
    { name: "Article Generator", icon: DocumentPlusIcon, path: "/dashboard/article-generator" },
    { name: "Campaigns", icon: ClipboardDocumentCheckIcon, path: "/dashboard/campaigns" },
    { name: "Shopify", icon: ShoppingBagIcon, path: "/dashboard/shopify" },
    { name: "Integrations", icon: ServerStackIcon, path: "/dashboard/integrations" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-white">
      <Navbar 
        className="sticky top-0 z-10 h-max max-w-full rounded-none border-none py-2 px-4 lg:px-8 bg-dark-900"
        placeholder=""
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <Typography
              as="a"
              href="#"
              variant="h5"
              className="mr-4 cursor-pointer py-1.5 text-primary-500 font-bold"
              placeholder=""
            >
              SEO Wizard
            </Typography>
            <IconButton
              variant="text"
              color="white"
              className="ml-auto h-6 w-6 text-white hover:bg-primary-500/10 md:hidden"
              ripple={false}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              placeholder=""
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </IconButton>
          </div>
          
          <div className="hidden md:flex ml-4">
            <WorkspaceSelector />
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <IconButton
              variant="text"
              color="white"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:bg-primary-500/10"
              placeholder=""
            >
              {theme === "dark" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </IconButton>
            
            <Menu>
              <MenuHandler>
                <Button
                  variant="text"
                  color="white"
                  className="flex items-center gap-2 px-2 text-white hover:bg-primary-500/10"
                  placeholder=""
                >
                  <Avatar
                    variant="circular"
                    size="sm"
                    alt="User"
                    className="bg-primary-500"
                    src=""
                    placeholder=""
                  >
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <span className="hidden md:inline-block text-sm">
                    {user?.email?.split('@')[0]}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </MenuHandler>
              <MenuList className="bg-dark-800 border-dark-700 text-white shadow-md" placeholder="">
                <MenuItem className="flex items-center gap-2 text-white hover:bg-primary-500/10" placeholder="">
                  <Cog8ToothIcon className="h-4 w-4" />
                  <Typography onClick={() => navigate('/dashboard/settings')} placeholder="">
                    Settings
                  </Typography>
                </MenuItem>
                <MenuItem className="flex items-center gap-2 text-white hover:bg-primary-500/10" placeholder="">
                  <ServerStackIcon className="h-4 w-4" />
                  <Typography onClick={() => navigate('/dashboard/workspaces')} placeholder="">
                    Manage Workspaces
                  </Typography>
                </MenuItem>
                <hr className="my-2 border-dark-700" />
                <MenuItem className="flex items-center gap-2 text-white hover:bg-primary-500/10" onClick={() => logout()} placeholder="">
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <Typography placeholder="">
                    Sign out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
        
        <div className="flex h-10 items-center gap-4 py-2 mt-2 md:hidden">
          <WorkspaceSelector />
        </div>
      </Navbar>
      
      <div className="flex flex-1">
        <Drawer
          open={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          className="p-4 bg-dark-900"
          placeholder=""
          overlayRef={null}
        >
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h5" color="white" placeholder="">
              SEO Wizard
            </Typography>
            <IconButton
              variant="text"
              color="white"
              onClick={() => setIsMobileMenuOpen(false)}
              placeholder=""
            >
              <ChevronRightIcon strokeWidth={2} className="h-5 w-5" />
            </IconButton>
          </div>
          
          <List className="text-white" placeholder="">
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  isActive(item.path) ? "bg-primary-500/10 text-primary-500" : "hover:bg-primary-500/5"
                }`}
                placeholder=""
              >
                <ListItemPrefix placeholder="">
                  <item.icon className="h-5 w-5" />
                </ListItemPrefix>
                {item.name}
              </ListItem>
            ))}
          </List>
        </Drawer>

        <aside className="hidden md:flex w-56 flex-col border-r border-dark-800 px-4 py-6">
          <div className="font-medium text-xs text-blue-gray-400 mb-2">
            WORKSPACE: {currentWorkspace?.name}
          </div>
          
          <List className="text-white" placeholder="">
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                onClick={() => navigate(item.path)}
                className={`${
                  isActive(item.path) ? "bg-primary-500/10 text-primary-500" : "hover:bg-primary-500/5"
                }`}
                placeholder=""
              >
                <ListItemPrefix placeholder="">
                  <item.icon className="h-5 w-5" />
                </ListItemPrefix>
                {item.name}
              </ListItem>
            ))}
          </List>
          
          <hr className="my-4 border-dark-800" />
          
          <List className="text-white" placeholder="">
            <ListItem
              onClick={() => navigate('/dashboard/workspaces')}
              className={`${
                isActive('/dashboard/workspaces') ? "bg-primary-500/10 text-primary-500" : "hover:bg-primary-500/5"
              }`}
              placeholder=""
            >
              <ListItemPrefix placeholder="">
                <ServerStackIcon className="h-5 w-5" />
              </ListItemPrefix>
              Workspaces
            </ListItem>
          </List>
          
          <div className="mt-auto">
            <Button
              variant="outlined"
              color="white"
              className="w-full flex items-center justify-start border-dark-800 text-white hover:bg-primary-500/5"
              onClick={() => navigate('/dashboard/settings')}
              placeholder=""
            >
              <Cog8ToothIcon className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </div>
        </aside>
        
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

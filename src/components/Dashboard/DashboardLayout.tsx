
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Book,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  User,
  X,
  Search,
  Zap,
  Share2,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      name: "Campaigns",
      href: "/dashboard/campaigns",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      name: "Content Briefs",
      href: "/dashboard/content-briefs",
      icon: <BookOpen className="h-5 w-5 mr-2" />,
    },
    {
      name: "Research",
      href: "/dashboard/research",
      icon: <Search className="h-5 w-5 mr-2" />,
    },
    {
      name: "Shopify",
      href: "/dashboard/shopify",
      icon: <ShoppingBag className="h-5 w-5 mr-2" />,
    },
    {
      name: "Integrations",
      href: "/dashboard/integrations",
      icon: <Zap className="h-5 w-5 mr-2" />,
    },
    {
      name: "Blog Integrations",
      href: "/dashboard/blog-integrations",
      icon: <Share2 className="h-5 w-5 mr-2" />,
    },
  ];

  const profileItems = [
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5 mr-2" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-2">
          <div className="flex items-center">
            {isMobile ? (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 mr-2"
                    onClick={() => setIsMenuOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px] p-0">
                  <div className="p-6 border-b flex">
                    <Link
                      to="/"
                      className="flex items-center font-semibold text-lg"
                    >
                      <Book className="h-5 w-5 mr-2" />
                      MarketMind
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-auto"
                      onClick={closeMenu}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-md hover:bg-muted",
                          location.pathname === item.href && "bg-muted"
                        )}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                    <Separator className="my-4" />
                    {profileItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-md hover:bg-muted",
                          location.pathname === item.href && "bg-muted"
                        )}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start py-2 px-3"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            ) : (
              <Link
                to="/"
                className="flex items-center font-semibold text-lg mr-6"
              >
                <Book className="h-5 w-5 mr-2" />
                MarketMind
              </Link>
            )}
            {!isMobile && (
              <nav className="hidden lg:flex space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 text-sm rounded-md hover:bg-muted",
                      location.pathname === item.href && "bg-muted font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-md"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <span className="text-sm font-medium">{user?.email}</span>
              )}
            </Link>
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900/50">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;


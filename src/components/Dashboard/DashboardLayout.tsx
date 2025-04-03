
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Search, 
  FileText, 
  BarChart, 
  Settings, 
  User, 
  Plus,
  Menu,
  X,
  PackageOpen,
  ShoppingBag,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Research", href: "/dashboard/research", icon: Search },
    { name: "Content Briefs", href: "/dashboard/briefs", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { 
      name: "Integrations", 
      href: "/dashboard/integrations", 
      icon: PackageOpen,
      children: [
        { name: "Shopify", href: "/dashboard/shopify", icon: ShoppingBag }
      ]
    },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/dashboard" className="text-xl font-bold gradient-text">MarketMind</Link>
            </div>
            <div className="mt-6 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        location.pathname === item.href
                          ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-r-4 border-brand-600 dark:border-brand-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className={cn(
                          location.pathname === item.href 
                            ? "text-brand-600 dark:text-brand-400" 
                            : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400",
                          "mr-3 flex-shrink-0 h-6 w-6"
                        )}
                      />
                      {item.name}
                    </Link>
                    
                    {/* Display children if there are any */}
                    {item.children && (
                      <div className="pl-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={cn(
                              location.pathname === child.href || location.pathname.startsWith(`${child.href}/`)
                                ? "text-brand-600 dark:text-brand-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
                              "group flex items-center px-2 py-1.5 text-sm font-medium rounded-md"
                            )}
                          >
                            <child.icon
                              className={cn(
                                location.pathname === child.href || location.pathname.startsWith(`${child.href}/`)
                                  ? "text-brand-600 dark:text-brand-400" 
                                  : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400",
                                "mr-3 flex-shrink-0 h-5 w-5"
                              )}
                            />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="p-4">
              <Button onClick={() => navigate('/dashboard/briefs')} className="w-full gradient-button" size="sm">
                <Plus className="h-4 w-4 mr-2" /> New Brief
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex-shrink-0 w-full group">
              <div className="flex items-center justify-between">
                <Link to="/dashboard/profile" className="flex items-center">
                  <div>
                    <User className="inline-block h-9 w-9 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-400">
                      Free Plan
                    </p>
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout} 
                  className="text-gray-500 hover:text-red-500"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 right-0 p-4 z-50">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-950">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <Link to="/dashboard" className="text-xl font-bold gradient-text" onClick={() => setIsMobileMenuOpen(false)}>MarketMind</Link>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        location.pathname === item.href
                          ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          location.pathname === item.href 
                            ? "text-brand-600 dark:text-brand-400" 
                            : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400",
                          "mr-4 flex-shrink-0 h-6 w-6"
                        )}
                      />
                      {item.name}
                    </Link>
                    
                    {/* Display children in mobile menu */}
                    {item.children && (
                      <div className="pl-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={cn(
                              location.pathname === child.href || location.pathname.startsWith(`${child.href}/`)
                                ? "text-brand-600 dark:text-brand-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
                              "group flex items-center px-2 py-1.5 text-sm font-medium rounded-md"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <child.icon
                              className={cn(
                                location.pathname === child.href || location.pathname.startsWith(`${child.href}/`)
                                  ? "text-brand-600 dark:text-brand-400" 
                                  : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400",
                                "mr-3 flex-shrink-0 h-5 w-5"
                              )}
                            />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex-shrink-0 group block w-full">
                <div className="flex items-center justify-between">
                  <Link to="/dashboard/profile" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <div>
                      <User className="inline-block h-10 w-10 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2" />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                        {user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-400">
                        Free Plan
                      </p>
                    </div>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout} 
                    className="text-gray-500 hover:text-red-500"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

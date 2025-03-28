
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  FileText, 
  BarChart, 
  Settings, 
  User, 
  Plus,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Research", href: "/dashboard/research", icon: Search },
    { name: "Content Briefs", href: "/dashboard/briefs", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold gradient-text">MarketMind</span>
            </div>
            <div className="mt-6 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      location.pathname === item.href
                        ? "bg-brand-50 text-brand-600 border-r-4 border-brand-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      className={cn(
                        location.pathname === item.href 
                          ? "text-brand-600" 
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 flex-shrink-0 h-6 w-6"
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4">
              <Button className="w-full gradient-button" size="sm">
                <Plus className="h-4 w-4 mr-2" /> New Brief
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link to="/dashboard/profile" className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <User className="inline-block h-9 w-9 rounded-full text-gray-500 bg-gray-100 p-2" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    John Doe
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    Free Plan
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 right-0 p-4 z-50">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold gradient-text">MarketMind</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      location.pathname === item.href
                        ? "bg-brand-50 text-brand-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        location.pathname === item.href 
                          ? "text-brand-600" 
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-4 flex-shrink-0 h-6 w-6"
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link to="/dashboard/profile" className="flex-shrink-0 group block w-full">
                <div className="flex items-center">
                  <div>
                    <User className="inline-block h-10 w-10 rounded-full text-gray-500 bg-gray-100 p-2" />
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                      John Doe
                    </p>
                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                      Free Plan
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

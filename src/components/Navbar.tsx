
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Menu, 
  X, 
  Home, 
  Database, 
  Activity, 
  Star, 
  Settings,
  LogIn,
  ShoppingBag,
  User
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPro } = useSubscription();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-2.5">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-bold whitespace-nowrap gradient-text">MarketMind</span>
        </Link>
        
        <div className="flex items-center lg:order-2">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {isPro && (
                <Badge className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
                  Pro
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.email || "User"} />
                      <AvatarFallback className="bg-brand-100 text-brand-800">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>Settings</DropdownMenuItem>
                  {!isPro && (
                    <DropdownMenuItem onClick={() => navigate('/pricing')}>Upgrade to Pro</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login"><LogIn className="h-4 w-4 mr-2" /> Log in</Link>
              </Button>
              <Button asChild className="gradient-button">
                <Link to="/signup">Sign up free</Link>
              </Button>
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        <div className={`${isOpen ? 'block' : 'hidden'} justify-between items-center w-full md:flex md:w-auto md:order-1`}>
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
            <li>
              <Link to="/" className="flex items-center py-2 pr-4 pl-3 text-brand-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-brand-600 md:p-0">
                <Home className="h-4 w-4 mr-2 md:hidden" /> Home
              </Link>
            </li>
            <li>
              <Link to="/features" className="flex items-center py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-brand-600 md:p-0">
                <Star className="h-4 w-4 mr-2 md:hidden" /> Features
              </Link>
            </li>
            <li>
              <Link to="/dashboard/research" className="flex items-center py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-brand-600 md:p-0">
                <Activity className="h-4 w-4 mr-2 md:hidden" /> Research
              </Link>
            </li>
            <li>
              <Link to="/dashboard/briefs" className="flex items-center py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-brand-600 md:p-0">
                <Database className="h-4 w-4 mr-2 md:hidden" /> Content Briefs
              </Link>
            </li>
            <li>
              <Link to="/dashboard/shopify" className="flex items-center py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-brand-600 md:p-0">
                <ShoppingBag className="h-4 w-4 mr-2 md:hidden" /> Shopify
              </Link>
            </li>
            <div className="flex items-center">
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/pricing">Pricing</Link>
              </Button>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

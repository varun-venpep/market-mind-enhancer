
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
  User,
  LogOut
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPro } = useSubscription();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-2.5">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center flex-shrink-0 pr-14">
          <span className="self-center text-xl font-bold whitespace-nowrap gradient-text">MarketMind</span>
        </Link>
        
        <div className="flex items-center md:order-2">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              {isPro && (
                <Badge className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
                  Pro
                </Badge>
              )}
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: "h-8 w-8",
                    userButtonTrigger: "h-8 w-8"
                  }
                }}
                afterSignOutUrl="/"
                userProfileMode="navigation"
                userProfileUrl="/settings"
              />
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
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        <div 
          id="mobile-menu" 
          className={`${isOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1 md:flex-grow flex-col md:flex-row items-start md:items-center`}
        >
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0 md:flex-wrap">
            <li>
              <Link to="/" className={cn(
                "block py-2 px-3 rounded md:p-0",
                location.pathname === '/' 
                  ? 'text-brand-600 dark:text-brand-400 md:bg-transparent md:font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent md:hover:text-brand-600'
              )}>
                <Home className="h-4 w-4 mr-2 inline md:hidden" /> Home
              </Link>
            </li>
            <li>
              <Link to="/features" className={cn(
                "block py-2 px-3 rounded md:p-0",
                location.pathname === '/features' 
                  ? 'text-brand-600 dark:text-brand-400 md:bg-transparent md:font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent md:hover:text-brand-600'
              )}>
                <Star className="h-4 w-4 mr-2 inline md:hidden" /> Features
              </Link>
            </li>
            <li>
              <Link to="/dashboard/research" className={cn(
                "block py-2 px-3 rounded md:p-0",
                location.pathname === '/dashboard/research' 
                  ? 'text-brand-600 dark:text-brand-400 md:bg-transparent md:font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent md:hover:text-brand-600'
              )}>
                <Activity className="h-4 w-4 mr-2 inline md:hidden" /> Research
              </Link>
            </li>
            <li>
              <Link to="/dashboard/briefs" className={cn(
                "block py-2 px-3 rounded md:p-0",
                location.pathname === '/dashboard/briefs' 
                  ? 'text-brand-600 dark:text-brand-400 md:bg-transparent md:font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent md:hover:text-brand-600'
              )}>
                <Database className="h-4 w-4 mr-2 inline md:hidden" /> Content Briefs
              </Link>
            </li>
            <li>
              <Link to="/dashboard/shopify" className={cn(
                "block py-2 px-3 rounded md:p-0",
                location.pathname === '/dashboard/shopify' 
                  ? 'text-brand-600 dark:text-brand-400 md:bg-transparent md:font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent md:hover:text-brand-600'
              )}>
                <ShoppingBag className="h-4 w-4 mr-2 inline md:hidden" /> Shopify
              </Link>
            </li>
            <li className="md:hidden">
              <Link to="/pricing" className={cn(
                "block py-2 px-3 rounded",
                location.pathname === '/pricing' 
                  ? 'text-brand-600 dark:text-brand-400 md:bg-transparent md:font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent md:hover:text-brand-600'
              )}>
                Pricing
              </Link>
            </li>
            {isSignedIn && (
              <li className="md:hidden">
                <SignOutButton>
                  <button className="flex items-center py-2 px-3 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </button>
                </SignOutButton>
              </li>
            )}
          </ul>
          <div className="hidden md:flex items-center ml-auto">
            <Button variant="ghost" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

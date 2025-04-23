
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Home,
  Star,
  LogIn,
  LayoutDashboard,
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
import { cn } from "@/lib/utils";

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
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-gray-800 px-4 py-2.5">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center flex-shrink-0 pr-14">
          <span className="self-center text-xl font-bold whitespace-nowrap gradient-text">MarketMind</span>
        </Link>
        
        <div className="flex items-center md:order-2 gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {isPro && (
                <Badge className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
                  Pro
                </Badge>
              )}
              <Button variant="default" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
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
              <Button variant="ghost" size="sm" asChild className="text-white">
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
            className="inline-flex items-center p-2 ml-3 text-sm text-white rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                  ? 'text-brand-400 md:bg-transparent md:font-semibold' 
                  : 'text-gray-300 hover:bg-gray-800 md:hover:bg-transparent md:hover:text-brand-400'
              )}>
                <Home className="h-4 w-4 mr-2 inline md:hidden" /> Home
              </Link>
            </li>
            <li>
              <Link to="/features" className={cn(
                "block py-2 px-3 rounded md:p-0",
                location.pathname === '/features' 
                  ? 'text-brand-400 md:bg-transparent md:font-semibold' 
                  : 'text-gray-300 hover:bg-gray-800 md:hover:bg-transparent md:hover:text-brand-400'
              )}>
                <Star className="h-4 w-4 mr-2 inline md:hidden" /> Features
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

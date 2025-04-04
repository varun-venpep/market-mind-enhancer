
import { useState } from "react";
import { Link } from "react-router-dom";
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
  ShoppingBag
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPro } = useSubscription();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-2.5">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-bold whitespace-nowrap gradient-text">MarketMind</span>
        </Link>
        
        <div className="flex items-center lg:order-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login"><LogIn className="h-4 w-4 mr-2" /> Log in</Link>
            </Button>
            <Button asChild className="gradient-button">
              <Link to="/signup">Sign up free</Link>
            </Button>
          </div>
          
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
              <Link to="/research" className="flex items-center py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-brand-600 md:p-0">
                <Activity className="h-4 w-4 mr-2 md:hidden" /> Research
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="flex items-center py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-brand-600 md:p-0">
                <Database className="h-4 w-4 mr-2 md:hidden" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/shopify" className="flex items-center py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-brand-600 md:p-0">
                <ShoppingBag className="h-4 w-4 mr-2 md:hidden" /> Shopify
              </Link>
            </li>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/pricing">Pricing</Link>
              </Button>
              
              {isPro && (
                <Badge className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
                  Pro
                </Badge>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

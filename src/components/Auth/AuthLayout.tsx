
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-0 left-0 w-full z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center">
            <span className="self-center text-xl font-bold whitespace-nowrap gradient-text">MarketMind</span>
          </Link>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md relative z-10">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl z-0"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-600/10 rounded-full blur-3xl z-0"></div>
          
          {/* Actual content */}
          <div className="relative z-20">
            {children}
          </div>
        </div>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} MarketMind. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;


import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center">
            <span className="self-center text-xl font-bold whitespace-nowrap gradient-text">MarketMind</span>
          </Link>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MarketMind. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;

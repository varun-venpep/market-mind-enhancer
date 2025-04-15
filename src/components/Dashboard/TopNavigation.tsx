
import React from "react";
import { Link } from "react-router-dom";
import { Book, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { navigationItems } from "./config/navigationConfig";
import { cn } from "@/lib/utils";

interface TopNavigationProps {
  currentPath: string;
  userEmail: string | undefined;
  onLogout: () => void;
  isMobile: boolean;
}

const TopNavigation = ({ currentPath, userEmail, onLogout, isMobile }: TopNavigationProps) => {
  const userInitials = userEmail
    ? userEmail.substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex items-center">
      {!isMobile && (
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
                currentPath === item.href && "bg-muted font-medium"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-md"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          {!isMobile && (
            <span className="text-sm font-medium">{userEmail}</span>
          )}
        </Link>
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopNavigation;

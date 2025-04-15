
import React from "react";
import { Link } from "react-router-dom";
import { Book, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { navigationItems, profileItems } from "./config/navigationConfig";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
  onLogout: () => void;
}

const MobileMenu = ({ isOpen, onOpenChange, currentPath, onLogout }: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 mr-2"
          onClick={() => onOpenChange(true)}
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
            onClick={() => onOpenChange(false)}
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
                currentPath === item.href && "bg-muted"
              )}
            >
              <item.icon className="h-5 w-5 mr-2" />
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
                currentPath === item.href && "bg-muted"
              )}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start py-2 px-3"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

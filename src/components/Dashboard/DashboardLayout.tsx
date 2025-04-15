
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import TopNavigation from "./TopNavigation";
import MobileMenu from "./MobileMenu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-2">
          {isMobile && (
            <MobileMenu
              isOpen={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              currentPath={location.pathname}
              onLogout={handleLogout}
            />
          )}
          <TopNavigation
            currentPath={location.pathname}
            userEmail={user?.email}
            onLogout={handleLogout}
            isMobile={isMobile}
          />
        </div>
      </header>
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900/50">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;


import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait until auth is no longer loading before making decisions
    if (!isLoading) {
      if (!user || !session) {
        // User is not authenticated
        console.log('User not authenticated, redirecting to', redirectTo);
        setIsAuthorized(false);
        
        // Only show the toast if we're not already on the login page
        if (location.pathname !== redirectTo && location.pathname !== '/signup') {
          toast.warning("Please sign in to access this page");
        }
        
        // Save the current path for redirecting back after login
        if (location.pathname !== redirectTo) {
          localStorage.setItem('redirectAfterLogin', location.pathname);
        }
        
        navigate(redirectTo);
      } else {
        // User is authenticated
        setIsAuthorized(true);
        
        // Check if we need to redirect after login
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath && location.pathname === redirectTo) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        }
      }
    }
  }, [user, isLoading, navigate, redirectTo, location.pathname, session]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{isAuthorized ? children : null}</>;
}

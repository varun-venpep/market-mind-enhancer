
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
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
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Only check when auth is fully loaded
    if (isLoaded && !isSignedIn) {
      // User is not authenticated
      console.log('User not authenticated, redirecting to', redirectTo);
      
      // Only show the toast if we're not already on the login page
      if (location.pathname !== redirectTo && location.pathname !== '/signup') {
        toast.warning("Please sign in to access this page");
      }
      
      // Save the current path for redirecting back after login
      if (location.pathname !== redirectTo) {
        localStorage.setItem('redirectAfterLogin', location.pathname);
      }
      
      navigate(redirectTo);
    } else if (isLoaded && isSignedIn) {
      // User is authenticated - check for redirect after login
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath && location.pathname === redirectTo) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }

      // Initialize session token for API calls if needed
      const initializeAuthToken = async () => {
        try {
          const token = await getToken();
          if (token) {
            // Store token for API calls if needed
            localStorage.setItem('authToken', token);
          }
        } catch (error) {
          console.error('Failed to get auth token:', error);
        }
      };
      
      initializeAuthToken();
    }
  }, [isLoaded, isSignedIn, navigate, redirectTo, location.pathname, getToken]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return <>{isSignedIn ? children : null}</>;
}

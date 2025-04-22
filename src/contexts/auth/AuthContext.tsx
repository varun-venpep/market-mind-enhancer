
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from './useAuthSession';
import { handleLogin, handleSignIn, handleSignUp, handleLogout, handleGoogleAuth } from './authOperations';
import type { AuthContextType } from './types';
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  login: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signUpWithGoogle: async () => ({ error: null }),
  logout: async () => {},
  isLoading: true,
  refreshSession: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    session,
    setSession,
    user,
    setUser,
    isLoading,
    setIsLoading,
    authInitialized,
    setAuthInitialized,
    sessionRefreshTimer,
    setSessionRefreshTimer,
    authToastShown,
    setAuthToastShown,
    refreshSession
  } = useAuthSession();
  
  // Prevent multiple session refreshes happening at the same time
  const isRefreshingRef = useRef(false);
  // Track subscription to avoid memory leaks
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    // Enhanced session refresh timer with debounce protection
    const startSessionRefreshTimer = () => {
      if (sessionRefreshTimer) {
        clearInterval(sessionRefreshTimer);
      }
      
      const timer = setInterval(async () => {
        if (session && !isLoading && !isRefreshingRef.current) {
          isRefreshingRef.current = true;
          try {
            await refreshSession();
          } finally {
            isRefreshingRef.current = false;
          }
        }
      }, 4 * 60 * 1000); // Increase interval slightly to 4 minutes
      
      setSessionRefreshTimer(timer);
      return timer;
    };

    // Set up auth state change listener
    const setupAuthListener = () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
        console.log('Auth state changed:', event, !!currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          localStorage.setItem('supabase.auth.token', JSON.stringify(currentSession));
          
          if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && !authToastShown) {
            if (authInitialized) {
              toast.success("Successfully signed in");
              setAuthToastShown(true);
            }
          }
          
          startSessionRefreshTimer();
        } else {
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            localStorage.removeItem('supabase.auth.token');
            
            if (authInitialized) {
              toast.info("You have been signed out");
              setAuthToastShown(false);
            }
            
            if (sessionRefreshTimer) {
              clearInterval(sessionRefreshTimer);
              setSessionRefreshTimer(null);
            }
          }
        }
      });
      
      subscriptionRef.current = subscription;
      return subscription;
    };

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Set up auth listener first
        const subscription = setupAuthListener();
        
        // Then get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          console.log("Initial session found");
          setSession(initialSession);
          setUser(initialSession.user);
          localStorage.setItem('supabase.auth.token', JSON.stringify(initialSession));
          setAuthToastShown(true);
          startSessionRefreshTimer();
        } else {
          console.log("No initial session, checking localStorage");
          const localSession = localStorage.getItem('supabase.auth.token');
          if (localSession) {
            try {
              const parsedSession = JSON.parse(localSession);
              if (parsedSession.refresh_token) {
                console.log("Found local session, attempting refresh");
                const { data: refreshData } = await supabase.auth.refreshSession({
                  refresh_token: parsedSession.refresh_token,
                });
                
                if (refreshData.session) {
                  console.log("Session refreshed successfully from localStorage");
                  setSession(refreshData.session);
                  setUser(refreshData.session.user);
                  localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
                  setAuthToastShown(true);
                  startSessionRefreshTimer();
                } else {
                  console.log("Failed to refresh session, clearing local data");
                  localStorage.removeItem('supabase.auth.token');
                  setSession(null);
                  setUser(null);
                }
              }
            } catch (error) {
              console.error('Error restoring local session:', error);
              localStorage.removeItem('supabase.auth.token');
              setSession(null);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (sessionRefreshTimer) {
        clearInterval(sessionRefreshTimer);
      }
    };
  }, []);

  // Memoized auth context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    session,
    user,
    login: handleLogin,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: () => handleGoogleAuth('signin'),
    signUpWithGoogle: () => handleGoogleAuth('signup'),
    logout: handleLogout,
    isLoading: isLoading || !authInitialized,
    refreshSession,
  }), [session, user, isLoading, authInitialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

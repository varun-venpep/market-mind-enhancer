
import React, { createContext, useContext } from 'react';
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

  React.useEffect(() => {
    const startSessionRefreshTimer = () => {
      if (sessionRefreshTimer) {
        clearInterval(sessionRefreshTimer);
      }
      
      const timer = setInterval(async () => {
        if (session && !isLoading) {
          await refreshSession();
        }
      }, 3 * 60 * 1000);
      
      setSessionRefreshTimer(timer);
      return timer;
    };

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

    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        localStorage.setItem('supabase.auth.token', JSON.stringify(initialSession));
        setAuthToastShown(true);
        startSessionRefreshTimer();
      } else {
        const localSession = localStorage.getItem('supabase.auth.token');
        if (localSession) {
          try {
            const parsedSession = JSON.parse(localSession);
            if (parsedSession.refresh_token) {
              const { data: refreshData } = await supabase.auth.refreshSession({
                refresh_token: parsedSession.refresh_token,
              });
              
              if (refreshData.session) {
                setSession(refreshData.session);
                setUser(refreshData.session.user);
                localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
                setAuthToastShown(true);
                startSessionRefreshTimer();
              } else {
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
      
      setIsLoading(false);
      setAuthInitialized(true);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      if (sessionRefreshTimer) {
        clearInterval(sessionRefreshTimer);
      }
    };
  }, []);

  const value = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

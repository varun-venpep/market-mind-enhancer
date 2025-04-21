
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface AuthResult {
  error: AuthError | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signUpWithGoogle: () => Promise<AuthResult>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshSession: () => Promise<boolean>;
}

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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [sessionRefreshTimer, setSessionRefreshTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  
  // Only show one toast per session
  const [authToastShown, setAuthToastShown] = useState(false);

  // Start session refresh timer
  const startSessionRefreshTimer = () => {
    // Clear existing timer if any
    if (sessionRefreshTimer) {
      clearInterval(sessionRefreshTimer);
    }
    
    // Create new timer - refresh every 5 minutes
    const timer = setInterval(async () => {
      if (session) {
        try {
          console.log('Auto-refreshing session...');
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error('Error auto-refreshing session:', error);
          } else if (data.session) {
            console.log('Session auto-refreshed successfully');
            setSession(data.session);
            setUser(data.session.user);
            localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
          }
        } catch (error) {
          console.error('Exception in auto-refresh session:', error);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    setSessionRefreshTimer(timer);
    return timer;
  };

  // Configure persistent session
  useEffect(() => {
    // Set session persistence to localStorage for better persistence
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, !!currentSession);
      
      // Update state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Store session data in localStorage for backup persistence
      if (currentSession) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(currentSession));
        
        // Show success toast only once per session and only for explicit sign-ins
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && !authToastShown) {
          // Avoid showing toast on page refresh or initial load
          if (authInitialized) {
            toast.success("Successfully signed in");
            setAuthToastShown(true);
          }
        }
        
        // Start the session refresh timer
        startSessionRefreshTimer();
      } else {
        localStorage.removeItem('supabase.auth.token');
        
        // Show sign out toast only for explicit sign outs
        if (event === 'SIGNED_OUT' && authInitialized) {
          toast.info("You have been signed out");
          setAuthToastShown(false);
        }
        
        // Clear the session refresh timer
        if (sessionRefreshTimer) {
          clearInterval(sessionRefreshTimer);
          setSessionRefreshTimer(null);
        }
      }
    });

    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Initial session check:', !!data.session);
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // If we have a valid session at initialization, mark as shown and start refresh timer
        if (data.session) {
          setAuthToastShown(true);
          startSessionRefreshTimer();
        }
        
        // If no session from API but we have one in localStorage, try to restore it
        if (!data.session) {
          const localSession = localStorage.getItem('supabase.auth.token');
          if (localSession) {
            console.log('Found local session data, attempting to restore');
            try {
              const parsedSession = JSON.parse(localSession);
              // Attempt to refresh the session
              const { data: refreshData } = await supabase.auth.refreshSession({
                refresh_token: parsedSession.refresh_token,
              });
              
              if (refreshData.session) {
                console.log('Successfully restored session from localStorage');
                setSession(refreshData.session);
                setUser(refreshData.session.user);
                setAuthToastShown(true);
                startSessionRefreshTimer();
              } else {
                // Invalid local session, remove it
                localStorage.removeItem('supabase.auth.token');
              }
            } catch (error) {
              console.error('Error restoring local session:', error);
              localStorage.removeItem('supabase.auth.token');
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
      if (sessionRefreshTimer) {
        clearInterval(sessionRefreshTimer);
      }
    };
  }, [authToastShown, authInitialized]);

  const refreshSession = async (): Promise<boolean> => {
    try {
      console.log('Manually refreshing session...');
      
      // First try with the current session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Failed to refresh session with current token, trying localStorage backup:', error);
        
        // Try with localStorage backup
        const localSession = localStorage.getItem('supabase.auth.token');
        if (localSession) {
          try {
            const parsedSession = JSON.parse(localSession);
            if (parsedSession.refresh_token) {
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
                refresh_token: parsedSession.refresh_token,
              });
              
              if (refreshError) {
                console.error('Failed to refresh with localStorage token:', refreshError);
                return false;
              }
              
              if (refreshData.session) {
                console.log('Session refreshed successfully from localStorage');
                setSession(refreshData.session);
                setUser(refreshData.session.user);
                localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
                return true;
              }
            }
          } catch (localError) {
            console.error('Error using localStorage token:', localError);
          }
        }
        return false;
      }
      
      if (data.session) {
        console.log('Session refreshed successfully');
        setSession(data.session);
        setUser(data.session.user);
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        return true;
      }
      
      console.warn('No session returned from refresh');
      return false;
    } catch (error) {
      console.error('Exception in refreshSession:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      console.log('Starting Google sign-in process...');
      
      // Get origin for proper redirect
      const origin = window.location.origin;
      const redirectTo = `${origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            // For sign-in flow, use select_account to force account selection
            // This ensures users always select which account to use
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });
      
      if (error) {
        console.error('Google auth error:', error);
        toast.error(`Authentication failed: ${error.message}`);
      }
      
      return { error };
    } catch (err) {
      console.error('Unexpected error during Google auth:', err);
      toast.error('An unexpected error occurred during authentication');
      return { error: err as AuthError };
    }
  };
  
  const signUpWithGoogle = async (): Promise<AuthResult> => {
    try {
      console.log('Starting Google sign-up process...');
      
      // Get origin for proper redirect
      const origin = window.location.origin;
      const redirectTo = `${origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            // For sign-up, always ask for Google account selection and consent
            prompt: 'consent select_account',
            access_type: 'offline'
          }
        }
      });
      
      if (error) {
        console.error('Google auth error:', error);
        toast.error(`Authentication failed: ${error.message}`);
      }
      
      return { error };
    } catch (err) {
      console.error('Unexpected error during Google auth:', err);
      toast.error('An unexpected error occurred during authentication');
      return { error: err as AuthError };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear localStorage backup
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('redirectAfterLogin');
      // We don't need to manually update state here as the onAuthStateChange handler will do it
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    login,
    signIn,
    signUp,
    signInWithGoogle,
    signUpWithGoogle,
    logout,
    isLoading: isLoading || !authInitialized,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

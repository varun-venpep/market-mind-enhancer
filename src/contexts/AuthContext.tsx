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
  
  const [authToastShown, setAuthToastShown] = useState(false);
  const [isActivelyRefreshing, setIsActivelyRefreshing] = useState(false);

  const startSessionRefreshTimer = () => {
    if (sessionRefreshTimer) {
      clearInterval(sessionRefreshTimer);
    }
    
    const timer = setInterval(async () => {
      if (session && !isActivelyRefreshing) {
        try {
          setIsActivelyRefreshing(true);
          console.log('Auto-refreshing session...');
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error('Error auto-refreshing session:', error);
            const localSession = localStorage.getItem('supabase.auth.token');
            if (localSession) {
              try {
                const parsedSession = JSON.parse(localSession);
                if (parsedSession.refresh_token) {
                  console.log('Trying fallback refresh with stored token');
                  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
                    refresh_token: parsedSession.refresh_token,
                  });
                  
                  if (!refreshError && refreshData.session) {
                    console.log('Fallback refresh successful');
                    setSession(refreshData.session);
                    setUser(refreshData.session.user);
                    localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
                  }
                }
              } catch (e) {
                console.error('Error in fallback refresh:', e);
              }
            }
          } else if (data.session) {
            console.log('Session auto-refreshed successfully');
            setSession(data.session);
            setUser(data.session.user);
            localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
          }
        } catch (error) {
          console.error('Exception in auto-refresh session:', error);
        } finally {
          setIsActivelyRefreshing(false);
        }
      }
    }, 3 * 60 * 1000);
    
    setSessionRefreshTimer(timer);
    return timer;
  };

  useEffect(() => {
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

    const MAX_INIT_RETRIES = 3;
    
    const initializeAuth = async () => {
      for (let attempt = 0; attempt < MAX_INIT_RETRIES; attempt++) {
        try {
          if (attempt > 0) {
            console.log(`Auth initialization attempt ${attempt + 1}/${MAX_INIT_RETRIES}`);
            await new Promise(resolve => setTimeout(resolve, attempt * 500));
          }
          
          const { data } = await supabase.auth.getSession();
          console.log('Initial session check:', !!data.session);
          
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
            
            localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
            setAuthToastShown(true);
            startSessionRefreshTimer();
            
            break;
          }
          
          if (attempt === MAX_INIT_RETRIES - 1 && !data.session) {
            const localSession = localStorage.getItem('supabase.auth.token');
            if (localSession) {
              console.log('Found local session data, attempting to restore');
              try {
                const parsedSession = JSON.parse(localSession);
                if (parsedSession.refresh_token) {
                  const { data: refreshData } = await supabase.auth.refreshSession({
                    refresh_token: parsedSession.refresh_token,
                  });
                  
                  if (refreshData.session) {
                    console.log('Successfully restored session from localStorage');
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
            } else {
              setSession(null);
              setUser(null);
            }
          }
        } catch (error) {
          console.error(`Error checking session (attempt ${attempt + 1}):`, error);
          if (attempt === MAX_INIT_RETRIES - 1) {
            setSession(null);
            setUser(null);
          }
        }
      }
      
      setIsLoading(false);
      setAuthInitialized(true);
    };

    initializeAuth();
    
    const sessionValidityCheck = setInterval(() => {
      if (!isActivelyRefreshing) {
        refreshSession();
      }
    }, 5 * 60 * 1000);
    
    return () => {
      subscription.unsubscribe();
      if (sessionRefreshTimer) {
        clearInterval(sessionRefreshTimer);
      }
      clearInterval(sessionValidityCheck);
    };
  }, [authToastShown, authInitialized, sessionRefreshTimer]);

  const refreshSession = async (): Promise<boolean> => {
    if (isActivelyRefreshing) {
      console.log('Session refresh already in progress');
      return true;
    }
    
    setIsActivelyRefreshing(true);
    
    try {
      console.log('Manually refreshing session...');
      
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (!error && data.session) {
            console.log('Session refreshed successfully');
            setSession(data.session);
            setUser(data.session.user);
            localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
            setIsActivelyRefreshing(false);
            return true;
          }
          
          console.warn('Failed to refresh with current token, trying localStorage backup');
          
          const localSession = localStorage.getItem('supabase.auth.token');
          if (localSession) {
            try {
              const parsedSession = JSON.parse(localSession);
              if (parsedSession.refresh_token) {
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
                  refresh_token: parsedSession.refresh_token,
                });
                
                if (!refreshError && refreshData.session) {
                  console.log('Session refreshed successfully from localStorage');
                  setSession(refreshData.session);
                  setUser(refreshData.session.user);
                  localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
                  setIsActivelyRefreshing(false);
                  return true;
                }
                
                console.error('Failed to refresh with localStorage token:', refreshError);
              }
            } catch (localError) {
              console.error('Error using localStorage token:', localError);
              localStorage.removeItem('supabase.auth.token');
            }
          }
          
          if (attempt < 2) {
            console.log(`Retry attempt ${attempt + 1}/3...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (attemptError) {
          console.error(`Exception in refreshSession attempt ${attempt + 1}:`, attemptError);
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      console.warn('No session returned from refresh after all attempts');
      setIsActivelyRefreshing(false);
      return false;
    } catch (error) {
      console.error('Exception in refreshSession:', error);
      setIsActivelyRefreshing(false);
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
      
      const origin = window.location.origin;
      const redirectTo = `${origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
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
      
      const origin = window.location.origin;
      const redirectTo = `${origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
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
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('redirectAfterLogin');
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

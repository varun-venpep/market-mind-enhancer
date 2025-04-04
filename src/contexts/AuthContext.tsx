
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
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  login: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  logout: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Configure persistent session
  useEffect(() => {
    // Set session persistence to localStorage for better persistence
    supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, !!currentSession);
      
      // Only update synchronously in the callback
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Store session data in localStorage for backup persistence
      if (currentSession) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(currentSession));
      } else {
        localStorage.removeItem('supabase.auth.token');
      }
      
      // If user signs in, show a success toast
      if (event === 'SIGNED_IN') {
        toast.success("Successfully signed in");
      }
      
      // If user signs out, show info toast
      if (event === 'SIGNED_OUT') {
        toast.info("You have been signed out");
      }
    });

    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Initial session check:', !!data.session);
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
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
    
    // Setup periodic session refresh (every 10 minutes)
    const refreshInterval = setInterval(async () => {
      if (session) {
        try {
          console.log('Refreshing session...');
          const { data, error } = await supabase.auth.refreshSession();
          if (error) throw error;
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
            console.log('Session refreshed successfully');
          }
        } catch (error) {
          console.error('Error refreshing session:', error);
        }
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    return { error };
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
    logout,
    isLoading: isLoading || !authInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

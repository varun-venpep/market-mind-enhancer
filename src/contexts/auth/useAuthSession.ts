
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [sessionRefreshTimer, setSessionRefreshTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isActivelyRefreshing, setIsActivelyRefreshing] = useState(false);
  const [authToastShown, setAuthToastShown] = useState(false);

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
              }
            } catch (localError) {
              console.error('Error using localStorage token:', localError);
              localStorage.removeItem('supabase.auth.token');
            }
          }
          
          if (attempt < 2) {
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
      return false;
    } catch (error) {
      console.error('Exception in refreshSession:', error);
      return false;
    } finally {
      setIsActivelyRefreshing(false);
    }
  };

  return {
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
    isActivelyRefreshing,
    setIsActivelyRefreshing,
    authToastShown,
    setAuthToastShown,
    refreshSession
  };
}

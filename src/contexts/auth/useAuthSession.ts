
import { useState, useEffect, useRef, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [sessionRefreshTimer, setSessionRefreshTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const isActivelyRefreshingRef = useRef(false);
  const [authToastShown, setAuthToastShown] = useState(false);
  const refreshAttemptsRef = useRef(0);

  const resetRefreshState = useCallback(() => {
    isActivelyRefreshingRef.current = false;
    refreshAttemptsRef.current = 0;
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (isActivelyRefreshingRef.current) {
      console.log('Session refresh already in progress');
      return true;
    }
    
    isActivelyRefreshingRef.current = true;
    
    try {
      console.log('Manually refreshing session...');
      refreshAttemptsRef.current++;
      
      // Implement exponential backoff for retries
      const backoffDelay = refreshAttemptsRef.current > 1 ? 
        Math.min(1000 * Math.pow(2, refreshAttemptsRef.current - 1), 8000) : 0;
      
      if (backoffDelay > 0) {
        console.log(`Backoff delay: ${backoffDelay}ms before attempt ${refreshAttemptsRef.current}`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
      
      // Try direct session refresh first
      const { data, error } = await supabase.auth.refreshSession();
      
      if (!error && data.session) {
        console.log('Session refreshed successfully');
        setSession(data.session);
        setUser(data.session.user);
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        resetRefreshState();
        return true;
      }
      
      console.log('Direct refresh failed, trying with localStorage token');
      // Try with localStorage backup
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
              resetRefreshState();
              return true;
            }
          }
        } catch (localError) {
          console.error('Error using localStorage token:', localError);
          localStorage.removeItem('supabase.auth.token');
        }
      }
      
      // If refresh attempts > 3 and we still don't have a session, it's likely the user is truly logged out
      if (refreshAttemptsRef.current >= 3) {
        console.log('Max refresh attempts reached, clearing session state');
        setSession(null);
        setUser(null);
        localStorage.removeItem('supabase.auth.token');
        resetRefreshState();
        return false;
      }
      
      // If we have fewer than 3 attempts, we'll try again on the next call
      console.warn('Session refresh failed, will retry on next attempt');
      return false;
    } catch (error) {
      console.error('Exception in refreshSession:', error);
      return false;
    } finally {
      isActivelyRefreshingRef.current = false;
    }
  }, [resetRefreshState]);

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
    isActivelyRefreshing: isActivelyRefreshingRef.current,
    authToastShown,
    setAuthToastShown,
    refreshSession
  };
}

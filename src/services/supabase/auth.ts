
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Maximum number of retries for token refresh
const MAX_REFRESH_RETRIES = 3;
// Flag to track ongoing refresh operations to prevent duplication
let isRefreshingSession = false;
// Timestamp of last successful refresh to prevent too frequent refreshes
let lastSuccessfulRefresh = 0;

export async function getAuthToken(): Promise<string | null> {
  try {
    // Prevent excessive token refreshes
    const now = Date.now();
    if (now - lastSuccessfulRefresh < 10000) { // Don't refresh more than once every 10 seconds
      console.log('Token was refreshed recently, using cached session');
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        return data.session.access_token;
      }
    }
    
    // First check if we're already refreshing to avoid infinite loops
    if (isRefreshingSession) {
      console.log('Session refresh already in progress, waiting...');
      let waitAttempts = 0;
      while (isRefreshingSession && waitAttempts < 5) {
        await new Promise(resolve => setTimeout(resolve, 300));
        waitAttempts++;
      }
      // After waiting, try to get the session directly
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        return data.session.access_token;
      }
    }
    
    // First check the existing session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting auth session:', error);
      return await refreshSessionFromLocalStorage();
    }
    
    if (!data.session) {
      console.warn('No active session found');
      return await refreshSessionFromLocalStorage();
    }
    
    // Check token expiration to see if we need to refresh
    const expiresAt = data.session.expires_at;
    if (expiresAt) {
      const expiresAtDate = new Date(expiresAt * 1000);
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      
      if (expiresAtDate < fiveMinutesFromNow) {
        console.log('Token expires soon, refreshing...');
        await refreshSession();
        // Get the refreshed session
        const { data: refreshedData } = await supabase.auth.getSession();
        if (refreshedData.session?.access_token) {
          return refreshedData.session.access_token;
        }
      }
    }
    
    // Store session data for backup
    if (data.session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      lastSuccessfulRefresh = Date.now();
    }
    
    console.log('Returning session access token:', data.session?.access_token ? 'present' : 'missing');
    return data.session?.access_token || null;
  } catch (error) {
    console.error('Exception in getAuthToken:', error);
    return null;
  }
}

async function refreshSessionFromLocalStorage(): Promise<string | null> {
  try {
    const localSession = localStorage.getItem('supabase.auth.token');
    if (localSession) {
      try {
        const parsedSession = JSON.parse(localSession);
        if (parsedSession.refresh_token) {
          console.log('Attempting to refresh session with stored token');
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: parsedSession.refresh_token,
          });
          
          if (refreshError) {
            console.error('Error refreshing session:', refreshError);
            return null;
          }
          
          if (refreshData.session) {
            console.log('Session refreshed successfully from localStorage');
            localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
            lastSuccessfulRefresh = Date.now();
            return refreshData.session.access_token;
          }
        }
      } catch (parseError) {
        console.error('Error parsing local session:', parseError);
        localStorage.removeItem('supabase.auth.token');
      }
    }
    return null;
  } catch (refreshError) {
    console.error('Error trying to refresh token:', refreshError);
    return null;
  }
}

export async function refreshSession(): Promise<boolean> {
  // If we refreshed successfully recently, avoid doing it again
  const now = Date.now();
  if (now - lastSuccessfulRefresh < 10000) { // Don't refresh more than once every 10 seconds
    console.log('Session was refreshed recently, skipping');
    return true;
  }
  
  // Don't attempt refresh if one is already in progress
  if (isRefreshingSession) {
    console.log('Session refresh already in progress, waiting...');
    let waitAttempts = 0;
    while (isRefreshingSession && waitAttempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 300));
      waitAttempts++;
    }
    // If we waited and it's still refreshing, just return true to avoid blocking
    if (isRefreshingSession) {
      return true;
    }
  }
  
  isRefreshingSession = true;
  
  try {
    console.log('Attempting to refresh session...');
    
    // Try with exponential backoff for reliability
    for (let attempt = 0; attempt < MAX_REFRESH_RETRIES; attempt++) {
      if (attempt > 0) {
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        console.log(`Refresh attempt ${attempt + 1}/${MAX_REFRESH_RETRIES}, delay: ${backoffDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (!error && data.session) {
        console.log('Session refreshed successfully');
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        lastSuccessfulRefresh = Date.now();
        isRefreshingSession = false;
        return true;
      }
      
      console.log('Direct refresh attempt failed, trying localStorage backup');
      
      // Try with localStorage backup if current session fails
      const result = await refreshSessionFromLocalStorage();
      if (result) {
        console.log('Session refreshed successfully from localStorage');
        isRefreshingSession = false;
        return true;
      }
    }
    
    console.error(`Failed to refresh session after ${MAX_REFRESH_RETRIES} attempts`);
    isRefreshingSession = false;
    return false;
  } catch (error) {
    console.error('Exception in refreshSession:', error);
    isRefreshingSession = false;
    return false;
  }
}

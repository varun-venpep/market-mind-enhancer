
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Maximum number of retries for token refresh
const MAX_REFRESH_RETRIES = 3;
// Flag to track ongoing refresh operations to prevent duplication
let isRefreshingSession = false;

export async function getAuthToken(): Promise<string | null> {
  try {
    // First check if we're already refreshing to avoid infinite loops
    if (isRefreshingSession) {
      console.log('Session refresh already in progress, waiting...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // First check the existing session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting auth session:', error);
      return null;
    }
    
    if (!data.session) {
      console.warn('No active session found');
      return await refreshSessionFromLocalStorage();
    }
    
    // Store session data for backup
    localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
    return data.session.access_token || null;
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
            console.log('Session refreshed successfully');
            localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
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
  // Don't attempt refresh if one is already in progress
  if (isRefreshingSession) {
    console.log('Session refresh already in progress, waiting...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
  
  isRefreshingSession = true;
  
  try {
    console.log('Attempting to refresh session...');
    
    // Try with exponential backoff for reliability
    for (let attempt = 0; attempt < MAX_REFRESH_RETRIES; attempt++) {
      if (attempt > 0) {
        console.log(`Refresh attempt ${attempt + 1}/${MAX_REFRESH_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (!error && data.session) {
        console.log('Session refreshed successfully');
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        isRefreshingSession = false;
        return true;
      }
      
      // Try with localStorage backup if current session fails
      const result = await refreshSessionFromLocalStorage();
      if (result) {
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

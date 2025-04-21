
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function getAuthToken(): Promise<string | null> {
  try {
    // First check the existing session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting auth session:', error);
      return null;
    }
    
    if (!data.session) {
      console.warn('No active session found');
      
      // Try to refresh the session if we have a refresh token in localStorage
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
                // Store session data for backup
                localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
                return refreshData.session.access_token;
              }
            }
          } catch (parseError) {
            console.error('Error parsing local session:', parseError);
          }
        }
      } catch (refreshError) {
        console.error('Error trying to refresh token:', refreshError);
      }
      return null;
    }
    
    // Store session data for backup
    localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
    return data.session.access_token || null;
  } catch (error) {
    console.error('Exception in getAuthToken:', error);
    return null;
  }
}

export async function invokeFunction(functionName: string, payload: any): Promise<any> {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.error('Authentication required. Please sign in.');
      toast.error('Authentication required. Please sign in.');
      
      // Attempt to refresh the session one more time
      if (await refreshSession()) {
        const newToken = await getAuthToken();
        if (!newToken) {
          throw new Error('Authentication required');
        }
      } else {
        throw new Error('Authentication required');
      }
    }

    console.log(`Invoking function ${functionName}`);
    
    // Add a retry mechanism for token refresh issues
    let retries = 0;
    const maxRetries = 3;
    
    while (retries <= maxRetries) {
      try {
        const currentToken = await getAuthToken();
        if (!currentToken) {
          if (retries < maxRetries) {
            console.log(`No token available, refreshing session and trying again (${retries + 1}/${maxRetries})`);
            await refreshSession();
            retries++;
            continue;
          } else {
            throw new Error('Authentication required after multiple refresh attempts');
          }
        }
        
        const { data, error } = await supabase.functions.invoke(functionName, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          },
          body: payload
        });

        if (error) {
          // Check if it's an auth error
          if (error.message && (
            error.message.includes('401') || 
            error.message.includes('auth') || 
            error.message.includes('Missing authorization')
          )) {
            if (retries < maxRetries) {
              console.log(`Auth issue detected, refreshing session and trying again (${retries + 1}/${maxRetries})`);
              await refreshSession();
              retries++;
              continue;
            }
          }
          
          console.error(`Error invoking function ${functionName}:`, error);
          throw error;
        }

        return data;
      } catch (invokeError) {
        // Check if it looks like an auth error
        if (invokeError.message && (
          invokeError.message.includes('401') || 
          invokeError.message.includes('auth') || 
          invokeError.message.includes('Missing authorization')
        )) {
          if (retries < maxRetries) {
            console.log(`Auth issue detected in catch block, refreshing session and trying again (${retries + 1}/${maxRetries})`);
            await refreshSession();
            retries++;
            continue;
          }
        }
        throw invokeError;
      }
    }
    
    throw new Error(`Failed to invoke function ${functionName} after ${maxRetries} attempts`);
  } catch (error) {
    console.error(`Exception in invokeFunction ${functionName}:`, error);
    throw error;
  }
}

export function handleApiError(error: any, defaultMessage: string = 'An error occurred'): string {
  console.error('API Error:', error);
  
  if (error.message) {
    // If it's a standard Error object
    return error.message;
  } else if (error.error) {
    // If it's a Supabase error
    return error.error.message || error.error;
  } else if (typeof error === 'string') {
    // If it's a string
    return error;
  }
  
  // Default fallback
  return defaultMessage;
}

export async function refreshSession(): Promise<boolean> {
  try {
    console.log('Attempting to refresh session...');
    
    // First, try to refresh with the current session
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Failed to refresh session with current token:', error);
      
      // Try with localStorage backup if current session fails
      const localSession = localStorage.getItem('supabase.auth.token');
      if (localSession) {
        try {
          const parsedSession = JSON.parse(localSession);
          if (parsedSession.refresh_token) {
            console.log('Attempting to refresh with saved refresh token');
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
              refresh_token: parsedSession.refresh_token,
            });
            
            if (refreshError) {
              console.error('Failed to refresh with localStorage token:', refreshError);
              return false;
            }
            
            if (refreshData.session) {
              console.log('Session refreshed successfully from localStorage token');
              localStorage.setItem('supabase.auth.token', JSON.stringify(refreshData.session));
              return true;
            }
          }
        } catch (parseError) {
          console.error('Error parsing local session data:', parseError);
        }
      }
      return false;
    }
    
    if (data && data.session) {
      console.log('Session refreshed successfully');
      // Update localStorage backup to ensure we have the latest tokens
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      return true;
    } else {
      console.warn('Session refresh returned no session');
      return false;
    }
  } catch (error) {
    console.error('Exception in refreshSession:', error);
    return false;
  }
}


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthToken, refreshSession } from "./auth";

export async function invokeFunction(functionName: string, payload: any): Promise<any> {
  try {
    // Get a fresh token first
    const token = await getAuthToken();
    
    if (!token) {
      console.error('Authentication required for invoking function:', functionName);
      
      // Try to refresh the session
      const refreshed = await refreshSession();
      if (!refreshed) {
        toast.error('Authentication required. Please sign in again.');
        throw new Error('Authentication required');
      }
      
      // Get a new token after refresh
      const newToken = await getAuthToken();
      if (!newToken) {
        toast.error('Authentication failed. Please sign in again.');
        throw new Error('Authentication required after refresh attempt');
      }
      
      console.log(`Successfully refreshed token for function: ${functionName}`);
    }
    
    // Always get the latest token right before the request
    const currentToken = await getAuthToken();
    console.log(`Invoking function ${functionName} with auth token: ${currentToken ? 'present' : 'missing'}`);
    
    if (!currentToken) {
      toast.error('Session expired. Please sign in again.');
      throw new Error('Missing authentication token');
    }
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      headers: {
        Authorization: `Bearer ${currentToken}`
      },
      body: payload
    });

    if (error) {
      console.error(`Error invoking function ${functionName}:`, error);
      
      // If it looks like an auth error, try to refresh and retry once
      if (error.message && (error.message.includes('401') || 
                            error.message.includes('auth') || 
                            error.message.includes('authorization'))) {
        console.log('Auth issue detected, attempting refresh and retry...');
        
        const refreshed = await refreshSession();
        if (refreshed) {
          const retryToken = await getAuthToken();
          
          if (retryToken) {
            console.log('Session refreshed, retrying function call...');
            
            const { data: retryData, error: retryError } = await supabase.functions.invoke(functionName, {
              headers: {
                Authorization: `Bearer ${retryToken}`
              },
              body: payload
            });
            
            if (retryError) {
              console.error(`Error in retry of function ${functionName}:`, retryError);
              throw retryError;
            }
            
            return retryData;
          }
        }
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Exception in invokeFunction ${functionName}:`, error);
    throw error;
  }
}

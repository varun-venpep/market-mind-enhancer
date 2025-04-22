
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthToken, refreshSession } from "./auth";

export async function invokeFunction(functionName: string, payload: any): Promise<any> {
  try {
    console.log(`Preparing to invoke function ${functionName}`);
    
    // Get a fresh token first
    let token = await getAuthToken();
    
    if (!token) {
      console.error('No authentication token available for function:', functionName);
      
      // Try to refresh the session
      const refreshed = await refreshSession();
      if (!refreshed) {
        toast.error('Authentication required. Please sign in again.');
        throw new Error('Authentication required');
      }
      
      // Get a new token after refresh
      token = await getAuthToken();
      if (!token) {
        toast.error('Authentication failed. Please sign in again.');
        throw new Error('Authentication required after refresh attempt');
      }
      
      console.log(`Successfully refreshed token for function: ${functionName}`);
    }
    
    console.log(`Invoking function ${functionName} with auth token: ${token.substring(0, 10)}...`);
    
    // Make the request with the token
    const headers = {
      Authorization: `Bearer ${token}`
    };
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      headers,
      body: payload
    });

    if (error) {
      console.error(`Error invoking function ${functionName}:`, error);
      
      // If it looks like an auth error, try to refresh and retry once
      if (error.message && (error.message.includes('401') || 
                            error.message.includes('auth') || 
                            error.message.includes('authorization'))) {
        console.log('Auth issue detected, attempting refresh and retry...');
        
        // Force session refresh
        await refreshSession();
        const retryToken = await getAuthToken();
        
        if (retryToken) {
          console.log('Session refreshed, retrying function call with fresh token...');
          
          const retryHeaders = {
            Authorization: `Bearer ${retryToken}`
          };
          
          const { data: retryData, error: retryError } = await supabase.functions.invoke(functionName, {
            headers: retryHeaders,
            body: payload
          });
          
          if (retryError) {
            console.error(`Error in retry of function ${functionName}:`, retryError);
            throw retryError;
          }
          
          return retryData;
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

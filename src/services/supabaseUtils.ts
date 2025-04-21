
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getAuthToken = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Authentication error:', error);
      return null;
    }
    
    if (!data.session) {
      console.log('No active session found');
      return null;
    }
    
    return data.session.access_token;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

export const invokeFunction = async (functionName: string, payload: any) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.error('Authentication required for invoking function:', functionName);
      toast.error('Authentication required. Please sign in.');
      throw new Error('Authentication required');
    }
    
    console.log(`Invoking function ${functionName} with payload:`, payload);
    
    // Check if payload is valid
    if (typeof payload !== 'object') {
      console.error(`Invalid payload for function ${functionName}:`, payload);
      toast.error('Invalid request data format');
      throw new Error('Invalid payload: must be an object');
    }
    
    // Ensure the function is called with content-type application/json
    const response = await supabase.functions.invoke(functionName, {
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Log complete response for debugging
    console.log(`Complete response from ${functionName}:`, response);
    
    if (response.error) {
      // Extract status code for better diagnostics
      const statusCode = response.error.context?.status || 'unknown';
      console.error(`Error invoking function ${functionName} (Status: ${statusCode}):`, response.error);
      
      let errorMessage = response.error.message || 'Operation failed';
      if (response.error.context?.statusText) {
        errorMessage += ` (${response.error.context.statusText})`;
      }
      
      // Show a user-friendly error message based on function
      if (functionName === 'shopify-connect') {
        toast.error('Failed to connect Shopify store. Please check your credentials.');
      } else if (functionName === 'shopify-products') {
        toast.error('Could not load products. Please check your store connection or try again later.');
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
      
      throw new Error(`Function error (${statusCode}): ${errorMessage}`);
    }
    
    // Handle empty responses gracefully
    if (!response.data && functionName !== 'shopify-optimize' && functionName !== 'shopify-apply-optimization') {
      console.warn(`Function ${functionName} returned no data`);
      return { success: true, message: "Operation completed successfully" };
    }
    
    console.log(`Function ${functionName} response:`, response.data);
    return response.data || { success: true };
  } catch (error) {
    console.error(`Error invoking function ${functionName}:`, error);
    
    // Show a user-friendly error message
    if (functionName === 'shopify-connect') {
      toast.error('Failed to connect Shopify store. Please check your credentials and try again.');
    } else if (functionName === 'shopify-products') {
      toast.error('Could not load products. Please check your store connection or try again later.');
    } else {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to process request'}`);
    }
    
    throw error;
  }
};

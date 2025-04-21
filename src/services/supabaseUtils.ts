
import { supabase } from "@/integrations/supabase/client";

export const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

export const invokeFunction = async (functionName: string, payload: any) => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log(`Invoking function ${functionName} with payload:`, payload);
    const response = await supabase.functions.invoke(functionName, {
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`Function response:`, response);

    if (response.error) {
      console.error(`Error invoking function ${functionName}:`, response.error);
      throw response.error;
    }
    
    if (!response.data && functionName !== 'shopify-optimize') {
      console.error(`Function ${functionName} returned no data`);
      throw new Error(`${functionName} returned no data`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error invoking function ${functionName}:`, error);
    throw error;
  }
};

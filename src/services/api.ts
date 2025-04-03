
import { supabase } from '@/integrations/supabase/client';
import type { SEOAnalysisResult, ShopifyProduct, ShopifyStore } from '@/types/shopify';

// Define the interface for the response from fetchShopifyProducts
export interface ShopifyProductsResponse {
  products: ShopifyProduct[];
  page: number;
  limit: number;
  total: number;
}

export interface ShopifyCredentials {
  storeUrl: string;
  accessToken: string;
}

// Get the current session token
const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

// Create a function to invoke edge functions with proper authentication
const invokeFunction = async (functionName: string, payload: any) => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log(`Invoking function ${functionName} with payload:`, payload);
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log(`Function response:`, data);
    
    if (error) {
      console.error(`Error invoking function ${functionName}:`, error);
      throw error;
    }
    
    // Handle non-success response from the edge function
    if (data && data.error) {
      console.error(`Function ${functionName} returned an error:`, data.error);
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error(`Error invoking function ${functionName}:`, error);
    throw error;
  }
};

export async function getConnectedShopifyStores(): Promise<ShopifyStore[]> {
  try {
    const { data, error } = await supabase
      .from('shopify_stores')
      .select('*');
    
    if (error) {
      console.error('Error fetching Shopify stores:', error);
      throw error;
    }
    
    console.log('Fetched stores:', data);
    return data as ShopifyStore[];
  } catch (error) {
    console.error('Error fetching Shopify stores:', error);
    throw error;
  }
}

export async function disconnectShopifyStore(storeId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('shopify_stores')
      .delete()
      .eq('id', storeId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error disconnecting Shopify store:', error);
    throw error;
  }
}

export async function connectShopifyStore(credentials: ShopifyCredentials): Promise<ShopifyStore> {
  try {
    console.log('Connecting with credentials:', {
      storeUrl: credentials.storeUrl,
      accessToken: credentials.accessToken ? '***' : undefined
    });
    
    // Call the Supabase Edge Function to connect to Shopify
    const data = await invokeFunction('shopify-connect', credentials);
    
    if (!data.store) {
      throw new Error(data.error || 'Failed to connect to Shopify store');
    }
    
    return data.store as ShopifyStore;
  } catch (error) {
    console.error('Error connecting Shopify store:', error);
    throw error;
  }
}

export async function fetchShopifyProducts(storeId: string, page = 1, limit = 20): Promise<ShopifyProductsResponse> {
  try {
    // Call the Supabase Edge Function to fetch products
    const data = await invokeFunction('shopify-products', { storeId, page, limit });
    return data as ShopifyProductsResponse;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

export async function analyzeSEO(storeId: string, productId: string): Promise<SEOAnalysisResult> {
  try {
    // Call our Supabase Edge Function
    const data = await invokeFunction('shopify-seo', { storeId, productId });
    return data as SEOAnalysisResult;
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    throw error;
  }
}

export async function optimizeSEO(storeId: string, productId: string, optimizations: any[]) {
  try {
    // Call our Supabase Edge Function
    const data = await invokeFunction('shopify-optimize', { storeId, productId, optimizations });
    return data;
  } catch (error) {
    console.error('Error optimizing SEO:', error);
    throw error;
  }
}

export async function bulkOptimizeSEO(storeId: string) {
  try {
    // Call our Supabase Edge Function for bulk optimization
    const data = await invokeFunction('shopify-bulk-optimize', { storeId });
    return data;
  } catch (error) {
    console.error('Error running bulk SEO optimization:', error);
    throw error;
  }
}

export async function searchKeywords(keyword: string, options = {}) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const { data, error } = await supabase.functions.invoke('serpapi', {
      body: { keyword, ...options },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching keywords:', error);
    throw error;
  }
}

export default {
  getConnectedShopifyStores,
  disconnectShopifyStore,
  connectShopifyStore,
  fetchShopifyProducts,
  analyzeSEO,
  optimizeSEO,
  bulkOptimizeSEO,
  searchKeywords
};

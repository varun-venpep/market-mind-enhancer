import { supabase } from "@/integrations/supabase/client";
import { invokeFunction, handleApiError, refreshSession } from "../supabase";
import type { ShopifyStore } from '@/types/shopify';
import { toast } from "sonner";

export interface ShopifyCredentials {
  storeUrl: string;
  accessToken: string;
}

export async function getConnectedShopifyStores(): Promise<ShopifyStore[]> {
  try {
    console.log('Fetching connected Shopify stores');
    await refreshSession(); // Ensure the session is fresh
    
    const { data, error } = await supabase.from('shopify_stores').select('*');
    
    if (error) {
      console.error('Error fetching Shopify stores:', error);
      toast.error('Failed to load Shopify stores');
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No Shopify stores found');
      return [];
    }
    
    console.log('Fetched Shopify stores:', data.length);
    return data as ShopifyStore[];
  } catch (error) {
    console.error('Exception in getConnectedShopifyStores:', error);
    toast.error('Failed to load Shopify stores');
    throw error;
  }
}

export async function disconnectShopifyStore(storeId: string): Promise<void> {
  try {
    if (!storeId) {
      throw new Error('Store ID is required');
    }
    
    const { error } = await supabase.from('shopify_stores').delete().eq('id', storeId);
    
    if (error) {
      console.error('Error disconnecting Shopify store:', error);
      toast.error('Failed to disconnect store');
      throw error;
    }
    
    toast.success('Store disconnected successfully');
  } catch (error) {
    console.error('Exception in disconnectShopifyStore:', error);
    toast.error('Failed to disconnect store');
    throw error;
  }
}

export async function connectShopifyStore(credentials: ShopifyCredentials): Promise<ShopifyStore> {
  try {
    if (!credentials.storeUrl || !credentials.accessToken) {
      throw new Error('Store URL and access token are required');
    }
    
    // Normalize the store URL to ensure it has the right format
    let storeUrl = credentials.storeUrl.trim().toLowerCase();
    if (storeUrl.endsWith('.myshopify.com')) {
      // If it already has the domain, extract just the store name part
      storeUrl = storeUrl.replace('.myshopify.com', '');
    }
    
    // Validate store URL format
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(storeUrl)) {
      throw new Error('Invalid store URL format. It should only contain letters, numbers, and hyphens');
    }
    
    console.log(`Connecting to Shopify store: ${storeUrl}`);
    
    // First check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('Authentication required. Please sign in to connect a store.');
    }
    
    // Ensure we have a fresh token
    await refreshSession();
    
    // Use the invokeFunction utility to call the shopify-connect function
    const response = await invokeFunction('shopify-connect', {
      storeUrl: storeUrl,
      accessToken: credentials.accessToken
    });
    
    if (!response || !response.store) {
      const errorMessage = response?.error || 'Failed to connect to Shopify store';
      console.error('Error connecting Shopify store:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Insert the new store into the database
    const { data: insertedStore, error: insertError } = await supabase.from('shopify_stores').insert({
      id: response.store.id,
      user_id: session.session.user.id,
      store_url: storeUrl,
      store_name: storeUrl,
      access_token: credentials.accessToken,
    }).select().single();
    
    if (insertError) {
      console.error('Error saving Shopify store to database:', insertError);
      throw new Error('Store connected but failed to save to database');
    }
    
    console.log('Shopify store connected successfully:', insertedStore);
    toast.success('Shopify store connected successfully');
    
    return insertedStore as ShopifyStore;
  } catch (error: any) {
    console.error('Exception in connectShopifyStore:', error);
    const errorMessage = handleApiError(error, 'Failed to connect Shopify store. Please check your credentials and try again.');
    toast.error(errorMessage);
    throw error;
  }
}

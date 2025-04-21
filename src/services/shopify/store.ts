
import { supabase } from "@/integrations/supabase/client";
import type { ShopifyStore } from '@/types/shopify';
import { invokeFunction } from "../supabaseUtils";
import { toast } from "sonner";

export interface ShopifyCredentials {
  storeUrl: string;
  accessToken: string;
}

export async function getConnectedShopifyStores(): Promise<ShopifyStore[]> {
  try {
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
    
    console.log('Fetched Shopify stores:', data);
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
    
    console.log(`Connecting to Shopify store: ${storeUrl}`);
    
    const data = await invokeFunction('shopify-connect', {
      storeUrl: storeUrl,
      accessToken: credentials.accessToken
    });
    
    if (!data || !data.store) {
      const errorMessage = data?.error || 'Failed to connect to Shopify store';
      console.error('Error connecting Shopify store:', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    toast.success('Shopify store connected successfully');
    return data.store as ShopifyStore;
  } catch (error) {
    console.error('Exception in connectShopifyStore:', error);
    toast.error('Failed to connect Shopify store. Please check your credentials and try again.');
    throw error;
  }
}


import { supabase } from "@/integrations/supabase/client";
import type { ShopifyStore } from '@/types/shopify';
import { invokeFunction } from "../supabaseUtils";

export interface ShopifyCredentials {
  storeUrl: string;
  accessToken: string;
}

export async function getConnectedShopifyStores(): Promise<ShopifyStore[]> {
  const { data, error } = await supabase.from('shopify_stores').select('*');
  if (error) throw error;
  return data as ShopifyStore[];
}

export async function disconnectShopifyStore(storeId: string): Promise<void> {
  const { error } = await supabase.from('shopify_stores').delete().eq('id', storeId);
  if (error) throw error;
}

export async function connectShopifyStore(credentials: ShopifyCredentials): Promise<ShopifyStore> {
  const data = await invokeFunction('shopify-connect', credentials);
  if (!data.store) throw new Error(data.error || 'Failed to connect to Shopify store');
  return data.store as ShopifyStore;
}

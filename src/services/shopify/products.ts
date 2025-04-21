
import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProductsResponse, ShopifyStore, ShopifyProduct, SEOAnalysisResult } from '@/types/shopify';
import { invokeFunction } from "../supabaseUtils";

export async function fetchShopifyProducts(storeId: string, page = 1, limit = 20): Promise<ShopifyProductsResponse> {
  const data = await invokeFunction('shopify-products', { storeId, page, limit });
  return data as ShopifyProductsResponse;
}

export async function analyzeSEO(storeId: string, productId: string): Promise<SEOAnalysisResult> {
  const data = await invokeFunction('shopify-seo', { storeId, productId });
  return data as SEOAnalysisResult;
}

export async function optimizeSEO(storeId: string, productId: string, optimizations: any[]) {
  const data = await invokeFunction('shopify-optimize', { storeId, productId, optimizations });
  return data;
}

export async function bulkOptimizeSEO(storeId: string) {
  const data = await invokeFunction('shopify-bulk-optimize', { storeId });
  return data;
}

export async function applyOptimization(storeId: string, optimization: any) {
  const data = await invokeFunction('shopify-apply-optimization', { storeId, optimization });
  return data;
}

export async function revertOptimization(optimizationId: string) {
  const { supabase } = await import("@/integrations/supabase/client");
  const updateData = { reverted_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('shopify_optimization_history')
    .update(updateData)
    .eq('id', optimizationId)
    .select();
  if (error) throw error;
  return data;
}

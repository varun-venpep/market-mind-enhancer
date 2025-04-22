import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProductsResponse, ShopifyStore, ShopifyProduct, SEOAnalysisResult, ShopifyOptimizationHistoryRecord } from '@/types/shopify';
import { invokeFunction } from "../supabase";

export async function fetchShopifyProducts(storeId: string, page = 1, limit = 20): Promise<ShopifyProductsResponse> {
  try {
    const data = await invokeFunction('shopify-products', { storeId, page, limit });
    return data as ShopifyProductsResponse;
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      products: [],
      page,
      limit,
      total: 0
    };
  }
}

export async function analyzeSEO(storeId: string, productId: string): Promise<SEOAnalysisResult> {
  try {
    console.log("Analyzing SEO for product:", { storeId, productId });
    const data = await invokeFunction('shopify-seo', { storeId, productId });
    console.log("SEO analysis complete:", data);
    return data as SEOAnalysisResult;
  } catch (error) {
    console.error("Error in analyzeSEO:", error);
    throw error;
  }
}

export async function optimizeSEO(storeId: string, productId: string, optimizations: any[]) {
  try {
    console.log("Optimizing SEO for product:", { storeId, productId, optimizationsCount: optimizations.length });
    const data = await invokeFunction('shopify-optimize', { storeId, productId, optimizations });
    console.log("SEO optimization complete:", data);
    return data || { success: true, message: "Optimization complete" };
  } catch (error) {
    console.error("Error in optimizeSEO:", error);
    throw error;
  }
}

export async function bulkOptimizeSEO(storeId: string) {
  try {
    console.log("Starting bulk SEO optimization for store:", storeId);
    const data = await invokeFunction('shopify-bulk-optimize', { storeId });
    console.log("Bulk optimization complete:", data);
    return data;
  } catch (error) {
    console.error("Error in bulkOptimizeSEO:", error);
    throw error;
  }
}

export async function applyOptimization(storeId: string, optimization: any) {
  try {
    console.log("Applying optimization:", { storeId, optimization });
    const data = await invokeFunction('shopify-apply-optimization', { storeId, optimization });
    console.log("Optimization applied:", data);
    return data;
  } catch (error) {
    console.error("Error in applyOptimization:", error);
    throw error;
  }
}

export async function revertOptimization(optimizationId: string) {
  try {
    console.log("Reverting optimization:", optimizationId);
    const currentDate = new Date().toISOString();

    const updateData: Partial<ShopifyOptimizationHistoryRecord> = { 
      reverted_at: currentDate 
    };

    const { data, error } = await supabase
      .from('shopify_optimization_history')
      .update(updateData)
      .eq('id', optimizationId)
      .select();

    if (error) {
      console.error("Error reverting optimization:", error);
      throw error;
    }
    
    console.log("Optimization reverted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in revertOptimization:", error);
    throw error;
  }
}

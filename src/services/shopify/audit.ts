
import { supabase } from "@/integrations/supabase/client";
import type { ShopifyOptimizationHistory, ShopifyOptimizationHistoryRecord } from '@/types/shopify';

export async function getOptimizationHistory(storeId: string): Promise<ShopifyOptimizationHistory[]> {
  const { data, error } = await supabase
    .from('shopify_optimization_history')
    .select('*')
    .eq('store_id', storeId)
    .order('applied_at', { ascending: false });
  if (error) throw error;
  return data.map((item: ShopifyOptimizationHistoryRecord) => ({
    id: item.id,
    store_id: item.store_id,
    entity_id: item.entity_id,
    entity_type: item.entity_type as "product" | "page" | "blog" | "article" | "theme" | "global",
    field: item.field,
    original_value: item.original_value || '',
    new_value: item.new_value,
    applied_at: item.applied_at,
    applied_by: 'system',
    reverted: item.reverted_at ? true : false,
    reverted_at: item.reverted_at,
    optimization_type: item.optimization_type
  }));
}

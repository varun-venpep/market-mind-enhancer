
export interface ShopifyOptimizationHistory {
  id: string;
  store_id: string;
  entity_id: string;
  entity_type: "product" | "page" | "blog" | "article" | "theme" | "global";
  field: string;
  original_value: string;
  new_value: string;
  applied_at: string;
  applied_by: string;
  reverted: boolean;
  reverted_at: string | null;
  optimization_type: string;
}

export interface ShopifyOptimizationHistoryRecord {
  id: string;
  store_id: string;
  entity_id: string;
  entity_type: string;
  field: string;
  original_value: string | null;
  new_value: string;
  applied_at: string;
  reverted_at: string | null;
  optimization_type: string;
}

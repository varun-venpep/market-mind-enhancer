
export interface ShopifyStore {
  id: string;
  store_url: string;
  access_token: string;
  user_id: string;
  created_at: string;
  store_name?: string;
  store_owner?: string;
  email?: string;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  tags: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  options: ShopifyOption[];
  metafields: ShopifyMetafield[];
}

export interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  fulfillment_service: string;
  inventory_management: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  grams: number;
  image_id: number | null;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
}

export interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

export interface ShopifyOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyMetafield {
  id: number;
  namespace: string;
  key: string;
  value: string;
  value_type: string;
  description: string | null;
}

export interface SEOAnalysisResult {
  product_id: string | number; // Updated to accept both string and number
  title: string;
  handle: string;
  issues: SEOIssue[];
  score: number;
  optimizations: SEOOptimization[];
}

export interface SEOIssue {
  type: 'title' | 'description' | 'image' | 'content' | 'url' | 'technical' | string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: string;
  location?: string;
  entity_id?: string | number;
  entity_name?: string;
}

export interface SEOOptimization {
  type: 'title' | 'description' | 'image' | 'content' | 'url' | 'technical' | string;
  field: string;
  original: string;
  suggestion: string;
  applied: boolean;
  entity_id?: string | number;
  location?: string;
  entity_name?: string;
}

export interface SiteAuditResult {
  store_id: string;
  store_url: string;
  store_name: string;
  theme: string;
  pages_count: number;
  blogs_count: number;
  issues: SEOIssue[];
  score: number;
  optimizations: SEOOptimization[];
  created_at: string;
}

export interface ShopifyOptimizationHistory {
  id: string;
  store_id: string;
  optimization_type: string;
  entity_id: string | number;
  entity_type: string;
  field: string;
  original_value: string;
  new_value: string;
  applied_at: string;
}


// Define shared types for use across edge functions

export interface WebsiteSEOAudit {
  id: string;
  store_id: string;
  created_at: string;
  score: number;
  issues: WebsiteSEOIssue[];
  optimizations: WebsiteSEOOptimization[];
  meta: {
    pages_analyzed: number;
    product_pages: number;
    collection_pages: number;
    blog_pages: number;
    other_pages: number;
  };
}

export interface WebsiteSEOIssue {
  id: string;
  type: 'meta' | 'structure' | 'content' | 'performance' | 'mobile' | 'security';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  details: string;
  impact_score: number;
  affected_urls?: string[];
}

export interface WebsiteSEOOptimization {
  id: string;
  type: 'meta' | 'structure' | 'content' | 'performance' | 'mobile' | 'security';
  entity: string;
  field: string;
  original: string;
  suggestion: string;
  impact_score: number;
  applied: boolean;
  affected_urls?: string[];
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
  metafields?: ShopifyMetafield[];
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

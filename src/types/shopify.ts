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
  product_id: string | number;
  title: string;
  handle: string;
  issues: SEOIssue[];
  score: number;
  optimizations: SEOOptimization[];
}

export interface SEOIssue {
  type: 'title' | 'description' | 'image' | 'content' | 'url';
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: string;
}

export interface SEOOptimization {
  type: 'title' | 'description' | 'image' | 'content' | 'url';
  field: string;
  original: string;
  suggestion: string;
  applied: boolean;
}

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
  affected_urls?: string[];
  impact_score: number;
}

export interface WebsiteSEOOptimization {
  id: string;
  type: 'meta' | 'structure' | 'content' | 'performance' | 'mobile' | 'security';
  entity: string;
  field: string;
  original: string;
  suggestion: string;
  applied: boolean;
  impact_score: number;
  affected_urls?: string[];
}

export interface ShopifyProductsResponse {
  products: ShopifyProduct[];
  page: number;
  limit: number;
  total: number;
}

export interface ShopifyTheme {
  id: number;
  name: string;
  role: string;
  theme_store_id: number | null;
  previewable: boolean;
  processing: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopifyPage {
  id: number;
  title: string;
  shop_id: number;
  handle: string;
  body_html: string;
  author: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  admin_graphql_api_id: string;
}

export interface ShopifyBlog {
  id: number;
  title: string;
  handle: string;
  created_at: string;
  updated_at: string;
  commentable: string;
  admin_graphql_api_id: string;
}

export interface ShopifyArticle {
  id: number;
  title: string;
  blog_id: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  body_html: string;
  summary_html: string;
  handle: string;
  author: string;
  user_id: number;
  tags: string;
  admin_graphql_api_id: string;
  image?: {
    src: string;
    alt?: string;
  };
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
  optimization_type: string;
  reverted_at?: string | null;
}

export interface ShopifyOptimizationHistory {
  id: string;
  store_id: string;
  entity_id: string;
  entity_type: 'product' | 'page' | 'blog' | 'article' | 'theme' | 'global';
  field: string;
  original_value: string;
  new_value: string;
  applied_at: string;
  applied_by: string;
  reverted: boolean;
  reverted_at?: string | null;
  optimization_type: string;
}

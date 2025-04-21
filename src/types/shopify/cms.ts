
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

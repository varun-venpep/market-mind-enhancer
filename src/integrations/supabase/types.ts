export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      article_publishing: {
        Row: {
          article_id: string
          created_at: string
          id: string
          platforms: Json
          scheduled_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          platforms: Json
          scheduled_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          platforms?: Json
          scheduled_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_publishing_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          campaign_id: string | null
          content: string | null
          created_at: string | null
          id: string
          keywords: string[] | null
          score: number | null
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          word_count: number | null
        }
        Insert: {
          campaign_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          score?: number | null
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          word_count?: number | null
        }
        Update: {
          campaign_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          score?: number | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaign"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          stripe_customer_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          created_at: string
          credentials: Json
          id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials: Json
          id?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: Json
          id?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          plan: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          plan?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          plan?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shopify_optimization_history: {
        Row: {
          applied_at: string
          entity_id: string
          entity_type: string
          field: string
          id: string
          new_value: string
          optimization_type: string
          original_value: string | null
          store_id: string
        }
        Insert: {
          applied_at?: string
          entity_id: string
          entity_type: string
          field: string
          id?: string
          new_value: string
          optimization_type: string
          original_value?: string | null
          store_id: string
        }
        Update: {
          applied_at?: string
          entity_id?: string
          entity_type?: string
          field?: string
          id?: string
          new_value?: string
          optimization_type?: string
          original_value?: string | null
          store_id?: string
        }
        Relationships: []
      }
      shopify_seo_analyses: {
        Row: {
          created_at: string
          handle: string
          id: string
          issues: Json
          optimizations: Json
          product_id: string
          score: number
          store_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          handle: string
          id?: string
          issues?: Json
          optimizations?: Json
          product_id: string
          score: number
          store_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          handle?: string
          id?: string
          issues?: Json
          optimizations?: Json
          product_id?: string
          score?: number
          store_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_seo_analyses_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "shopify_stores"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_site_audits: {
        Row: {
          audit_data: Json
          created_at: string
          id: string
          score: number
          store_id: string
        }
        Insert: {
          audit_data: Json
          created_at?: string
          id?: string
          score: number
          store_id: string
        }
        Update: {
          audit_data?: Json
          created_at?: string
          id?: string
          score?: number
          store_id?: string
        }
        Relationships: []
      }
      shopify_stores: {
        Row: {
          access_token: string
          created_at: string
          email: string | null
          id: string
          store_name: string | null
          store_owner: string | null
          store_url: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          email?: string | null
          id?: string
          store_name?: string | null
          store_owner?: string | null
          store_url: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          email?: string | null
          id?: string
          store_name?: string | null
          store_owner?: string | null
          store_url?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          price_id: string | null
          product_id: string | null
          quantity: number | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id: string
          price_id?: string | null
          product_id?: string | null
          quantity?: number | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          price_id?: string | null
          product_id?: string | null
          quantity?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      "test Data P": {
        Row: {
          _id: string | null
          country: string | null
          month: string | null
          regionId: number | null
          regionName: string | null
          "salesMetrics.ADT": number | null
          "salesMetrics.conversion": number | null
          "salesMetrics.grossSales": number | null
          "salesMetrics.grossSalesPerSqFt": number | null
          "salesMetrics.netSales": number | null
          "salesMetrics.netSalesPerSqFt": number | null
          "salesMetrics.traffic": number | null
          "salesMetrics.UPT": number | null
          storeId: number | null
          storeName: string | null
          updatedAt: string | null
        }
        Insert: {
          _id?: string | null
          country?: string | null
          month?: string | null
          regionId?: number | null
          regionName?: string | null
          "salesMetrics.ADT"?: number | null
          "salesMetrics.conversion"?: number | null
          "salesMetrics.grossSales"?: number | null
          "salesMetrics.grossSalesPerSqFt"?: number | null
          "salesMetrics.netSales"?: number | null
          "salesMetrics.netSalesPerSqFt"?: number | null
          "salesMetrics.traffic"?: number | null
          "salesMetrics.UPT"?: number | null
          storeId?: number | null
          storeName?: string | null
          updatedAt?: string | null
        }
        Update: {
          _id?: string | null
          country?: string | null
          month?: string | null
          regionId?: number | null
          regionName?: string | null
          "salesMetrics.ADT"?: number | null
          "salesMetrics.conversion"?: number | null
          "salesMetrics.grossSales"?: number | null
          "salesMetrics.grossSalesPerSqFt"?: number | null
          "salesMetrics.netSales"?: number | null
          "salesMetrics.netSalesPerSqFt"?: number | null
          "salesMetrics.traffic"?: number | null
          "salesMetrics.UPT"?: number | null
          storeId?: number | null
          storeName?: string | null
          updatedAt?: string | null
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          created_at: string
          credentials: Json
          id: string
          platform: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials: Json
          id?: string
          platform: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: Json
          id?: string
          platform?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

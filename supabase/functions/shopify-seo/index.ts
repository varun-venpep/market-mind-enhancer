
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShopifyStore {
  id: string;
  store_url: string;
  access_token: string;
  user_id: string;
}

interface SEOAnalysisResult {
  product_id: string;
  title: string;
  handle: string;
  issues: Array<{
    type: 'title' | 'description' | 'image' | 'content' | 'url';
    severity: 'high' | 'medium' | 'low';
    message: string;
    details?: string;
  }>;
  score: number;
  optimizations: Array<{
    type: 'title' | 'description' | 'image' | 'content' | 'url';
    field: string;
    original: string;
    suggestion: string;
    applied: boolean;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { storeId, productId } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get store data
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .single();
    
    if (storeError || !store) {
      return new Response(
        JSON.stringify({ error: "Store not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Fetch product data from Shopify API
    const shopifyResponse = await fetch(
      `https://${store.store_url}/admin/api/2023-10/products/${productId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": store.access_token,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!shopifyResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch product from Shopify" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const productData = await shopifyResponse.json();
    const product = productData.product;
    
    // Basic SEO analysis
    const issues = [];
    const optimizations = [];
    let score = 100;
    
    // Title analysis
    if (!product.title || product.title.length < 5) {
      issues.push({
        type: 'title',
        severity: 'high',
        message: 'Product title is too short or missing',
        details: 'Add a descriptive title with relevant keywords, at least 50 characters'
      });
      score -= 20;
      
      optimizations.push({
        type: 'title',
        field: 'title',
        original: product.title || '',
        suggestion: product.title ? `${product.title} - Improved Product Title with Keywords` : 'Suggested Product Title with Keywords',
        applied: false
      });
    } else if (product.title.length < 50) {
      issues.push({
        type: 'title',
        severity: 'medium',
        message: 'Product title could be more descriptive',
        details: 'Aim for 50-60 characters with relevant keywords'
      });
      score -= 10;
      
      optimizations.push({
        type: 'title',
        field: 'title',
        original: product.title,
        suggestion: `${product.title} - Enhanced with Keywords`,
        applied: false
      });
    }
    
    // Description analysis
    if (!product.body_html || product.body_html.length < 50) {
      issues.push({
        type: 'description',
        severity: 'high',
        message: 'Product description is too short or missing',
        details: 'Add a detailed description with relevant keywords, at least 300 characters'
      });
      score -= 20;
      
      optimizations.push({
        type: 'description',
        field: 'body_html',
        original: product.body_html || '',
        suggestion: product.body_html ? `${product.body_html}<p>Enhanced product description with additional keywords and details about features and benefits.</p>` : '<p>Suggested product description with keywords and details about features and benefits.</p>',
        applied: false
      });
    }
    
    // Image analysis
    if (!product.images || product.images.length === 0) {
      issues.push({
        type: 'image',
        severity: 'high',
        message: 'Product has no images',
        details: 'Add high-quality images with descriptive alt text'
      });
      score -= 20;
    } else {
      const imagesWithoutAlt = product.images.filter(img => !img.alt || img.alt.trim() === "");
      if (imagesWithoutAlt.length > 0) {
        issues.push({
          type: 'image',
          severity: 'medium',
          message: `${imagesWithoutAlt.length} images missing alt text`,
          details: 'Add descriptive alt text to all images for better accessibility and SEO'
        });
        score -= 10;
        
        imagesWithoutAlt.forEach(img => {
          optimizations.push({
            type: 'image',
            field: `images[${img.id}].alt`,
            original: img.alt || '',
            suggestion: `${product.title} - Product image ${img.position}`,
            applied: false
          });
        });
      }
    }
    
    // Save analysis to supabase
    const analysisResult: SEOAnalysisResult = {
      product_id: product.id.toString(),
      title: product.title,
      handle: product.handle,
      issues,
      score,
      optimizations
    };
    
    // Check if analysis exists
    const { data: existingAnalysis } = await supabase
      .from('shopify_seo_analyses')
      .select('id')
      .eq('store_id', storeId)
      .eq('product_id', product.id.toString())
      .single();
    
    if (existingAnalysis) {
      // Update existing analysis
      await supabase
        .from('shopify_seo_analyses')
        .update({
          issues,
          score,
          optimizations,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAnalysis.id);
    } else {
      // Insert new analysis
      await supabase
        .from('shopify_seo_analyses')
        .insert({
          store_id: storeId,
          product_id: product.id.toString(),
          title: product.title,
          handle: product.handle,
          issues,
          score,
          optimizations
        });
    }
    
    return new Response(
      JSON.stringify(analysisResult),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

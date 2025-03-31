
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { storeId, productId, optimizations } = await req.json();
    
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
    const getResponse = await fetch(
      `https://${store.store_url}/admin/api/2023-10/products/${productId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": store.access_token,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!getResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch product from Shopify" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const productData = await getResponse.json();
    const product = productData.product;
    
    // Apply optimizations
    const updatedProduct = { ...product };
    
    for (const opt of optimizations) {
      if (opt.type === 'title') {
        updatedProduct.title = opt.suggestion;
      } else if (opt.type === 'description') {
        updatedProduct.body_html = opt.suggestion;
      } else if (opt.type === 'image' && opt.field.startsWith('images[')) {
        // Extract image ID from the field string (e.g., "images[123].alt")
        const matches = opt.field.match(/images\[(\d+)\]\.alt/);
        if (matches && matches[1]) {
          const imageId = parseInt(matches[1]);
          // Find the image by ID
          const imageIndex = updatedProduct.images.findIndex(img => img.id === imageId);
          if (imageIndex >= 0) {
            updatedProduct.images[imageIndex].alt = opt.suggestion;
          }
        }
      }
    }
    
    // Update product in Shopify
    const updateResponse = await fetch(
      `https://${store.store_url}/admin/api/2023-10/products/${productId}.json`,
      {
        method: 'PUT',
        headers: {
          "X-Shopify-Access-Token": store.access_token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ product: updatedProduct })
      }
    );
    
    if (!updateResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to update product in Shopify" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Update analysis in database
    const { data: analysis, error: analysisError } = await supabase
      .from('shopify_seo_analyses')
      .select('*')
      .eq('store_id', storeId)
      .eq('product_id', productId)
      .single();
    
    if (!analysisError && analysis) {
      // Mark optimizations as applied
      const updatedOptimizations = analysis.optimizations.map(opt => {
        const wasApplied = optimizations.some(
          appliedOpt => appliedOpt.type === opt.type && appliedOpt.field === opt.field
        );
        return wasApplied ? { ...opt, applied: true } : opt;
      });
      
      await supabase
        .from('shopify_seo_analyses')
        .update({
          optimizations: updatedOptimizations,
          updated_at: new Date().toISOString()
        })
        .eq('id', analysis.id);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "SEO optimizations applied successfully" }),
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

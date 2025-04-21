
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";
import { analyzeSEO } from "./helpers.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { storeId, productId } = await req.json();

    if (!storeId || !productId) {
      return new Response(JSON.stringify({ 
        error: 'Store ID and Product ID are required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Verify the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Failed to authenticate user' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get store
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (storeError) {
      return new Response(JSON.stringify({ 
        error: 'Store not found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Fetch Shopify product and analyze
    try {
      const apiUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
      const productResponse = await fetch(apiUrl, {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
      });

      if (!productResponse.ok) {
        throw new Error(`Failed to fetch product from Shopify: ${productResponse.statusText}`);
      }

      const productData = await productResponse.json();
      const product = productData.product;
      
      const { issues, score, optimizations } = analyzeSEO(product);

      const analysisResult = {
        product_id: productId,
        title: product.title,
        handle: product.handle,
        issues,
        score,
        optimizations,
      };

      // Save/update in DB
      const { data: existingAnalysis } = await supabase
        .from('shopify_seo_analyses')
        .select('id')
        .eq('store_id', storeId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingAnalysis) {
        await supabase
          .from('shopify_seo_analyses')
          .update({
            title: product.title,
            handle: product.handle,
            issues,
            score,
            optimizations,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingAnalysis.id);
      } else {
        await supabase
          .from('shopify_seo_analyses')
          .insert({
            store_id: storeId,
            product_id: productId,
            title: product.title,
            handle: product.handle,
            issues,
            score,
            optimizations,
          });
      }

      return new Response(JSON.stringify(analysisResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching or analyzing product:', error);
      return new Response(JSON.stringify({ 
        error: error.message || 'Failed to fetch or analyze product' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  } catch (error) {
    console.error('Error analyzing product SEO:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze product SEO' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

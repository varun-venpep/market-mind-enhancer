
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { storeId } = await req.json();
    
    if (!storeId) {
      return new Response(JSON.stringify({ error: 'Store ID is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get store credentials
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .single();
      
    if (storeError || !store) {
      return new Response(JSON.stringify({ error: 'Store not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Get all products with pending optimizations
    const { data: analyses, error: analysesError } = await supabase
      .from('shopify_seo_analyses')
      .select('*')
      .eq('store_id', storeId);
      
    if (analysesError) {
      throw new Error(`Failed to fetch analyses: ${analysesError.message}`);
    }
    
    // Filter for analyses with pending optimizations
    const analysesWithOptimizations = analyses.filter(analysis => 
      analysis.optimizations && 
      analysis.optimizations.some(opt => !opt.applied)
    );
    
    // Process each analysis
    const results = [];
    for (const analysis of analysesWithOptimizations) {
      try {
        // Call the optimization endpoint for each product
        const optimizeResponse = await fetch(new URL('/shopify-optimize', req.url).href, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            storeId,
            productId: analysis.product_id,
            optimizations: analysis.optimizations.filter(opt => !opt.applied)
          }),
        });
        
        if (!optimizeResponse.ok) {
          throw new Error(`Failed to optimize product ${analysis.product_id}: ${optimizeResponse.statusText}`);
        }
        
        results.push({
          product_id: analysis.product_id,
          title: analysis.title,
          success: true
        });
      } catch (error) {
        results.push({
          product_id: analysis.product_id,
          title: analysis.title,
          success: false,
          error: error.message
        });
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      total: analysesWithOptimizations.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to run bulk SEO optimization' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

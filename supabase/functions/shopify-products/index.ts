
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
    const { storeId, page = 1, limit = 20 } = await req.json();
    
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
    
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Get store credentials and verify ownership
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .eq('user_id', user.id)  // Ensure the user owns this store
      .single();
      
    if (storeError || !store) {
      return new Response(JSON.stringify({ error: 'Store not found or access denied' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Fetch products from Shopify API
    const response = await fetch(`https://${store.store_url}/admin/api/2023-01/products.json?limit=${limit}&fields=id,title,handle,body_html,vendor,product_type,created_at,updated_at,published_at,tags,variants,images,options,metafields`, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const { products } = await response.json();
    
    // Fetch analysis results for each product
    const { data: analyses, error: analysesError } = await supabase
      .from('shopify_seo_analyses')
      .select('*')
      .eq('store_id', storeId);
      
    // Create a map of product ID to analysis
    const analysisMap = {};
    if (!analysesError && analyses) {
      analyses.forEach(analysis => {
        analysisMap[analysis.product_id] = analysis;
      });
    }
    
    // Return the product list along with pagination info
    return new Response(JSON.stringify({
      products,
      page,
      limit,
      total: products.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch products' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

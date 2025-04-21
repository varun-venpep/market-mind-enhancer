
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

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
      return new Response(JSON.stringify({ 
        error: 'Store ID is required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the user ID from the authorization header
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
    
    // Get the store details
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
    
    if (!store.access_token) {
      return new Response(JSON.stringify({ 
        error: 'Store access token is missing' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Fetch products from Shopify
    const apiUrl = `https://${store.store_url}/admin/api/2023-07/products.json`;
    console.log(`Fetching products from: ${apiUrl}`);
    
    const productsResponse = await fetch(apiUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      console.error(`Shopify API error: ${productsResponse.status} ${productsResponse.statusText}`, errorText);
      return new Response(JSON.stringify({
        error: `Failed to fetch products from Shopify: ${productsResponse.statusText}`,
        details: errorText
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: productsResponse.status,
      });
    }
    
    const productsData = await productsResponse.json();
    
    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = productsData.products.slice(startIndex, endIndex);
    
    return new Response(JSON.stringify({
      products: paginatedProducts,
      page,
      limit,
      total: productsData.products.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch products' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

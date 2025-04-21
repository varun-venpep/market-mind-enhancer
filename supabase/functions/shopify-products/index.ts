
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
      console.error('Authentication error:', userError);
      return new Response(JSON.stringify({ 
        error: 'Failed to authenticate user',
        details: userError
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
      console.error('Store fetch error:', storeError);
      return new Response(JSON.stringify({ 
        error: 'Store not found',
        details: storeError
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
    
    // Parse response with error handling
    let productsData;
    try {
      const responseText = await productsResponse.text();
      console.log("Response length:", responseText.length);
      // Debug the first 100 chars of the response
      console.log("Response preview:", responseText.substring(0, Math.min(100, responseText.length)));
      
      if (!responseText || responseText.trim() === '') {
        return new Response(JSON.stringify({
          error: 'Empty response from Shopify API',
          products: [],
          page,
          limit,
          total: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Return 200 with empty products array
        });
      }
      
      productsData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(JSON.stringify({
        error: 'Failed to parse Shopify API response',
        details: parseError.message,
        products: [],
        page,
        limit,
        total: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with empty products array
      });
    }
    
    if (!productsData || !productsData.products) {
      console.warn("Unexpected response format:", productsData);
      return new Response(JSON.stringify({
        error: 'Unexpected response format from Shopify API',
        products: [],
        page,
        limit,
        total: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with empty products array
      });
    }
    
    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = productsData.products.slice(startIndex, endIndex);
    
    console.log(`Returning ${paginatedProducts.length} products (total: ${productsData.products.length})`);
    
    return new Response(JSON.stringify({
      products: paginatedProducts,
      page,
      limit,
      total: productsData.products.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in shopify-products function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch products',
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

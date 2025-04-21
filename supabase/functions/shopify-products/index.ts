
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
    // Parse request body with improved error handling
    let body;
    let text = '';
    try {
      text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch (error) {
      console.error(`Error parsing request body: ${error.message}`);
      console.error(`Received text: "${text}"`);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: error.message,
          receivedText: text.substring(0, 100) // Log a snippet of what was received
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const { storeId, page = 1, limit = 20 } = body;
    
    if (!storeId) {
      return new Response(JSON.stringify({ 
        error: 'Store ID is required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`Processing request for store ID: ${storeId}, page: ${page}, limit: ${limit}`);

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
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
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
      .maybeSingle();
    
    if (storeError) {
      console.error('Store fetch error:', storeError);
      return new Response(JSON.stringify({ 
        error: 'Error fetching store details',
        details: storeError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!store) {
      return new Response(JSON.stringify({ 
        error: 'Store not found with ID: ' + storeId
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
    
    try {
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
        const status = productsResponse.status;
        let errorText;
        try {
          errorText = await productsResponse.text();
        } catch (textError) {
          errorText = "Could not read error response";
        }
        
        console.error(`Shopify API error (${status}): ${productsResponse.statusText}`);
        console.error(`Error details: ${errorText}`);
        
        return new Response(JSON.stringify({
          error: `Failed to fetch products from Shopify (Status: ${status})`,
          details: errorText,
          products: [],
          page,
          limit,
          total: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Return 200 to prevent edge function error
        });
      }
      
      // Get response as text first for debugging
      const responseText = await productsResponse.text();
      console.log("Response length:", responseText.length);
      
      if (!responseText || responseText.trim() === '') {
        console.error("Empty response from Shopify API");
        return new Response(JSON.stringify({
          error: 'Empty response from Shopify API',
          products: [],
          page,
          limit,
          total: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      // Try to parse the response
      let productsData;
      try {
        productsData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("First 200 chars of response:", responseText.substring(0, 200));
        return new Response(JSON.stringify({
          error: 'Failed to parse Shopify API response',
          details: parseError.message,
          responsePreview: responseText.substring(0, 100),
          products: [],
          page,
          limit,
          total: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      if (!productsData || !productsData.products) {
        console.warn("Unexpected response format:", typeof productsData);
        return new Response(JSON.stringify({
          error: 'Unexpected response format from Shopify API',
          responseType: typeof productsData,
          products: [],
          page,
          limit,
          total: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      // Simple pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const allProducts = productsData.products || [];
      const paginatedProducts = allProducts.slice(startIndex, endIndex);
      
      console.log(`Returning ${paginatedProducts.length} products (total: ${allProducts.length})`);
      
      return new Response(JSON.stringify({
        products: paginatedProducts,
        page,
        limit,
        total: allProducts.length,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (shopifyError) {
      console.error('Error fetching from Shopify:', shopifyError);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch from Shopify API',
        details: shopifyError.message || String(shopifyError),
        products: [],
        page,
        limit,
        total: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with error details
      });
    }
  } catch (error) {
    console.error('Error in shopify-products function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch products',
      stack: error.stack,
      products: [],
      page: 1,
      limit: 20,
      total: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 with error details
    });
  }
});

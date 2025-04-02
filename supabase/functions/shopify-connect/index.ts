
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
    const { apiKey, apiSecretKey, storeUrl, accessToken } = await req.json();
    
    if ((!apiKey || !apiSecretKey) && !accessToken) {
      return new Response(JSON.stringify({ 
        error: 'Missing required Shopify credentials. Please provide either API key and secret, or an access token.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!storeUrl) {
      return new Response(JSON.stringify({ 
        error: 'Store URL is required' 
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
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Format the store URL
    let formattedUrl = storeUrl.trim();
    if (formattedUrl.startsWith('http://') || formattedUrl.startsWith('https://')) {
      formattedUrl = formattedUrl.replace(/^https?:\/\//, '');
    }
    if (formattedUrl.endsWith('/')) {
      formattedUrl = formattedUrl.slice(0, -1);
    }
    
    // Use token that was either directly provided or the one from API secret
    const token_to_use = accessToken || apiSecretKey;
    
    // Connect to Shopify Admin API
    console.log(`Attempting to connect to Shopify store: ${formattedUrl}`);
    const response = await fetch(`https://${formattedUrl}/admin/api/2023-07/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': token_to_use,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to connect to Shopify: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Failed to connect to Shopify: ${response.statusText}`);
    }
    
    const { shop } = await response.json();
    console.log(`Successfully connected to shop: ${shop.name}`);
    
    // Store the connection in the database
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .insert({
        store_url: formattedUrl,
        store_name: shop.name,
        store_owner: shop.shop_owner,
        email: shop.email,
        access_token: token_to_use,
        user_id: user.id
      })
      .select()
      .single();
    
    if (storeError) {
      console.error('Error storing Shopify connection:', storeError);
      throw new Error('Failed to store Shopify connection');
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      store,
      shop
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error connecting to Shopify:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to connect to Shopify' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

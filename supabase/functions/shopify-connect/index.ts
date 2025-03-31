
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
    const { apiKey, apiSecretKey, storeUrl } = await req.json();
    
    if (!apiKey || !apiSecretKey || !storeUrl) {
      return new Response(JSON.stringify({ 
        error: 'Missing required Shopify credentials' 
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
    
    // Connect to Shopify Admin API
    const response = await fetch(`https://${formattedUrl}/admin/api/2023-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': apiSecretKey,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to connect to Shopify: ${response.statusText}`);
    }
    
    const { shop } = await response.json();
    
    // Store the connection in the database
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .insert({
        store_url: formattedUrl,
        store_name: shop.name,
        store_owner: shop.shop_owner,
        email: shop.email,
        access_token: apiSecretKey,
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

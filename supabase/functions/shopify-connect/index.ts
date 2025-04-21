
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
    const { storeUrl, accessToken } = await req.json();
    
    if (!storeUrl || !accessToken) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameters: storeUrl or accessToken"
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log(`Attempting to connect Shopify store: ${storeUrl}`);
    
    // Get the supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }
    
    // Extract token from header
    const token = authHeader.replace('Bearer ', '');
    
    // Get the user ID from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Failed to get user:", userError);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate user' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }
    
    try {
      // First let's verify the store credentials by fetching the shop information
      const shopResponse = await fetch(`https://${storeUrl}/admin/api/2023-07/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });
      
      if (!shopResponse.ok) {
        console.error(`Failed to verify Shopify store credentials. Status: ${shopResponse.status}, URL: ${storeUrl}`);
        let errorText;
        try {
          errorText = await shopResponse.text();
        } catch (e) {
          errorText = "Could not read error response";
        }
        console.error(`Shopify error response:`, errorText);
        
        return new Response(
          JSON.stringify({ 
            error: "Invalid Shopify credentials. Please check your store URL and access token.",
            details: errorText 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      
      const shopInfo = await shopResponse.json();
      
      // Store the shop credentials in the database
      const { data: store, error: insertError } = await supabase
        .from('shopify_stores')
        .upsert({
          user_id: user.id,
          store_url: storeUrl,
          access_token: accessToken,
          store_name: shopInfo.shop.name,
          store_owner: shopInfo.shop.shop_owner,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Failed to store Shopify credentials:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to save store information", details: insertError }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          store: {
            id: store.id,
            store_url: store.store_url,
            store_name: store.store_name,
            store_owner: store.store_owner,
            created_at: store.created_at
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (fetchError) {
      console.error("Error fetching shop information:", fetchError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to communicate with Shopify API",
          details: fetchError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error connecting Shopify store:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to connect Shopify store",
        details: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

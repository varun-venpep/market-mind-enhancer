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
    // Parse JSON body with robust error handling
    let payload;
    try {
      const text = await req.text();
      payload = text ? JSON.parse(text) : {};
      console.log("Received payload:", JSON.stringify(payload));
    } catch (parseError) {
      console.error(`Error parsing request body: ${parseError.message}`);
      return new Response(JSON.stringify({
        error: "Invalid request body format. JSON expected.",
        details: parseError.message,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const { storeUrl, accessToken } = payload;
    
    if (!storeUrl || !accessToken) {
      return new Response(JSON.stringify({ 
        error: "Missing required parameters: storeUrl or accessToken"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log(`Attempting to connect Shopify store: ${storeUrl}`);
    
    // Get the supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return new Response(JSON.stringify({ 
        error: "Server configuration error",
        details: "Missing Supabase credentials"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    // Extract token from header
    const token = authHeader.replace('Bearer ', '');
    
    // Get the user ID from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Failed to get user:", userError);
      return new Response(JSON.stringify({ error: 'Failed to authenticate user' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    try {
      // Construct the full store URL with the myshopify.com domain
      const fullStoreUrl = `${storeUrl}.myshopify.com`;
      
      // First let's verify the store credentials by fetching the shop information
      console.log(`Making API request to Shopify store: ${fullStoreUrl}`);
      const shopResponse = await fetch(`https://${fullStoreUrl}/admin/api/2023-07/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });
      
      if (!shopResponse.ok) {
        const errorStatus = shopResponse.status;
        let errorText;
        try {
          errorText = await shopResponse.text();
        } catch (e) {
          errorText = "Could not read error response";
        }
        console.error(`Failed to verify Shopify store credentials. Status: ${errorStatus}, URL: ${fullStoreUrl}`);
        console.error(`Shopify error response:`, errorText);
        
        if (errorStatus === 401) {
          return new Response(JSON.stringify({ 
            error: "Invalid Shopify access token. Please check your credentials.",
            details: errorText,
            status: errorStatus
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          });
        } else if (errorStatus === 404) {
          return new Response(JSON.stringify({ 
            error: "Shopify store not found. Please check your store URL.",
            details: errorText,
            status: errorStatus
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          });
        }
        
        return new Response(JSON.stringify({ 
          error: "Invalid Shopify credentials. Please check your store URL and access token.",
          details: errorText,
          status: errorStatus
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      
      const shopInfo = await shopResponse.json();
      console.log("Successfully connected to Shopify store:", shopInfo.shop.name);
      
      // Check if this store already exists for this user
      const { data: existingStore, error: queryError } = await supabase
        .from('shopify_stores')
        .select('*')
        .eq('user_id', user.id)
        .eq('store_url', storeUrl)
        .maybeSingle();
        
      if (queryError) {
        console.error("Error checking for existing store:", queryError);
      }
      
      // If the store already exists, update it
      if (existingStore) {
        console.log("Updating existing store:", existingStore.id);
        const { data: store, error: updateError } = await supabase
          .from('shopify_stores')
          .update({
            access_token: accessToken,
            store_name: shopInfo.shop.name,
            store_owner: shopInfo.shop.shop_owner,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingStore.id)
          .select()
          .single();
          
        if (updateError) {
          console.error("Failed to update Shopify credentials:", updateError);
          return new Response(JSON.stringify({ 
            error: "Failed to update store information", 
            details: updateError 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          });
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Store updated successfully",
          store: {
            id: store.id,
            store_url: store.store_url,
            store_name: store.store_name,
            store_owner: store.store_owner,
            created_at: store.created_at
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // Otherwise, create a new store record
      const { data: store, error: insertError } = await supabase
        .from('shopify_stores')
        .insert({
          user_id: user.id,
          store_url: storeUrl,
          access_token: accessToken,
          store_name: shopInfo.shop.name,
          store_owner: shopInfo.shop.shop_owner,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Failed to store Shopify credentials:", insertError);
        return new Response(JSON.stringify({ 
          error: "Failed to save store information", 
          details: insertError 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Store connected successfully",
        store: {
          id: store.id,
          store_url: store.store_url,
          store_name: store.store_name,
          store_owner: store.store_owner,
          created_at: store.created_at
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (fetchError) {
      console.error("Error fetching shop information:", fetchError);
      return new Response(JSON.stringify({ 
        error: "Failed to communicate with Shopify API",
        details: fetchError.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error connecting Shopify store:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to connect Shopify store",
      details: error.stack 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

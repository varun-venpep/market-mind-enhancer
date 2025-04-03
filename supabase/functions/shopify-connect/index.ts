
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    console.log("Shopify connect function received request");
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Supabase configuration missing. Please check your environment variables.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const body = await req.json();
    const { storeUrl, accessToken } = body;
    
    if (!storeUrl || !accessToken) {
      console.error("Missing required Shopify credentials");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required Shopify credentials. Please provide storeUrl and accessToken.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    console.log(`Connecting to Shopify store: ${storeUrl}`);
    
    // Fetch Shopify store details using the provided credentials
    try {
      const shopResponse = await fetch(`https://${storeUrl}/admin/api/2023-07/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });
      
      if (!shopResponse.ok) {
        const errorText = await shopResponse.text();
        console.error(`Shopify API error: ${shopResponse.status} ${shopResponse.statusText}`, errorText);
        return new Response(
          JSON.stringify({
            success: false,
            error: `Failed to connect to Shopify store: ${shopResponse.statusText}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      const shopData = await shopResponse.json();
      const shop = shopData.shop;
      
      // Get user ID from auth header
      const authHeader = req.headers.get('Authorization') || '';
      const token = authHeader.replace('Bearer ', '');
      
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !userData.user) {
        console.error("Error getting user from token:", userError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Authentication failed. Please log in again.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }
      
      const userId = userData.user.id;
      
      // Check if store already exists
      const { data: existingStore } = await supabase
        .from('shopify_stores')
        .select('id')
        .eq('store_url', storeUrl)
        .eq('user_id', userId)
        .maybeSingle();
      
      let storeId;
      
      if (existingStore) {
        // Update existing store
        const { data: updatedStore, error: updateError } = await supabase
          .from('shopify_stores')
          .update({
            access_token: accessToken,
            store_name: shop.name,
            store_owner: shop.shop_owner,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingStore.id)
          .select()
          .single();
        
        if (updateError) {
          console.error("Error updating store:", updateError);
          throw updateError;
        }
        
        storeId = existingStore.id;
        console.log("Updated existing Shopify store:", storeId);
      } else {
        // Insert new store
        const { data: newStore, error: insertError } = await supabase
          .from('shopify_stores')
          .insert({
            user_id: userId,
            store_url: storeUrl,
            access_token: accessToken,
            store_name: shop.name,
            store_owner: shop.shop_owner,
          })
          .select()
          .single();
        
        if (insertError) {
          console.error("Error inserting store:", insertError);
          throw insertError;
        }
        
        storeId = newStore.id;
        console.log("Inserted new Shopify store:", storeId);
      }
      
      // Get the store details
      const { data: store, error: storeError } = await supabase
        .from('shopify_stores')
        .select('*')
        .eq('id', storeId)
        .single();
      
      if (storeError) {
        console.error("Error fetching store details:", storeError);
        throw storeError;
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Shopify store connected successfully",
          store,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (shopifyError) {
      console.error("Shopify connection error:", shopifyError);
      return new Response(
        JSON.stringify({
          success: false,
          error: shopifyError instanceof Error ? shopifyError.message : "Failed to connect to Shopify store",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error in Shopify connect function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

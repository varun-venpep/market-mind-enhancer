
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
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request received for store:", requestData.storeUrl);
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid JSON in request body' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const { storeUrl, accessToken } = requestData;
    
    if (!accessToken) {
      console.error("Missing required access token");
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Missing required Shopify access token. Please provide your access token.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!storeUrl) {
      console.error("Missing store URL");
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Store URL is required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Server configuration error: Missing Supabase credentials' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Not authenticated' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid authentication' 
      }), {
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
    
    // Add myshopify.com if not present and no dots in URL
    if (!formattedUrl.includes('.')) {
      formattedUrl = `${formattedUrl}.myshopify.com`;
    }
    
    console.log(`Attempting to connect to Shopify store: ${formattedUrl}`);
    
    try {
      // Test the access token by fetching shop data
      const shopifyUrl = `https://${formattedUrl}/admin/api/2023-07/shop.json`;
      console.log(`Making request to Shopify API: ${shopifyUrl}`);
      
      const response = await fetch(shopifyUrl, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });
      
      // Log HTTP status for debugging
      console.log(`Shopify API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to connect to Shopify: ${response.status} ${response.statusText}`);
        console.error(`Error response: ${errorText}`);
        
        return new Response(JSON.stringify({ 
          success: false,
          error: `Failed to connect to Shopify: ${response.status} ${response.statusText}`,
          details: errorText
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      const shopData = await response.json();
      
      if (!shopData || !shopData.shop) {
        console.error("Invalid response from Shopify API:", shopData);
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Invalid response from Shopify API' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      const { shop } = shopData;
      console.log(`Successfully connected to shop: ${shop.name}`);
      
      // Check if store already exists
      const { data: existingStore, error: queryError } = await supabase
        .from('shopify_stores')
        .select('*')
        .eq('store_url', formattedUrl)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (queryError) {
        console.error("Error checking for existing store:", queryError);
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Database error when checking for existing store' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
        
      if (existingStore) {
        // Update existing store
        const { data: updatedStore, error: updateError } = await supabase
          .from('shopify_stores')
          .update({
            store_name: shop.name,
            store_owner: shop.shop_owner,
            email: shop.email,
            access_token: accessToken
          })
          .eq('id', existingStore.id)
          .select()
          .single();
          
        if (updateError) {
          console.error('Error updating Shopify connection:', updateError);
          return new Response(JSON.stringify({ 
            success: false,
            error: 'Failed to update Shopify connection in database' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          });
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          store: updatedStore,
          shop,
          updated: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Store the connection in the database
        const { data: store, error: storeError } = await supabase
          .from('shopify_stores')
          .insert({
            store_url: formattedUrl,
            store_name: shop.name,
            store_owner: shop.shop_owner,
            email: shop.email,
            access_token: accessToken,
            user_id: user.id
          })
          .select()
          .single();
        
        if (storeError) {
          console.error('Error storing Shopify connection:', storeError);
          return new Response(JSON.stringify({ 
            success: false,
            error: 'Failed to store Shopify connection in database' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          });
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          store,
          shop,
          updated: false
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (fetchError) {
      console.error('Error making request to Shopify API:', fetchError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Network error when connecting to Shopify',
        details: fetchError.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  } catch (error) {
    console.error('Unexpected error connecting to Shopify:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Unexpected error occurred',
      details: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

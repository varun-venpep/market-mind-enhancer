
// Main handler and imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

import { optimizeProduct } from "./optimizeProduct.ts";
import { optimizeShop } from "./optimizeShop.ts";
import { optimizeBlog } from "./optimizeBlog.ts";
import { optimizePage } from "./optimizePage.ts";
import { optimizeTheme } from "./optimizeTheme.ts";
import { recordOptimizationHistory } from "./recordOptimizationHistory.ts";
import type { Optimization, OptimizeResult } from "./types.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  // Debug request headers
  console.log("Headers received:", JSON.stringify(Object.fromEntries([...req.headers])));

  try {
    // Check for authentication header first
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(JSON.stringify({
        error: 'Missing authorization header'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({
        error: 'Invalid request format. Expected JSON body.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Parse request parameters
    const { storeId, optimization } = body;
    
    if (!storeId) {
      console.error("Missing store ID");
      return new Response(JSON.stringify({
        error: 'Store ID is required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!optimization) {
      console.error("Missing optimization data");
      return new Response(JSON.stringify({
        error: 'Optimization details are required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    console.log("Authenticating user...");
    try {
      // Extract token from Authorization header
      const token = authHeader.replace('Bearer ', '');
      
      // Verify the user's session
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        console.error("Authentication failed:", authError);
        return new Response(JSON.stringify({
          error: 'Authentication failed: ' + (authError?.message || 'Invalid token')
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        });
      }
      
      console.log("User authenticated successfully:", user.id);
    } catch (authError) {
      console.error("Exception during authentication:", authError);
      return new Response(JSON.stringify({
        error: 'Authentication error: ' + (authError.message || 'Unknown error')
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get store details
    console.log("Fetching store details...");
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (storeError || !store) {
      console.error("Error retrieving store:", storeError);
      return new Response(JSON.stringify({
        error: 'Store not found or access denied'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Validate store credentials
    if (!store.store_url || !store.access_token) {
      console.error("Invalid store credentials");
      return new Response(JSON.stringify({
        error: 'Store credentials are invalid or incomplete'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Process the optimization based on entity type
    console.log(`Processing optimization for entity type: ${optimization.entity}`);
    let result: OptimizeResult;

    try {
      if (optimization.entity === 'product') {
        result = await optimizeProduct(store, optimization);
      } else if (optimization.entity === 'shop') {
        result = await optimizeShop(store, optimization);
      } else if (optimization.entity === 'blog') {
        result = await optimizeBlog(store, optimization);
      } else if (optimization.entity === 'page') {
        result = await optimizePage(store, optimization);
      } else if (optimization.entity === 'theme') {
        result = await optimizeTheme(store, optimization);
      } else {
        return new Response(JSON.stringify({
          error: `Unsupported entity type: ${optimization.entity}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      // Record the optimization history if successful
      if (result.success) {
        await recordOptimizationHistory(supabase, storeId, optimization, result);
        console.log("Optimization applied and recorded successfully");
      }
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error applying optimization:", error);
      return new Response(JSON.stringify({
        error: `Failed to apply optimization: ${error.message || 'Unknown error'}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  } catch (error) {
    console.error("Unhandled exception:", error);
    return new Response(JSON.stringify({
      error: `An unexpected error occurred: ${error.message || 'Unknown error'}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

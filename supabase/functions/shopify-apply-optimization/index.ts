
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

    const { storeId, optimization } = body;

    if (!storeId || !optimization) {
      return new Response(JSON.stringify({
        error: 'Store ID and optimization details are required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('Processing optimization request:', {
      storeId,
      optimizationType: optimization.type,
      entity: optimization.entity,
      field: optimization.field
    });

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the user ID from the authorization header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("Failed to authenticate user:", userError);
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
      console.error("Store not found:", storeError);
      return new Response(JSON.stringify({
        error: 'Store not found'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Validate store credentials
    if (!store.store_url || !store.access_token) {
      console.error("Store missing required credentials");
      return new Response(JSON.stringify({
        error: 'Store missing required credentials'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('Found store:', { url: store.store_url });

    // Apply the optimization based on the entity type
    let result: OptimizeResult;

    try {
      switch (optimization.entity) {
        case 'product':
          result = await optimizeProduct(store, optimization);
          break;
        case 'shop':
          result = await optimizeShop(store, optimization);
          break;
        case 'blog':
          result = await optimizeBlog(store, optimization);
          break;
        case 'page':
          result = await optimizePage(store, optimization);
          break;
        case 'theme':
          result = await optimizeTheme(store, optimization);
          break;
        default:
          throw new Error(`Unsupported entity type: ${optimization.entity}`);
      }
    } catch (error) {
      console.error('Error in optimization process:', error);
      return new Response(JSON.stringify({
        error: error.message || 'Failed to apply optimization'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!result.success) {
      return new Response(JSON.stringify({
        error: result.error || 'Failed to apply optimization'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Record the optimization in the history
    let optimizationHistoryId;
    try {
      optimizationHistoryId = await recordOptimizationHistory(
        supabase,
        storeId,
        result.entityId,
        result.entityType,
        optimization.field,
        optimization.original,
        optimization.suggestion,
        user.id
      );
    } catch (error) {
      console.error('Error recording optimization history:', error);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Optimization successfully applied",
      optimizationHistoryId,
      ...result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error applying optimization:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to apply optimization'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

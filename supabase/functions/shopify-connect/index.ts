
// supabase/functions/shopify-connect/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface ShopifyConnectPayload {
  storeUrl: string;
  accessToken: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Validate auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ 
          code: 401,
          message: "Missing authorization header" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 401 
        }
      );
    }

    console.log("Shopify Connect function received request with valid auth");

    // Parse request data
    let payload: ShopifyConnectPayload;
    try {
      payload = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid request format. Expected JSON." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Validate required fields
    if (!payload.storeUrl || !payload.accessToken) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: storeUrl and accessToken are required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log(`Connecting to Shopify store: ${payload.storeUrl}`);

    // This is a mock implementation
    // In a real scenario, you would validate with Shopify API
    // For demo purposes, we're just returning success
    const store = {
      id: crypto.randomUUID(),
      user_id: "user123", // This would typically come from JWT auth
      store_name: payload.storeUrl,
      access_token: "*********************", // Don't return the actual token
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return new Response(
      JSON.stringify({ 
        store,
        message: "Store connected successfully" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in Shopify Connect function:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unknown error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

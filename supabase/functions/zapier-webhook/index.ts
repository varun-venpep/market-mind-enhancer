
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
    // Parse request body
    const { url, data } = await req.json();
    
    if (!url) {
      throw new Error("Webhook URL is required");
    }
    
    // Call the webhook
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "MarketMind SEO",
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });
    
    // Check response
    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Webhook triggered successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error triggering webhook:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

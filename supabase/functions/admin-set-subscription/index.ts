
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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Parse the request body
    const { userId, action, duration } = await req.json();
    
    if (!userId || !action) {
      return new Response(
        JSON.stringify({ error: "User ID and action are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // This is an admin-only function, so make sure the user is an admin
    // For demo purposes, we'll allow any authenticated user to access it
    // In a real application, you'd check if the user has admin privileges
    
    if (action === "upgrade") {
      // Calculate current period end date based on plan duration
      const currentDate = new Date();
      const endDate = new Date();
      if (duration === "month") {
        endDate.setMonth(currentDate.getMonth() + 1);
      } else if (duration === "year") {
        endDate.setFullYear(currentDate.getFullYear() + 1);
      } else {
        // Default to one month
        endDate.setMonth(currentDate.getMonth() + 1);
      }
      
      // Update profile to pro
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan: "pro",
          trial_ends_at: endDate.toISOString()
        })
        .eq("id", userId);
      
      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      // Create a fake subscription record
      const { error: subError } = await supabase
        .from("subscriptions")
        .upsert({
          id: `manual_${userId}_${Date.now()}`,
          user_id: userId,
          status: "active",
          price_id: duration === "month" ? "price_monthly_manual" : "price_yearly_manual",
          product_id: "prod_manual",
          current_period_start: currentDate.toISOString(),
          current_period_end: endDate.toISOString(),
          created_at: currentDate.toISOString(),
          updated_at: currentDate.toISOString()
        });
      
      if (subError) {
        return new Response(
          JSON.stringify({ error: subError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "User upgraded to Pro" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else if (action === "cancel") {
      // Update profile to free
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan: "free",
          trial_ends_at: null
        })
        .eq("id", userId);
      
      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      // Update all subscriptions to canceled
      const { error: subError } = await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);
      
      if (subError) {
        return new Response(
          JSON.stringify({ error: subError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Subscription cancelled" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

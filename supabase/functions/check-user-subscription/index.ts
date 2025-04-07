
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
    
    // Parse the request body to get the user ID to check
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, trial_ends_at")
      .eq("id", userId)
      .single();
    
    if (profileError) {
      return new Response(
        JSON.stringify({ error: profileError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Check subscription status
    const isPro = profile?.plan === "pro" && 
      (!profile?.trial_ends_at || new Date(profile.trial_ends_at) > new Date());
    
    // Get any active subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    return new Response(
      JSON.stringify({
        isPro,
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          priceId: subscription.price_id
        } : null,
        profile: {
          plan: profile?.plan || "free",
          trialEndsAt: profile?.trial_ends_at || null
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
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

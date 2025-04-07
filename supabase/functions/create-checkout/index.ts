
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@12.1.1";
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
    // Get request data
    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      throw new Error("Price ID is required");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      throw new Error("User not authenticated");
    }
    
    const userId = userData.user.id;
    const userEmail = userData.user.email;
    
    if (!userEmail) {
      throw new Error("User email not found");
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Stripe secret key is not configured");
      return new Response(
        JSON.stringify({ 
          error: "Stripe is not configured. Please contact the administrator.", 
          missingConfig: true 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    console.log("Initializing Stripe with secret key");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if the user already has a Stripe customer ID
    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (customersError) {
      console.error("Error fetching customer:", customersError);
      throw new Error(`Error fetching customer: ${customersError.message}`);
    }

    // Get or create Stripe customer
    let stripeCustomerId;
    if (customers && customers.stripe_customer_id) {
      console.log("Using existing customer:", customers.stripe_customer_id);
      stripeCustomerId = customers.stripe_customer_id;
    } else {
      // Create new Stripe customer
      console.log("Creating new Stripe customer for:", userEmail);
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_id: userId,
        },
      });
      stripeCustomerId = customer.id;
      console.log("New customer created:", stripeCustomerId);

      // Store customer ID in database
      const { error: insertError } = await supabase
        .from("customers")
        .insert({
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          email: userEmail,
        });

      if (insertError) {
        console.error("Error storing customer:", insertError);
        throw new Error(`Error storing customer: ${insertError.message}`);
      }
    }

    // Create Stripe checkout session
    console.log("Creating checkout session with price:", priceId);
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?payment=success`,
      cancel_url: `${req.headers.get("origin")}/pricing?payment=canceled`,
      subscription_data: {
        metadata: {
          user_id: userId,
        },
      },
    });

    console.log("Checkout session created:", session.id, "with URL:", session.url);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

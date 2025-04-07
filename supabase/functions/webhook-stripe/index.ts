
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@12.1.1";

// This endpoint is for Stripe webhook events
serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get the webhook secret
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not set, skipping signature verification");
    }

    // Get the stripe signature
    const signature = req.headers.get("stripe-signature");

    // Get the raw request body
    const body = await req.text();
    
    // Verify the event if webhook secret is available
    let event;
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log(`Verified webhook: ${event.type}`);
      } catch (err) {
        console.error(`⚠️ Webhook signature verification failed.`, err.message);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
        });
      }
    } else {
      // For testing or if webhook secret is not set, parse the event manually
      try {
        event = JSON.parse(body);
        console.log(`Parsed webhook without verification: ${event.type}`);
      } catch (err) {
        console.error(`⚠️ Invalid webhook payload.`, err.message);
        return new Response(JSON.stringify({ error: "Invalid payload" }), {
          status: 400,
        });
      }
    }

    console.log(`Event received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object;
        await handleSubscriptionChange(supabase, subscription, stripe);
        break;
      case "customer.subscription.deleted":
        const canceledSubscription = event.data.object;
        await handleSubscriptionCancelled(supabase, canceledSubscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`Error handling webhook:`, error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Handle subscription created or updated
async function handleSubscriptionChange(supabase, subscription, stripe) {
  const customerId = subscription.customer;
  
  // Get customer data from Stripe
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.user_id;
  
  if (!userId) {
    console.error("No user_id found in customer metadata");
    return;
  }
  
  // Update profile with subscription data
  const { error } = await supabase
    .from("profiles")
    .update({ 
      plan: "pro",
      trial_ends_at: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq("id", userId);
  
  if (error) {
    console.error("Error updating profile:", error);
  }
  
  // Save subscription in subscriptions table
  const { error: subError } = await supabase
    .from("subscriptions")
    .upsert({
      id: subscription.id,
      user_id: userId,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      product_id: subscription.items.data[0].price.product,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, 
    { onConflict: "id" });
  
  if (subError) {
    console.error("Error upserting subscription:", subError);
  }
}

// Handle subscription cancelled
async function handleSubscriptionCancelled(supabase, subscription) {
  const customerId = subscription.customer;
  
  // Get user_id from customers table
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();
  
  if (customerError) {
    console.error("Error getting customer:", customerError);
    return;
  }
  
  const userId = customerData.user_id;
  
  // Update profile to free plan
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ plan: "free", trial_ends_at: null })
    .eq("id", userId);
  
  if (profileError) {
    console.error("Error updating profile:", profileError);
  }
  
  // Update subscription status
  const { error: subError } = await supabase
    .from("subscriptions")
    .update({ 
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", subscription.id);
  
  if (subError) {
    console.error("Error updating subscription:", subError);
  }
}

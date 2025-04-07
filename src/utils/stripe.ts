
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Create a Stripe Checkout session for subscription
 * @param priceId The Stripe price ID to create checkout for
 * @returns URL to redirect to for checkout, or null if error
 */
export const createCheckoutSession = async (priceId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId }
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
      return null;
    }

    return data?.url || null;
  } catch (err) {
    console.error('Stripe checkout error:', err);
    toast.error('An error occurred while creating checkout session');
    return null;
  }
};

/**
 * Create a customer portal session to manage subscription
 * @returns URL to redirect to for customer portal, or null if error
 */
export const createCustomerPortalSession = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {});

    if (error) {
      console.error('Error creating portal session:', error);
      toast.error('Failed to create customer portal session');
      return null;
    }

    return data?.url || null;
  } catch (err) {
    console.error('Stripe portal error:', err);
    toast.error('An error occurred while creating portal session');
    return null;
  }
};

/**
 * Check subscription status
 * @returns Subscription status information
 */
export const checkSubscription = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription', {});

    if (error) {
      console.error('Error checking subscription:', error);
      return { isPro: false, subscription: null };
    }

    return {
      isPro: data?.isPro || false,
      subscription: data?.subscription || null
    };
  } catch (err) {
    console.error('Subscription check error:', err);
    return { isPro: false, subscription: null };
  }
};

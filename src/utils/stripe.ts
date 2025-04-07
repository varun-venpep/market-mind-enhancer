
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Create a Stripe Checkout session for subscription
 * @param priceId The Stripe price ID to create checkout for
 * @returns URL to redirect to for checkout, or null if error
 */
export const createCheckoutSession = async (priceId: string): Promise<string | null> => {
  try {
    // Check if we're in development/test mode
    const isTestMode = import.meta.env.DEV || window.location.hostname === 'localhost';
    
    if (isTestMode && !priceId.includes('test')) {
      // For testing purposes, redirect to a success URL without actual payment
      console.log('Test mode: Bypassing actual payment for testing');
      return `${window.location.origin}/dashboard?payment=success&test=true`;
    }
    
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId }
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session: ' + error.message);
      return null;
    }

    if (!data?.url) {
      toast.error('No checkout URL returned from server');
      return null;
    }

    return data.url;
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    toast.error('An error occurred while creating checkout session: ' + (err.message || ''));
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
    // Check if we're in development/test mode
    const isTestMode = import.meta.env.DEV || window.location.hostname === 'localhost';
    
    if (isTestMode) {
      // For testing purposes, return a fake "PRO" subscription
      console.log('Test mode: Returning test subscription data');
      return { 
        isPro: true, 
        subscription: {
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          plan: 'pro'
        }
      };
    }
    
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

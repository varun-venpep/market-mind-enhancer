
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: string;
  planName: string;
}

interface SubscriptionContextType {
  isPro: boolean;
  subscription: Subscription | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  redirectToCheckout: (priceId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  subscription: null,
  loading: true,
  checkSubscription: async () => {},
  redirectToCheckout: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPro, setIsPro] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  const checkSubscription = async () => {
    if (!user || !session) {
      setIsPro(false);
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) {
        console.error('Error checking subscription:', error);
        toast.error('Failed to check subscription status');
        setIsPro(false);
        setSubscription(null);
        return;
      }

      setIsPro(data.isPro);
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast.error('Failed to check subscription status');
      setIsPro(false);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async (priceId: string) => {
    if (!user) {
      toast.error('You must be logged in to subscribe');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Failed to create checkout session');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
    }
  };

  // Check subscription status when user or session changes
  useEffect(() => {
    if (user && session) {
      checkSubscription();
    } else {
      setIsPro(false);
      setSubscription(null);
      setLoading(false);
    }
  }, [user, session]);

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        subscription,
        loading,
        checkSubscription,
        redirectToCheckout,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

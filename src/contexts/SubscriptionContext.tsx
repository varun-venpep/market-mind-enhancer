
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkSubscription } from '@/utils/stripe';

interface SubscriptionContextType {
  isPro: boolean;
  isLoading: boolean;
  loading: boolean; // Added for backward compatibility
  subscription: any;
  refreshSubscription: () => void;
  hasActiveSubscription: boolean;
  hasTrialEnded: boolean;
  trialEndDate: Date | null;
  manageBilling: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  isLoading: true,
  loading: true, // Added for backward compatibility
  subscription: null,
  refreshSubscription: () => {},
  hasActiveSubscription: false,
  hasTrialEnded: false,
  trialEndDate: null,
  manageBilling: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [hasTrialEnded, setHasTrialEnded] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);

  const fetchSubscriptionStatus = async () => {
    if (!user) {
      setIsLoading(false);
      setIsPro(false);
      setSubscription(null);
      setHasActiveSubscription(false);
      setHasTrialEnded(false);
      setTrialEndDate(null);
      return;
    }

    try {
      setIsLoading(true);
      
      // Call an API endpoint to check subscription status using our utility
      const result = await checkSubscription();
      
      if (result.subscription) {
        setSubscription(result.subscription);
        setIsPro(result.isPro);
        
        if (result.subscription.currentPeriodEnd) {
          const trialEnd = new Date(result.subscription.currentPeriodEnd);
          setTrialEndDate(trialEnd);
          setHasTrialEnded(trialEnd < new Date());
        }
        
        setHasActiveSubscription(result.subscription.status === 'active');
      } else {
        // Call an API endpoint to check subscription status from the database instead
        const { data, error } = await supabase.functions.invoke('check-user-subscription', {
          body: { user_id: user.id }
        });
        
        if (error) {
          console.error('Error fetching subscription:', error);
          toast.error('Failed to load subscription information');
          setIsLoading(false);
          return;
        }
        
        if (data) {
          setSubscription(data);
          setIsPro(data.plan === 'pro');
          
          if (data.trial_ends_at) {
            const trialEnd = new Date(data.trial_ends_at);
            setTrialEndDate(trialEnd);
            setHasTrialEnded(trialEnd < new Date());
          }
          
          setHasActiveSubscription(data.status === 'active');
        }
      }
    } catch (error) {
      console.error('Error in subscription check:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [user]);

  const refreshSubscription = () => {
    fetchSubscriptionStatus();
  };

  const manageBilling = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {});
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('Failed to open billing portal');
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        isLoading,
        loading: isLoading, // Set loading to match isLoading for backward compatibility
        subscription,
        refreshSubscription,
        hasActiveSubscription,
        hasTrialEnded,
        trialEndDate,
        manageBilling,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionContextType {
  isPro: boolean;
  isLoading: boolean;
  subscription: any;
  refreshSubscription: () => void;
  hasActiveSubscription: boolean;
  hasTrialEnded: boolean;
  trialEndDate: Date | null;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  isLoading: true,
  subscription: null,
  refreshSubscription: () => {},
  hasActiveSubscription: false,
  hasTrialEnded: false,
  trialEndDate: null,
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
      
      // Call an API endpoint to check subscription status instead of direct DB access
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

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        isLoading,
        subscription,
        refreshSubscription,
        hasActiveSubscription,
        hasTrialEnded,
        trialEndDate,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

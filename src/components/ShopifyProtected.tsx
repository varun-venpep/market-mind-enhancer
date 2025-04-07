
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import UpgradePrompt from './UpgradePrompt';

interface ShopifyProtectedProps {
  children: React.ReactNode;
}

export const ShopifyProtected = ({ children }: ShopifyProtectedProps) => {
  const { isPro, loading } = useSubscription();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Shopify Integration</h1>
          <p className="text-muted-foreground">
            Connect and optimize your Shopify store content for better search visibility.
          </p>
        </div>

        <div className="mt-8">
          <UpgradePrompt 
            title="Upgrade to Connect Shopify Stores"
            description="This feature is exclusive to Pro subscribers. Upgrade today to connect and optimize your Shopify stores."
            features={[
              "Connect unlimited Shopify stores",
              "Automatic product content optimization",
              "SEO analysis for all products",
              "Bulk SEO improvements",
              "AI-generated product descriptions"
            ]}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

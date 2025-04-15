
import { useEffect, useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import UpgradePrompt from './UpgradePrompt';
import { useLocation } from 'react-router-dom';

interface ShopifyProtectedProps {
  children: React.ReactNode;
}

export const ShopifyProtected = ({ children }: ShopifyProtectedProps) => {
  const { isPro, loading } = useSubscription();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  
  // Check if we're in a development/test environment
  // const isTestMode = import.meta.env.DEV || window.location.hostname === 'localhost';

  // Check if current page is the Shopify connection page or API integrations page
  const isIntegrationPage = 
    location.pathname.includes('/dashboard/api-integrations') || 
    location.pathname.includes('/dashboard/integrations') || 
    location.pathname.includes('/dashboard/custom-site');

  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    const checkingTimeout = setTimeout(() => {
      setIsChecking(false);
    }, 1000); // Reduced from 2000ms for faster response

    if (!loading) {
      setIsChecking(false);
      clearTimeout(checkingTimeout);
    }
    
    return () => {
      clearTimeout(checkingTimeout);
    };
  }, [loading]);

  // Always grant access in development/test mode or on integration pages
  // if (isTestMode || isIntegrationPage) {
  //   console.log('Development mode or integration page: bypassing subscription check for Shopify/integration features');
  //   return <>{children}</>;
  // }

  // // Show loading state, but with a timeout to prevent getting stuck
  // if (isChecking) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  // // Show upgrade prompt if user is not a Pro subscriber
  // if (!isPro) {
  //   return (
  //     <div className="container mx-auto py-8 px-4">
  //       <div className="mb-8">
  //         <h1 className="text-2xl font-bold mb-2">Shopify Integration</h1>
  //         <p className="text-muted-foreground">
  //           Connect and optimize your Shopify store content for better search visibility.
  //         </p>
  //       </div>

  //       <div className="mt-8">
  //         <UpgradePrompt 
  //           title="Upgrade to Connect Shopify Stores"
  //           description="This feature is exclusive to Pro subscribers. Upgrade today to connect and optimize your Shopify stores."
  //           features={[
  //             "Connect unlimited Shopify stores",
  //             "Automatic product content optimization",
  //             "SEO analysis for all products",
  //             "Bulk SEO improvements",
  //             "AI-generated product descriptions"
  //           ]}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

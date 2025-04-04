
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LockIcon, Sparkles, CheckIcon, ZapIcon } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  title?: string;
  description?: string;
  features?: string[];
  priceId?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  title = "Unlock Premium Features",
  description = "Upgrade to our Pro plan to access this feature and many more.",
  features = [
    "Connect unlimited Shopify stores",
    "Advanced SEO analysis",
    "Automatic content optimization",
    "Custom content briefs"
  ],
  priceId = "price_1OtbDSKnT5Cm1MKlMVLrV3ZH" // Default Stripe price ID
}) => {
  const { isPro, redirectToCheckout } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }
    
    await redirectToCheckout(priceId);
  };

  // If the user already has a pro subscription, don't show the upgrade prompt
  if (isPro) {
    return null;
  }

  return (
    <Card className="border-gradient shadow-lg max-w-md mx-auto w-full">
      <CardHeader className="pb-4 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <LockIcon className="h-5 w-5 mr-2 text-brand-500" />
            {title}
          </CardTitle>
          <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">
            Pro Feature
          </Badge>
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="rounded-full bg-brand-50 p-1 mt-0.5">
                <CheckIcon className="h-4 w-4 text-brand-500" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpgrade}
          className="w-full gradient-button group"
        >
          <ZapIcon className="h-4 w-4 mr-2 group-hover:animate-pulse" />
          Upgrade to Pro
        </Button>
      </CardFooter>
    </Card>
  );
};

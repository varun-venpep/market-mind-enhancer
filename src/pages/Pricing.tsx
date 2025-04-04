
import { useState } from 'react';
import { Check, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PricingPage = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const { isPro, subscription, redirectToCheckout } = useSubscription();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      // Redirect to login page with return URL
      navigate('/login?redirect=/pricing');
      return;
    }

    try {
      await redirectToCheckout(priceId);
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to start checkout process. Please try again.');
    }
  };

  // Price IDs for Stripe (replace with your actual Stripe price IDs)
  const priceIds = {
    monthly: 'price_1OtbDSKnT5Cm1MKlMVLrV3ZH',
    yearly: 'price_1OtbDuKnT5Cm1MKlnefBQTin'
  };

  // Pricing data
  const plans = [
    {
      name: 'Free',
      description: 'Basic features for getting started with SEO.',
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: 'Basic SEO content brief', included: true },
        { name: 'Content optimization suggestions', included: true },
        { name: 'Up to 5 content briefs', included: true },
        { name: 'Connect 1 Shopify store', included: true },
        { name: 'Basic SEO analysis', included: true },
        { name: 'AI-powered keyword research', included: false },
        { name: 'Advanced content optimization', included: false },
        { name: 'Unlimited content briefs', included: false },
        { name: 'Connect unlimited Shopify stores', included: false },
        { name: 'Bulk SEO optimization', included: false },
      ],
      cta: 'Get Started',
      priceId: null,
    },
    {
      name: 'Pro',
      description: 'Advanced features for serious content creators.',
      price: { monthly: 49, yearly: 490 },
      features: [
        { name: 'Basic SEO content brief', included: true },
        { name: 'Content optimization suggestions', included: true },
        { name: 'Unlimited content briefs', included: true },
        { name: 'Connect unlimited Shopify stores', included: true },
        { name: 'Advanced SEO analysis', included: true },
        { name: 'AI-powered keyword research', included: true },
        { name: 'Advanced content optimization', included: true },
        { name: 'Priority customer support', included: true },
        { name: 'Bulk SEO optimization', included: true },
        { name: 'API access', included: true },
      ],
      cta: isPro ? 'Current Plan' : 'Upgrade',
      priceId: billingInterval === 'monthly' ? priceIds.monthly : priceIds.yearly,
      highlight: true,
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works best for your SEO needs. Upgrade or downgrade anytime.
        </p>

        <Tabs 
          defaultValue="monthly" 
          value={billingInterval}
          onValueChange={(value) => setBillingInterval(value as 'monthly' | 'yearly')}
          className="w-fit mx-auto mt-6"
        >
          <TabsList className="grid w-[300px] grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary" className="ml-2 bg-brand-50 text-brand-900">Save 15%</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative flex flex-col ${
              plan.highlight ? 'border-brand-500 shadow-lg' : ''
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Badge className="bg-brand-500 text-white px-3 py-1 rounded-full">Popular</Badge>
              </div>
            )}
            <CardHeader className="flex flex-col">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {plan.description}
              </CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold tracking-tight">
                  ${plan.price[billingInterval]}
                </span>
                {plan.price[billingInterval] > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    /{billingInterval === 'monthly' ? 'month' : 'year'}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                    )}
                    <span className={!feature.included ? 'text-muted-foreground' : ''}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.highlight ? 'gradient-button' : plan.name === 'Free' ? 'bg-muted' : ''
                }`}
                onClick={() => {
                  if (plan.priceId) {
                    handleSubscribe(plan.priceId);
                  } else if (plan.name === 'Free') {
                    navigate('/dashboard');
                  }
                }}
                disabled={plan.name === 'Pro' && isPro}
              >
                {plan.highlight && <Zap className="h-4 w-4 mr-2" />}
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Can I cancel my subscription?</h4>
            <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period.</p>
          </div>
          <div>
            <h4 className="font-medium">Is there a free trial?</h4>
            <p className="text-muted-foreground">Yes, you can use our Free plan with limited features indefinitely.</p>
          </div>
          <div>
            <h4 className="font-medium">What payment methods do you accept?</h4>
            <p className="text-muted-foreground">We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

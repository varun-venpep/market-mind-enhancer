
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { createCheckoutSession } from '@/utils/stripe';
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from 'react-helmet';

const PricingPage = () => {
  const { user } = useAuth();
  const { isPro, loading: subscriptionLoading, refreshSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if we're in a development/test environment
  const isTestMode = import.meta.env.DEV || window.location.hostname === 'localhost';

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    setIsLoading(true);

    try {
      if (isTestMode) {
        // In test mode, simulate a successful subscription
        console.log('Test mode: Simulating subscription process');
        setTimeout(() => {
          refreshSubscription();
          navigate('/dashboard?payment=success&test=true');
          toast.success('Test subscription activated!');
        }, 1500);
        return;
      }
      
      const url = await createCheckoutSession(priceId);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session: " + (error.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  // URL query parsing to show success/failure messages
  const { search } = window.location;
  const urlParams = new URLSearchParams(search);
  const paymentStatus = urlParams.get('payment');
  const isTestPayment = urlParams.get('test') === 'true';

  // Show feedback based on payment status
  React.useEffect(() => {
    if (paymentStatus === 'success') {
      if (isTestPayment) {
        toast.success('Test subscription activated successfully!');
      } else {
        toast.success('Subscription activated successfully!');
      }
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('test');
      window.history.replaceState({}, '', url.toString());
    } else if (paymentStatus === 'canceled') {
      toast.info('Subscription process was canceled');
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());
    }
  }, [paymentStatus, isTestPayment]);

  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      description: "Get started with basic SEO tools",
      price: "$0",
      interval: "forever",
      features: [
        "Basic keyword research",
        "Up to 5 content briefs",
        "Weekly domain analysis",
        "10 SERP analysis queries/month",
        "Basic content optimization",
      ],
      limitations: [
        "No Shopify integration",
        "No WordPress integration",
        "Limited keyword tracking",
        "Basic reporting",
      ],
      priceId: "",
      highlight: false,
    },
    {
      name: "Pro",
      description: "Advanced tools for serious marketers",
      price: "$49",
      interval: "month",
      features: [
        "Advanced keyword research",
        "Unlimited content briefs",
        "Daily domain analysis",
        "100 SERP analysis queries/month",
        "Advanced content optimization",
        "Shopify integration",
        "WordPress integration",
        "Unlimited keyword tracking",
        "Advanced reporting",
        "Priority support",
      ],
      limitations: [],
      priceId: "price_pro_monthly",
      highlight: true,
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large businesses",
      price: "Custom",
      interval: "month",
      features: [
        "All Pro features",
        "Dedicated account manager",
        "Custom API access",
        "White-label reports",
        "Enterprise SLA",
        "Unlimited SERP analysis",
        "Custom integrations",
        "Multi-user access",
      ],
      limitations: [],
      priceId: "",
      highlight: false,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pricing | MarketMind</title>
        <meta name="description" content="MarketMind pricing plans for SEO optimization" />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-12 px-4 md:px-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the perfect plan for your SEO needs. Upgrade anytime as your business grows.
          </p>
          {isTestMode && (
            <p className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md max-w-xl mx-auto text-sm">
              ✨ Development Mode: You can test the Pro features without real payment ✨
            </p>
          )}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col h-full ${
                plan.highlight 
                  ? 'border-primary shadow-lg shadow-primary/10 relative overflow-hidden' 
                  : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0">
                  <Badge className="m-2 bg-primary text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  )}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-center text-sm text-muted-foreground">
                      <XIcon className="text-muted-foreground mr-2 h-5 w-5 flex-shrink-0" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-0">
                {plan.name === "Free" ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={subscriptionLoading}
                    onClick={() => toast("You're already on the Free plan")}
                  >
                    Current Plan
                  </Button>
                ) : plan.name === "Pro" ? (
                  isPro ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full gradient-button" 
                      onClick={() => handleSubscribe(plan.priceId)}
                      disabled={isLoading || !user}
                    >
                      {isLoading ? "Processing..." : user ? "Subscribe Now" : "Sign In to Subscribe"}
                    </Button>
                  )
                ) : (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.location.href = "mailto:sales@marketmind.com?subject=Enterprise Plan Inquiry"}
                  >
                    Contact Sales
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the end of your current billing cycle.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How does the Shopify integration work?</h3>
              <p className="text-muted-foreground">Our Shopify integration allows you to connect your store and automatically optimize product listings, meta descriptions, and content for better SEO performance.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a free trial for Pro?</h3>
              <p className="text-muted-foreground">Yes, we offer a 14-day free trial for our Pro plan. No credit card required until you decide to continue.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;

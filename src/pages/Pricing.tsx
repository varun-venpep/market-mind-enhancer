
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      description: "For individuals getting started with content research",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        "5 keyword searches per month",
        "3 content briefs per month",
        "Basic search insights",
        "Limited competitor analysis",
        "Standard content score",
      ],
      limitations: [
        "No AI optimization suggestions",
        "No advanced SERP analysis",
        "Limited keyword metrics",
        "No topic clustering",
        "No team collaboration",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "For content creators and marketing professionals",
      price: {
        monthly: 29,
        yearly: 290,
      },
      features: [
        "Unlimited keyword searches",
        "Unlimited content briefs",
        "Advanced search insights",
        "Full competitor analysis",
        "AI content optimization",
        "Topic clustering",
        "Content score prediction",
        "AI search engine optimization",
        "Export to PDF/Word/Google Docs",
        "Priority support",
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true,
      trial: "30-day free trial",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
              <p className="text-xl text-muted-foreground">
                Choose the plan that's right for your content strategy
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <Tabs
                defaultValue="monthly"
                value={billingCycle}
                onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")}
                className="w-full max-w-md"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (20% off)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${
                    plan.popular
                      ? "shadow-xl border-brand-500 border-2"
                      : "border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="p-6">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex-1">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                      </span>
                      {billingCycle === "monthly" ? (
                        <span className="text-muted-foreground ml-1">/month</span>
                      ) : (
                        <span className="text-muted-foreground ml-1">/year</span>
                      )}

                      {plan.trial && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
                          {plan.trial}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">What's included:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.limitations.length > 0 && (
                        <>
                          <h4 className="font-medium mt-6">Limitations:</h4>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation) => (
                              <li key={limitation} className="flex items-center gap-3">
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground text-sm">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button
                      className={`w-full ${
                        plan.popular ? "gradient-button" : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link to={plan.popular ? "/signup" : "/signup"}>
                        {plan.cta}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    q: "How does the 30-day free trial work?",
                    a: "You can try all Pro features for 30 days with no commitment. We'll send a reminder before the trial ends, and you can cancel anytime."
                  },
                  {
                    q: "Can I upgrade or downgrade my plan?",
                    a: "Yes, you can upgrade to Pro at any time. You can also downgrade to the Free plan if your needs change."
                  },
                  {
                    q: "Do you offer refunds?",
                    a: "We offer a 7-day refund policy for yearly subscriptions if you're not satisfied with our service."
                  },
                  {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards, including Visa, Mastercard, and American Express."
                  }
                ].map((faq, i) => (
                  <Card key={i} className="text-left">
                    <CardHeader>
                      <CardTitle className="text-base">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;

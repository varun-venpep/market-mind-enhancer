
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [annualBilling, setAnnualBilling] = useState(false);
  const monthlyPrice = 29;
  const annualPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount for annual

  const handleFreePlanSelect = () => {
    navigate("/signup");
    toast({
      title: "Free plan selected",
      description: "Sign up to get started with the free plan.",
    });
  };

  const handleProPlanSelect = () => {
    navigate("/signup?plan=pro");
    toast({
      title: "Pro plan selected",
      description: "Sign up to start your 30-day free trial.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Simple, transparent pricing
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Choose the plan that's right for you and start creating content that ranks
              </p>
              
              <div className="flex items-center justify-center space-x-3 mb-8">
                <span className={`text-sm ${!annualBilling ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <div className="flex items-center">
                  <Switch
                    id="billing-toggle"
                    checked={annualBilling}
                    onCheckedChange={setAnnualBilling}
                  />
                </div>
                <span className={`text-sm ${annualBilling ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                  Annual <span className="text-emerald-600 font-medium">Save 20%</span>
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                <div className="p-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Free</h3>
                  <div className="flex items-baseline mt-4 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">$0</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">Perfect for getting started with content optimization</p>
                  <Button 
                    onClick={handleFreePlanSelect}
                    variant="outline" 
                    className="w-full mb-6"
                  >
                    Get started for free
                  </Button>
                  
                  <ul className="space-y-4">
                    <li className="flex">
                      <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">5 content briefs per month</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Basic keyword research</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Content scoring</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">SEO recommendations</span>
                    </li>
                    <li className="flex">
                      <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">AI content optimization</span>
                    </li>
                    <li className="flex">
                      <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">Competitor analysis</span>
                    </li>
                    <li className="flex">
                      <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">Advanced analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-brand-600 text-white rounded-xl shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-brand-800 text-white py-1 px-3 text-xs uppercase font-semibold tracking-wider rounded-bl-lg">
                  Popular
                </div>
                <div className="p-8">
                  <h3 className="text-lg font-medium mb-2">Pro</h3>
                  <div className="flex items-baseline mt-4 mb-6">
                    <span className="text-4xl font-extrabold">${annualBilling ? Math.round(monthlyPrice * 0.8) : monthlyPrice}</span>
                    <span className="opacity-80 ml-1">/month</span>
                  </div>
                  <p className="opacity-90 mb-2">Full access to all features</p>
                  <p className="text-brand-200 text-sm mb-6">First 30 days free, cancel anytime</p>
                  <Button 
                    onClick={handleProPlanSelect}
                    className="w-full mb-6 bg-white text-brand-600 hover:bg-brand-50"
                  >
                    Start 30-day free trial
                  </Button>
                  
                  <ul className="space-y-4">
                    <li className="flex">
                      <Check className="h-5 w-5 text-brand-200 mr-3 flex-shrink-0" />
                      <span className="opacity-90">Unlimited content briefs</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-brand-200 mr-3 flex-shrink-0" />
                      <span className="opacity-90">Advanced keyword research</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-brand-200 mr-3 flex-shrink-0" />
                      <span className="opacity-90">In-depth content scoring</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-brand-200 mr-3 flex-shrink-0" />
                      <span className="opacity-90">AI content optimization</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-brand-200 mr-3 flex-shrink-0" />
                      <span className="opacity-90">Competitor analysis</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-brand-200 mr-3 flex-shrink-0" />
                      <span className="opacity-90">Advanced analytics & reporting</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-brand-200 mr-3 flex-shrink-0" />
                      <span className="opacity-90">Priority support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-16 bg-gray-50 border border-gray-200 rounded-xl p-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Frequently asked questions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">What happens after my free trial?</h4>
                  <p className="text-gray-600">
                    After your 30-day free trial, you'll be automatically billed at our standard rate. 
                    You can cancel anytime before the trial ends to avoid charges.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Can I switch plans later?</h4>
                  <p className="text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected immediately
                    in your account access and on your next billing cycle.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h4>
                  <p className="text-gray-600">
                    We accept all major credit cards and debit cards. For annual plans, we also offer 
                    invoicing options for businesses.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Is there a refund policy?</h4>
                  <p className="text-gray-600">
                    We offer a 14-day money-back guarantee if you're not satisfied with our Pro plan after
                    the free trial period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;

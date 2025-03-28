
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const features = [
  "5 free content briefs per month",
  "Basic keyword analysis",
  "AI search intent insights",
  "Content scoring",
  "No credit card required"
];

const CTA = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-800 mix-blend-multiply" />
          </div>
          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:py-32 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Create content that ranks higher
                </h2>
                <p className="mt-4 text-lg text-brand-100">
                  Start optimizing your content for both traditional search engines and AI platforms like ChatGPT and Perplexity.
                </p>
                
                <div className="mt-8">
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-shrink-0">
                          <Check className="h-6 w-6 text-brand-200" />
                        </div>
                        <p className="ml-3 text-base text-white">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white py-8 px-6 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Get started in seconds</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>
                  <div>
                    <Button className="w-full gradient-button" size="lg">
                      Create free account
                    </Button>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-brand-600 hover:text-brand-500">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-brand-600 hover:text-brand-500">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:text-left lg:col-span-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 sm:mt-5 sm:leading-none lg:mt-6">
              <span className="md:block">Supercharge your</span>{" "}
              <span className="gradient-text md:block">content strategy</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl">
              MarketMind uses advanced AI to analyze search intent, generate SEO-optimized content briefs, and help you create content that ranks high on both traditional and AI-powered search engines.
            </p>
            <div className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Button asChild className="gradient-button w-full px-8 py-6 text-lg" size="lg">
                  <Link to="/signup">
                    Get started for free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button variant="outline" asChild className="w-full px-8 py-6 text-lg" size="lg">
                  <Link to="/demo">Watch demo</Link>
                </Button>
              </div>
            </div>
            <div className="mt-6 text-sm">
              <p className="text-gray-500">No credit card required. Free plan includes 5 content briefs per month.</p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-800 font-medium">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Trusted by <span className="font-medium text-gray-800">2,000+</span> marketers and content creators
              </p>
            </div>
          </div>
          
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
            <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden lg:max-w-none shadow-xl border border-gray-200">
              <div className="relative rounded-lg overflow-hidden">
                <div className="px-4 py-8 sm:px-10 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="relative h-64 sm:h-80 w-full bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-10 bg-gray-200 rounded w-full"></div>
                          <div className="h-10 bg-brand-100 rounded w-full"></div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    </div>
                    
                    {/* Animated shimmer effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                </div>
                
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-500/20 to-transparent opacity-30 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

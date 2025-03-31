
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Search, BarChart3, TrendingUp, Lightbulb, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const features = [
    { icon: Search, title: "AI-Powered Analysis", description: "Instantly analyze search intent with our AI algorithms" },
    { icon: BarChart3, title: "Rank Higher", description: "Optimize for both traditional and AI search engines" },
    { icon: TrendingUp, title: "Grow Faster", description: "Convert more visitors with targeted content strategies" }
  ];

  return (
    <div className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-brand-400/10 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 20, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full bg-brand-500/10 blur-3xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -30, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 25,
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div 
            className="sm:text-center md:text-left lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 sm:mt-5 sm:leading-none lg:mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="md:block">Unlock your content's</span>{" "}
              <span className="gradient-text md:block">true potential</span>
            </motion.h1>
            
            <motion.p 
              className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              MarketMind uses advanced AI to analyze search intent, generate SEO-optimized content briefs, and help you create content that ranks high on both traditional and AI-powered search engines.
            </motion.p>
            
            <motion.div 
              className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="rounded-md shadow">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild className="gradient-button w-full px-8 py-6 text-lg" size="lg">
                    <Link to="/signup">
                      Get started for free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" asChild className="w-full px-8 py-6 text-lg" size="lg">
                    <Link to="/demo">Watch demo</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-6 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-gray-500">No credit card required. Free plan includes 5 content briefs per month.</p>
            </motion.div>
            
            <motion.div 
              className="mt-10 space-y-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-brand-500 text-white">
                        <feature.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex flex-wrap gap-4 items-center justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
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
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden lg:max-w-none shadow-xl border border-gray-200">
              <div className="relative rounded-lg overflow-hidden">
                <div className="px-4 py-8 sm:px-10 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="relative h-64 sm:h-80 w-full bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    {/* Step by step animation */}
                    <div className="p-4">
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                              <span className="text-brand-700 font-bold">1</span>
                            </div>
                            <div className="flex-1">
                              <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                              <div className="h-3 bg-gray-100 rounded w-3/5 mt-1"></div>
                            </div>
                          </div>
                        </div>
                        
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 1 }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                              <span className="text-brand-700 font-bold">2</span>
                            </div>
                            <div className="flex-1">
                              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-100 rounded w-2/3 mt-1"></div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 2 }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center mr-3">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="h-5 bg-brand-100 rounded w-full"></div>
                              <div className="h-3 bg-brand-50 rounded w-1/2 mt-1"></div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    {/* Animated shimmer effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                </div>
                
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-500/20 to-transparent opacity-30 pointer-events-none"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;


import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturesContent from '@/components/Features';

const Features = () => {
  // Force dark mode for marketing pages
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    
    // Cleanup
    return () => {
      // Don't remove dark here, let theme provider handle it
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Features | MarketMind</title>
        <meta name="description" content="Explore all the features of MarketMind's SEO platform" />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto py-12 px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl font-bold mb-4 text-white">MarketMind Features</h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive tools to optimize your website for search engines
              </p>
            </div>
            
            <FeaturesContent />
            
            <div className="mt-20 bg-card rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to optimize your website?</h2>
              <p className="text-lg mb-6">Start using our powerful SEO tools today and see the difference.</p>
              <div className="flex justify-center gap-4">
                <a href="/signup" className="gradient-button px-6 py-3 rounded-lg text-white font-medium">
                  Get Started Free
                </a>
                <a href="/pricing" className="bg-accent px-6 py-3 rounded-lg text-white font-medium hover:bg-accent/80 transition-colors">
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Features;

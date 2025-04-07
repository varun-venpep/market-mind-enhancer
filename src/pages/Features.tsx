
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Features = () => {
  return (
    <>
      <Helmet>
        <title>Features | SEO Wizard</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">SEO Wizard Features</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools to optimize your website for search engines
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {/* Feature cards would go here */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Keyword Research</h3>
              <p className="text-muted-foreground">
                Discover high-value keywords with our advanced research tools.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Content Briefs</h3>
              <p className="text-muted-foreground">
                Generate comprehensive content briefs based on top-performing content.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">SERP Analysis</h3>
              <p className="text-muted-foreground">
                Analyze search results to understand what's working for your competitors.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Shopify Integration</h3>
              <p className="text-muted-foreground">
                Connect your Shopify store for automatic product optimization.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">AI Content Generation</h3>
              <p className="text-muted-foreground">
                Create high-quality content drafts with our AI-powered tools.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">SEO Audits</h3>
              <p className="text-muted-foreground">
                Identify and fix SEO issues with comprehensive site audits.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Features;

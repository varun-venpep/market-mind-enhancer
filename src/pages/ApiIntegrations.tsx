
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShopifyConnect from "@/components/ShopifyConnect";
import WordPressConnect from "@/components/integrations/WordPressConnect";
import ZapierConnect from "@/components/integrations/ZapierConnect";
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const ApiIntegrations = () => {
  const [activeTab, setActiveTab] = useState("shopify");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // For testing, we consider all users as pro users
  const isPro = true;

  useEffect(() => {
    // Shorter loading time to improve experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-12">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please log in to access the API integrations
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Helmet>
        <title>API Integrations | MarketMind</title>
        <meta name="description" content="Connect your websites and tools to MarketMind's SEO platform" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">API Integrations</h1>
          <p className="text-muted-foreground">
            Connect your websites and tools to MarketMind for automated SEO optimization
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading integrations...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={handleRetry}
            >
              Retry
            </Button>
          </Alert>
        ) : (
          <Tabs defaultValue="shopify" value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="shopify">Shopify</TabsTrigger>
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="zapier">Zapier</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shopify">
              <ShopifyConnect />
            </TabsContent>
            
            <TabsContent value="wordpress">
              <WordPressConnect />
            </TabsContent>
            
            <TabsContent value="zapier">
              <ZapierConnect />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default ApiIntegrations;

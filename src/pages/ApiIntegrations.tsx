
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShopifyConnect from "@/components/ShopifyConnect";
import WordPressConnect from "@/components/integrations/WordPressConnect";
import ZapierConnect from "@/components/integrations/ZapierConnect";
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import UpgradePrompt from '@/components/UpgradePrompt';

const ApiIntegrations = () => {
  const [activeTab, setActiveTab] = useState("shopify");
  const { user } = useAuth();
  const { isPro } = useSubscription();

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
        
        <Tabs defaultValue="shopify" value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="shopify">Shopify</TabsTrigger>
            <TabsTrigger value="wordpress" disabled={!isPro}>WordPress {!isPro && '(Pro)'}</TabsTrigger>
            <TabsTrigger value="zapier" disabled={!isPro}>Zapier {!isPro && '(Pro)'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shopify">
            <ShopifyConnect />
          </TabsContent>
          
          <TabsContent value="wordpress">
            {isPro ? (
              <WordPressConnect />
            ) : (
              <UpgradePrompt 
                title="Upgrade to Connect WordPress"
                description="Unlock WordPress integration to audit and optimize your WordPress sites"
                features={[
                  "Analyze WordPress SEO performance",
                  "Bulk optimize all posts and pages",
                  "Auto-update meta descriptions",
                  "Integrate with Yoast SEO and other plugins",
                  "Schedule regular SEO audits"
                ]}
              />
            )}
          </TabsContent>
          
          <TabsContent value="zapier">
            {isPro ? (
              <ZapierConnect />
            ) : (
              <UpgradePrompt 
                title="Upgrade to Connect Zapier"
                description="Automate your SEO workflows with Zapier integration"
                features={[
                  "Create Zaps triggered by SEO events",
                  "Automatically create content briefs from RSS feeds",
                  "Send SEO reports to team members",
                  "Connect with 3000+ other apps",
                  "Build custom SEO automation workflows"
                ]}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ApiIntegrations;

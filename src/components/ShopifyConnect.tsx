
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Key, ShoppingBag, Store } from "lucide-react";
import { connectShopifyStore } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ShopifyConnect() {
  const [storeUrl, setStoreUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecretKey, setApiSecretKey] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleConnectWithAPI = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your Shopify store",
        variant: "destructive"
      });
      return;
    }

    let formattedUrl = storeUrl.trim();
    
    // Remove protocol if present
    if (formattedUrl.startsWith('http://') || formattedUrl.startsWith('https://')) {
      formattedUrl = formattedUrl.replace(/^https?:\/\//, '');
    }
    
    // Remove trailing slash if present
    if (formattedUrl.endsWith('/')) {
      formattedUrl = formattedUrl.slice(0, -1);
    }
    
    // Add .myshopify.com if it's not present and doesn't include any dots
    if (!formattedUrl.includes('.')) {
      formattedUrl = `${formattedUrl}.myshopify.com`;
    }

    setIsLoading(true);
    
    try {
      await connectShopifyStore({
        storeUrl: formattedUrl,
        apiKey,
        apiSecretKey
      });
      
      toast({
        title: "Store Connected",
        description: "Your Shopify store was successfully connected",
        variant: "default"
      });
      
      // Reset form
      setStoreUrl('');
      setApiKey('');
      setApiSecretKey('');
      
      // Trigger a reload or navigation (parent component should handle this)
      window.location.reload();
    } catch (error) {
      console.error('Shopify connection error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Shopify store",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your Shopify store",
        variant: "destructive"
      });
      return;
    }

    let formattedUrl = storeUrl.trim();
    
    // Remove protocol if present
    if (formattedUrl.startsWith('http://') || formattedUrl.startsWith('https://')) {
      formattedUrl = formattedUrl.replace(/^https?:\/\//, '');
    }
    
    // Remove trailing slash if present
    if (formattedUrl.endsWith('/')) {
      formattedUrl = formattedUrl.slice(0, -1);
    }
    
    // Add .myshopify.com if it's not present and doesn't include any dots
    if (!formattedUrl.includes('.')) {
      formattedUrl = `${formattedUrl}.myshopify.com`;
    }

    setIsLoading(true);
    
    try {
      await connectShopifyStore({
        storeUrl: formattedUrl,
        accessToken
      });
      
      toast({
        title: "Store Connected",
        description: "Your Shopify store was successfully connected",
        variant: "default"
      });
      
      // Reset form
      setStoreUrl('');
      setAccessToken('');
      
      // Trigger a reload or navigation
      window.location.reload();
    } catch (error) {
      console.error('Shopify connection error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Shopify store",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg hover-card bg-card border-muted/40">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShoppingBag className="h-6 w-6 text-primary" />
          Connect Shopify Store
        </CardTitle>
        <CardDescription className="text-base">
          Connect your Shopify store to start optimizing product SEO automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="token" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="api">API Key Method</TabsTrigger>
            <TabsTrigger value="token">Access Token Method</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api">
            <form onSubmit={handleConnectWithAPI} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeUrl" className="text-sm font-medium">
                  <Store className="h-4 w-4 inline mr-1" />
                  Shopify Store URL
                </Label>
                <Input
                  id="storeUrl"
                  placeholder="your-store.myshopify.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-sm font-medium">
                  <Key className="h-4 w-4 inline mr-1" />
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  placeholder="Enter your Shopify API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiSecretKey" className="text-sm font-medium">
                  <Key className="h-4 w-4 inline mr-1" />
                  API Secret Key
                </Label>
                <Input
                  id="apiSecretKey"
                  type="password"
                  placeholder="Enter your Shopify API secret key"
                  value={apiSecretKey}
                  onChange={(e) => setApiSecretKey(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full gap-2 hover:shadow-md transition-all"
                >
                  {isLoading ? "Connecting..." : "Connect Store"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="token">
            <form onSubmit={handleConnectWithToken} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeUrlToken" className="text-sm font-medium">
                  <Store className="h-4 w-4 inline mr-1" />
                  Shopify Store URL
                </Label>
                <Input
                  id="storeUrlToken"
                  placeholder="your-store.myshopify.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessToken" className="text-sm font-medium">
                  <Key className="h-4 w-4 inline mr-1" />
                  Access Token
                </Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Enter your Shopify access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="bg-background/50"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can find your access token in your Shopify admin under Apps ➝ Develop apps ➝ Private apps
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full gap-2 hover:shadow-md transition-all"
                >
                  {isLoading ? "Connecting..." : "Connect with Token"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t px-6 py-4 bg-muted/5">
        <p className="text-xs text-muted-foreground">
          Your credentials are securely stored and used only for SEO optimization. <a href="https://shopify.dev/docs/admin-api/access-token" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn how to get your API keys</a>
        </p>
      </CardFooter>
    </Card>
  );
}

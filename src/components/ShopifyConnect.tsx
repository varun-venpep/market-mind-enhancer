
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Key, ShoppingBag, Store, AlertCircle } from "lucide-react";
import { connectShopifyStore } from '@/services/api';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ShopifyConnect() {
  const [storeUrl, setStoreUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your Shopify store",
        variant: "destructive"
      });
      return;
    }

    if (!accessToken || accessToken.trim() === '') {
      setError("Access token is required");
      toast({
        title: "Missing Information",
        description: "Access token is required",
        variant: "destructive"
      });
      return;
    }

    if (!storeUrl || storeUrl.trim() === '') {
      setError("Store URL is required");
      toast({
        title: "Missing Information",
        description: "Store URL is required",
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
      console.log('Connecting to store:', formattedUrl);
      const response = await connectShopifyStore({
        storeUrl: formattedUrl,
        accessToken
      });
      
      console.log('Connection successful:', response);
      
      toast({
        title: "Store Connected",
        description: "Your Shopify store was successfully connected",
        variant: "default"
      });
      
      // Reset form
      setStoreUrl('');
      setAccessToken('');
      
      // Trigger a reload to refresh the list of stores
      window.location.reload();
    } catch (error) {
      console.error('Shopify connection error:', error);
      
      let errorMessage = "Failed to connect to Shopify store";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract more detailed error information
        if ('message' in error) {
          errorMessage = error.message as string;
        } else if ('details' in error) {
          errorMessage = error.details as string;
        } else if ('error' in error) {
          errorMessage = error.error as string;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleConnect} className="space-y-4">
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
              {isLoading ? "Connecting..." : "Connect Store"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t px-6 py-4 bg-muted/5">
        <p className="text-xs text-muted-foreground">
          Your credentials are securely stored and used only for SEO optimization. <a href="https://shopify.dev/docs/admin-api/access-token" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn how to get your access token</a>
        </p>
      </CardFooter>
    </Card>
  );
}

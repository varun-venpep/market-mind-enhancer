
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, ShoppingBag } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function ShopifyConnect() {
  const [shopUrl, setShopUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your Shopify store",
        variant: "destructive"
      });
      return;
    }

    let formattedUrl = shopUrl.trim();
    
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
      const response = await fetch(`${BACKEND_URL}/shopify-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          shop: formattedUrl,
          userId: user.id
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to connect to Shopify');
      }
      
      const { authUrl } = await response.json();
      
      // Redirect to Shopify OAuth
      window.location.href = authUrl;
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Connect Your Shopify Store
        </CardTitle>
        <CardDescription>
          Connect your Shopify store to start optimizing your product SEO automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect}>
          <div className="grid w-full items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="shopUrl">Shopify Store URL</Label>
              <Input
                id="shopUrl"
                placeholder="your-store.myshopify.com"
                value={shopUrl}
                onChange={(e) => setShopUrl(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? "Connecting..." : "Connect Store"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Your data will be securely stored and used only for SEO optimization
        </p>
      </CardFooter>
    </Card>
  );
}

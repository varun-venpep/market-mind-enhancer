
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShoppingBag, AlertCircle } from "lucide-react";
import { connectShopifyStore } from "@/services/shopify";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form schema validation
const formSchema = z.object({
  storeUrl: z.string()
    .min(4, { message: "Store URL must be at least 4 characters" })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/, { 
      message: "Store name can only contain letters, numbers, and hyphens" 
    }),
  accessToken: z.string()
    .min(10, { message: "Access token must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const ShopifyConnect = () => {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeUrl: '',
      accessToken: ''
    }
  });

  useEffect(() => {
    // Check for authentication status
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        setAuthError("You must be logged in to connect a Shopify store");
      } else {
        setAuthError(null);
      }
    };
    
    checkAuth();
  }, []);

  const onSubmit = async (data: FormValues) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast.error("You must be logged in to connect a Shopify store");
      setAuthError("You must be logged in to connect a Shopify store");
      return;
    }
    
    setIsConnecting(true);
    console.log("Connecting store with data:", { storeUrl: data.storeUrl });
    
    try {
      // Normalize the store URL to ensure it has the right format
      let storeUrl = data.storeUrl.trim().toLowerCase();
      if (!storeUrl.endsWith('.myshopify.com')) {
        storeUrl = `${storeUrl}.myshopify.com`;
      }
      
      // Call the Shopify connect function
      await connectShopifyStore({
        storeUrl,
        accessToken: data.accessToken
      });
      
      toast.success("Shopify store connected successfully!");
      reset();
      
      // Reload the page after a short delay to show the connected store
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error connecting Shopify store:", error);
      toast.error("Failed to connect Shopify store. Please check your credentials.");
      // Do not reset the form to allow the user to correct their input
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
          <ShoppingBag className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Connect Your Shopify Store</h3>
        <p className="text-muted-foreground text-center max-w-xs">
          Enter your Shopify store details to enable SEO automation
        </p>
      </div>
      
      {authError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="storeUrl" className="text-base">Store URL</Label>
          <div className="flex">
            <Input
              id="storeUrl"
              placeholder="your-store"
              {...register("storeUrl")}
              className="rounded-r-none text-base py-6"
              disabled={isConnecting || !!authError}
            />
            <div className="bg-muted px-4 flex items-center border border-l-0 border-input rounded-r-md text-base">
              <span className="text-muted-foreground">.myshopify.com</span>
            </div>
          </div>
          {errors.storeUrl && (
            <p className="text-destructive text-sm mt-1">{errors.storeUrl.message}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="accessToken" className="text-base">Access Token</Label>
          <Input
            id="accessToken"
            type="password"
            placeholder="Shopify Admin API access token"
            {...register("accessToken")}
            className="text-base py-6"
            disabled={isConnecting || !!authError}
          />
          {errors.accessToken && (
            <p className="text-destructive text-sm mt-1">{errors.accessToken.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Find this in your Shopify admin under Apps → App and sales channel settings → Develop apps → Create an app
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6 text-base font-medium mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300"
          disabled={isConnecting || !!authError}
        >
          {isConnecting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Connecting...</span>
            </div>
          ) : (
            <span>Connect Store</span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ShopifyConnect;

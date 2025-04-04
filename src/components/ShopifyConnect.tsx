
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Form schema validation
const formSchema = z.object({
  store_url: z.string()
    .min(4, { message: "Store URL must be at least 4 characters" })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/, { 
      message: "Store name can only contain letters, numbers, and hyphens" 
    }),
  api_key: z.string()
    .min(10, { message: "API key must be at least 10 characters" }),
  api_password: z.string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const ShopifyConnect = () => {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to connect a Shopify store");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Normalize the store URL to ensure it has the right format
      let storeUrl = data.store_url.trim().toLowerCase();
      if (!storeUrl.endsWith('.myshopify.com')) {
        storeUrl = `${storeUrl}.myshopify.com`;
      }
      
      // Call the Shopify connect function
      const { data: response, error } = await supabase.functions.invoke('shopify-connect', {
        body: { 
          store_url: storeUrl,
          api_key: data.api_key,
          api_password: data.api_password
        }
      });
      
      if (error) throw error;
      
      toast.success("Shopify store connected successfully!");
      reset();
      
      // Reload the page after a short delay to show the connected store
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error connecting Shopify store:", error);
      toast.error("Failed to connect Shopify store. Please check your credentials.");
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-4">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold">Connect Your Shopify Store</h3>
        <p className="text-muted-foreground text-center mt-1">
          Enter your Shopify store details to enable SEO automation
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="store_url">Store URL</Label>
          <div className="flex">
            <Input
              id="store_url"
              placeholder="your-store"
              {...register("store_url")}
              className="rounded-r-none"
            />
            <div className="bg-muted px-3 flex items-center border border-l-0 border-input rounded-r-md">
              <span className="text-muted-foreground text-sm">.myshopify.com</span>
            </div>
          </div>
          {errors.store_url && (
            <p className="text-destructive text-sm">{errors.store_url.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api_key">API Key</Label>
          <Input
            id="api_key"
            type="text"
            placeholder="Shopify Admin API key"
            {...register("api_key")}
          />
          {errors.api_key && (
            <p className="text-destructive text-sm">{errors.api_key.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api_password">API Password</Label>
          <Input
            id="api_password"
            type="password"
            placeholder="Shopify Admin API password"
            {...register("api_password")}
          />
          {errors.api_password && (
            <p className="text-destructive text-sm">{errors.api_password.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Find these in your Shopify admin under Apps → App and sales channel settings → Develop apps → Create an app
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full gradient-button"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>Connect Store</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ShopifyConnect;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { connectShopifyStore } from "@/services/shopify";
import { toast } from "sonner";
import ShopifyConnectHeader from "./ShopifyConnectHeader";
import ShopifyConnectAlerts from "./ShopifyConnectAlerts";
import ShopifyConnectForm from "./ShopifyConnectForm";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

interface ShopifyConnectProps {
  onStoreConnected?: () => void;
}

const ShopifyConnect: React.FC<ShopifyConnectProps> = ({ onStoreConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeUrl: "",
      accessToken: ""
    }
  });

  const checkAuthentication = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setAuthError("You must be signed in to connect a Shopify store");
        toast.error("Authentication required. Please sign in.");
        setTimeout(() => navigate('/login'), 2000);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthError("Error checking authentication status");
      return false;
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsConnecting(true);
    setAuthError(null);
    setConnectionError(null);
    
    // First check authentication
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      setIsConnecting(false);
      return;
    }
    
    try {
      const store = await connectShopifyStore({
        storeUrl: data.storeUrl,
        accessToken: data.accessToken
      });
      
      toast.success("Shopify store connected successfully!");
      console.log("Store connected:", store);
      
      // Reset the form
      reset();
      
      // Call the callback if provided
      if (onStoreConnected) {
        onStoreConnected();
      }
      
      // Redirect to the store page
      setTimeout(() => {
        if (store && store.id) {
          navigate(`/dashboard/shopify/${store.id}`);
        } else {
          navigate('/dashboard/shopify');
        }
      }, 1000);
      
    } catch (error: any) {
      console.error("Error connecting Shopify store:", error);
      
      if (error.message && (error.message.includes("authentication") || error.message.includes("auth"))) {
        setAuthError(error.message);
      } else {
        setConnectionError(error.message || "Failed to connect to Shopify store");
      }
      
      toast.error(error.message || "Failed to connect to Shopify store");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ShopifyConnectHeader />
      <ShopifyConnectAlerts 
        authError={authError} 
        connectionError={connectionError} 
      />
      <ShopifyConnectForm
        isConnecting={isConnecting}
        disabled={false}
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
        register={register}
        reset={reset}
      />
    </div>
  );
};

export default ShopifyConnect;

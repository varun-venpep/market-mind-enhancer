
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { connectShopifyStore } from "@/services/shopify";
import { useToast } from "@/hooks/use-toast";
import ShopifyConnectHeader from "./ShopifyConnectHeader";
import ShopifyConnectAlerts from "./ShopifyConnectAlerts";
import ShopifyConnectForm from "./ShopifyConnectForm";

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

const ShopifyConnect: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  const onSubmit = async (data: FormValues) => {
    setIsConnecting(true);
    setAuthError(null);
    setConnectionError(null);
    
    try {
      await connectShopifyStore({
        storeUrl: data.storeUrl,
        accessToken: data.accessToken
      });
      
      toast({
        title: "Success",
        description: "Shopify store connected successfully!",
        variant: "default"
      });
      
      reset();
    } catch (error) {
      console.error("Error connecting Shopify store:", error);
      
      if (error.message.includes("authentication") || error.message.includes("auth")) {
        setAuthError(error.message);
      } else {
        setConnectionError(error.message || "Failed to connect to Shopify store");
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to connect to Shopify store",
        variant: "destructive"
      });
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

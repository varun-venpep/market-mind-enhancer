
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

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

type Props = {
  isConnecting: boolean;
  disabled: boolean;
  onSubmit: (data: FormValues) => Promise<void>;
  errors: Record<string, { message?: string }>;
  register: ReturnType<typeof useForm<FormValues>>['register'];
  reset: () => void;
};

const ShopifyConnectForm: React.FC<Props> = ({
  isConnecting, disabled, onSubmit, errors, register
}) => (
  <form onSubmit={e => {
    e.preventDefault();
    void onSubmit(
      // @ts-ignore
      { storeUrl: e.target.storeUrl.value, accessToken: e.target.accessToken.value }
    );
  }} className="space-y-5">
    <div className="space-y-3">
      <Label htmlFor="storeUrl" className="text-base">Store URL</Label>
      <div className="flex">
        <Input
          id="storeUrl"
          placeholder="your-store"
          {...register("storeUrl")}
          className="rounded-r-none text-base py-6"
          disabled={isConnecting || disabled}
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
        disabled={isConnecting || disabled}
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
      disabled={isConnecting || disabled}
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
);

export default ShopifyConnectForm;

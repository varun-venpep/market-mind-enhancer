
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ShopifyConnect from "@/components/ShopifyConnect";

export default function ShopifyNoStores() {
  return (
    <Card className="hover-card shadow-md">
      <CardHeader>
        <CardTitle>No Stores Connected</CardTitle>
        <CardDescription>
          Connect your first Shopify store to start optimizing your product SEO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShopifyConnect />
      </CardContent>
    </Card>
  );
}

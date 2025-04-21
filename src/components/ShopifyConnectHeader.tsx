
import React from "react";
import { ShoppingBag } from "lucide-react";

const ShopifyConnectHeader: React.FC = () => (
  <div className="flex flex-col items-center mb-8">
    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
      <ShoppingBag className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-2xl font-semibold mb-2">Connect Your Shopify Store</h3>
    <p className="text-muted-foreground text-center max-w-xs">
      Enter your Shopify store details to enable SEO automation
    </p>
  </div>
);

export default ShopifyConnectHeader;

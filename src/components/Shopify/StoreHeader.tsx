
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Store, Zap } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import type { ShopifyStore } from '@/types/shopify';

interface StoreHeaderProps {
  store: ShopifyStore;
  onBulkOptimize: () => void;
  isOptimizing: boolean;
}

export function StoreHeader({ store, onBulkOptimize, isOptimizing }: StoreHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex items-center space-x-4 mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/dashboard/shopify')}
          className="rounded-full shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            {store.store_name || store.store_url}
          </h1>
          <p className="text-muted-foreground">{store.store_url}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/dashboard/shopify/${store.id}/settings`)}
            className="gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Settings className="h-4 w-4" />
            Store Settings
          </Button>
          <Button 
            onClick={onBulkOptimize} 
            disabled={isOptimizing}
            className="gap-2 bg-primary shadow-sm hover:shadow-md transition-all"
          >
            <Zap className="h-4 w-4" />
            {isOptimizing ? 'Optimizing...' : 'Optimize All Products'}
          </Button>
        </div>
      </div>
    </>
  );
}

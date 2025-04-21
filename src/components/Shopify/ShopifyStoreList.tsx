
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Store } from "lucide-react";
import type { ShopifyStore } from '@/types/shopify';

interface ShopifyStoreListProps {
  stores: ShopifyStore[];
  isLoading: boolean;
  onDisconnect: (id: string) => void;
  onView: (id: string) => void;
}

export default function ShopifyStoreList({
  stores,
  isLoading,
  onDisconnect,
  onView
}: ShopifyStoreListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="bg-muted/20 h-32"></CardHeader>
            <CardContent className="pt-6">
              <div className="h-4 bg-muted/40 rounded mb-4"></div>
              <div className="h-4 bg-muted/40 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map(store => (
        <Card key={store.id} className="hover-card transition-all duration-200 border-muted/40">
          <CardHeader className="bg-muted/5">
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              {store.store_name || store.store_url}
            </CardTitle>
            <CardDescription>{store.store_url}</CardDescription>
          </CardHeader>
          <CardContent>
            {store.store_owner && <p className="text-sm">Owner: {store.store_owner}</p>}
            <p className="text-sm text-muted-foreground mt-2">Connected on {new Date(store.created_at).toLocaleDateString()}</p>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/5 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDisconnect(store.id)}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 dark:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              Disconnect
            </Button>
            <Button 
              size="sm" 
              onClick={() => onView(store.id)}
              className="gap-2 shadow-sm hover:shadow-md transition-all"
            >
              Manage Store
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

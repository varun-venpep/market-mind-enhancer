
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Store, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ShopifyConnect from '@/components/ShopifyConnect';
import { getConnectedShopifyStores, disconnectShopifyStore } from '@/services/api';
import type { ShopifyStore } from '@/types/shopify';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ShopifyStores() {
  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const data = await getConnectedShopifyStores();
        setStores(data);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast({
          title: "Error",
          description: "Failed to load connected Shopify stores",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStores();
  }, [user, toast]);
  
  const handleDisconnect = async (storeId: string) => {
    if (confirm("Are you sure you want to disconnect this store? This will remove all data associated with it.")) {
      try {
        await disconnectShopifyStore(storeId);
        setStores(stores.filter(store => store.id !== storeId));
        toast({
          title: "Store Disconnected",
          description: "Your Shopify store has been disconnected successfully"
        });
      } catch (error) {
        console.error("Error disconnecting store:", error);
        toast({
          title: "Error",
          description: "Failed to disconnect store",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleViewStore = (storeId: string) => {
    navigate(`/dashboard/shopify/${storeId}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Shopify SEO Automation</h1>
          <p className="text-muted-foreground mt-1">
            Connect and manage your Shopify stores for automated SEO optimization
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm hover:shadow-md transition-all">
              <Plus className="h-4 w-4" />
              Connect New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Shopify Store</DialogTitle>
              <DialogDescription>
                Enter your Shopify store credentials to connect it to the SEO platform
              </DialogDescription>
            </DialogHeader>
            <ShopifyConnect />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
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
      ) : stores.length > 0 ? (
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
                  onClick={() => handleDisconnect(store.id)}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 dark:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  Disconnect
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleViewStore(store.id)}
                  className="gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  Manage Store
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}

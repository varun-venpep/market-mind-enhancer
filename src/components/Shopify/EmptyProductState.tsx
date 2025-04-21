
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, RefreshCw } from "lucide-react";

interface EmptyProductStateProps {
  message?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function EmptyProductState({ 
  message = "This store doesn't have any products yet. Add products to your Shopify store to start optimizing their SEO.",
  onRefresh,
  isLoading = false
}: EmptyProductStateProps) {
  return (
    <Card className="hover-card shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          No Products Found
        </CardTitle>
        <CardDescription>
          {message}
        </CardDescription>
      </CardHeader>
      {onRefresh && (
        <CardContent className="flex justify-center pt-2">
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Products'}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

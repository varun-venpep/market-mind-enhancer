
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Loading Store Data</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please wait while we retrieve your Shopify store information and products...
        </p>
      </div>
      
      <div className="mt-8 space-y-6">
        <div className="h-10 bg-muted/30 rounded animate-pulse w-3/4"></div>
        
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="border-b">
                <div className="h-6 bg-muted/30 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted/30 rounded w-1/3"></div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex gap-4">
                  <div className="w-32 h-32 bg-muted/30 rounded"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-muted/30 rounded"></div>
                    <div className="h-4 bg-muted/30 rounded w-5/6"></div>
                    <div className="h-4 bg-muted/30 rounded w-4/6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

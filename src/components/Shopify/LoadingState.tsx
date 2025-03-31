
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export function LoadingState() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" size="icon" disabled className="opacity-50">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="h-8 bg-muted/40 rounded w-48 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="bg-muted/20 h-24"></CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-muted/30 rounded flex-shrink-0"></div>
                <div className="flex-grow space-y-3">
                  <div className="h-4 bg-muted/40 rounded mb-4"></div>
                  <div className="h-4 bg-muted/40 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-muted/40 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ArticleDetailSkeleton = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            disabled
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Campaign
          </Button>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-4 flex-wrap">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

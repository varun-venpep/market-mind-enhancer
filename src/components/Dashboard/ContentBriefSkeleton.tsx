
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ContentBriefSkeleton = () => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-4 pb-0">
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-1">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        
        <div className="flex flex-wrap gap-1 mb-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t">
        <div className="flex justify-between w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardFooter>
    </Card>
  );
};


import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

export const ArticleLoadingState = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    </DashboardLayout>
  );
};


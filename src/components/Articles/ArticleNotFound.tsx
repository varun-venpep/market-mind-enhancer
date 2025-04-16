
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

export const ArticleNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/campaigns')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Campaigns
          </Button>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The article you are looking for does not exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/dashboard/campaigns")}>
            Go to Campaigns
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

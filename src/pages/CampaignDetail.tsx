
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus } from "lucide-react";

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
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
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Campaign Details</h1>
              <p className="text-muted-foreground mt-1">
                Articles in this campaign
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/article-generator')}
              className="gradient-button mt-4 md:mt-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Articles in this Campaign</CardTitle>
              <CardDescription>
                All articles created for this campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-blue-500/30 mb-4" />
                <p className="text-muted-foreground">Campaign Detail Coming Soon</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  This feature is under development and will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;


import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Typography, 
  Button,
  IconButton
} from "@material-tailwind/react";
import { ArrowLeft, FileText, Plus } from "lucide-react";

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <IconButton
              variant="text"
              size="sm"
              onClick={() => navigate('/dashboard/campaigns')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </IconButton>
            <Typography variant="lead">Back to Campaigns</Typography>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Typography variant="h2" className="bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text">
                Campaign Details
              </Typography>
              <Typography variant="paragraph" color="blue-gray" className="mt-1">
                Articles in this campaign
              </Typography>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/article-generator')}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Article
            </Button>
          </div>
          
          <Card>
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-2 p-4"
            >
              <Typography variant="h5" color="white">
                Articles in this Campaign
              </Typography>
              <Typography variant="small" color="white" className="opacity-80">
                All articles created for this campaign
              </Typography>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-blue-500/30 mb-4" />
                <Typography variant="h6" color="blue-gray">
                  Campaign Detail Coming Soon
                </Typography>
                <Typography variant="small" color="blue-gray" className="mt-1 max-w-xs">
                  This feature is under development and will be available soon.
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;

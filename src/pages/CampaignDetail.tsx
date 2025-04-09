
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Material Tailwind components
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";

// Icons
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button 
              variant="text" 
              size="sm" 
              onClick={() => navigate('/dashboard/campaigns')}
              className="flex items-center gap-2 text-white hover:bg-primary-500/10"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Campaigns
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Typography variant="h2" color="white" className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Campaign Details
              </Typography>
              <Typography variant="paragraph" color="blue-gray" className="mt-1">
                Articles in this campaign
              </Typography>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/article-generator')}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
            >
              <PlusIcon className="h-4 w-4" />
              Add Article
            </Button>
          </div>
          
          <Card className="bg-dark-800 border border-dark-700 shadow-lg">
            <CardHeader 
              color="transparent" 
              floated={false} 
              shadow={false}
              className="px-6 pt-6 pb-0"
            >
              <Typography variant="h4" color="white" className="mb-1">
                Articles in this Campaign
              </Typography>
              <Typography variant="small" color="blue-gray" className="mb-4">
                All articles created for this campaign
              </Typography>
            </CardHeader>
            <CardBody className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <DocumentTextIcon className="h-16 w-16 text-primary-500/30 mb-4" />
                <Typography color="blue-gray" className="mb-2">
                  Campaign Detail Coming Soon
                </Typography>
                <Typography variant="small" color="blue-gray" className="max-w-xs">
                  This feature is under development and will be available soon.
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;

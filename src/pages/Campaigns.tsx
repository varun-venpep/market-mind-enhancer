
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Campaign } from '@/types';

// Material Tailwind components
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Input,
  Chip,
} from "@material-tailwind/react";

// Icons
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Campaigns = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Simulate loading campaigns from database
    setIsLoading(true);
    
    // In a real app, this would fetch from Supabase
    setTimeout(() => {
      // For demo, create a default campaign if none exists
      const defaultCampaign: Campaign = {
        id: "default-campaign",
        name: "Default Campaign",
        description: "Automatically created campaign for keyword articles",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: currentWorkspace?.id || "",
        articleCount: 3
      };
      
      setCampaigns([defaultCampaign]);
      setIsLoading(false);
    }, 1000);
  }, [currentWorkspace]);
  
  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (campaign.description && campaign.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button 
              variant="text" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white hover:bg-primary-500/10"
              placeholder=""
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Typography variant="h2" color="white" className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent" placeholder="">
                Campaigns
              </Typography>
              <Typography variant="paragraph" color="blue-gray" className="mt-1" placeholder="">
                Manage your article campaigns and track your SEO progress
              </Typography>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/article-generator')}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
              placeholder=""
            >
              <PlusIcon className="h-4 w-4" />
              New Article
            </Button>
          </div>
          
          <div className="relative max-w-md mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-400" />
            </div>
            <Input
              type="search"
              label="Search campaigns..."
              className="pl-10 border-dark-700 bg-dark-800 text-white"
              containerProps={{ className: "min-w-[288px]" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              crossOrigin=""
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="bg-dark-800 border border-dark-700 animate-pulse" placeholder="">
                  <CardHeader className="h-16 bg-dark-700" placeholder="">
                  </CardHeader>
                  <CardBody placeholder="">
                    <div className="h-4 bg-dark-700 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-dark-700 rounded-md w-1/2"></div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <Card 
                  key={campaign.id}
                  className="bg-dark-800 border border-dark-700 hover:shadow-md hover:shadow-primary-500/10 transition-all cursor-pointer"
                  onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                  placeholder=""
                >
                  <CardHeader
                    color="transparent"
                    floated={false}
                    shadow={false}
                    className="px-6 pt-6 pb-0"
                    placeholder=""
                  >
                    <Typography variant="h5" color="white" className="mb-1" placeholder="">
                      {campaign.name}
                    </Typography>
                    <Typography variant="small" color="blue-gray" placeholder="">
                      {campaign.description}
                    </Typography>
                  </CardHeader>
                  <CardBody className="px-6 pt-4" placeholder="">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-blue-gray-400" />
                        <Typography variant="small" color="blue-gray" placeholder="">
                          {campaign.articleCount || 0} Articles
                        </Typography>
                      </div>
                      <Chip
                        value={new Date(campaign.createdAt).toLocaleDateString()}
                        variant="outlined"
                        className="border-dark-600 text-blue-gray-400 text-xs"
                      />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-dark-800 border border-dark-700 shadow-lg" placeholder="">
              <CardBody className="flex flex-col items-center justify-center py-16 text-center" placeholder="">
                <div className="rounded-full bg-dark-700 p-3 mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-gray-400" />
                </div>
                <Typography variant="h4" color="white" className="mb-2" placeholder="">
                  No campaigns found
                </Typography>
                <Typography color="blue-gray" className="mb-4 max-w-md" placeholder="">
                  {searchTerm 
                    ? `We couldn't find any campaigns matching "${searchTerm}". Try a different search term.`
                    : "You don't have any campaigns yet. Create your first article to get started."}
                </Typography>
                <Button 
                  onClick={() => navigate('/dashboard/article-generator')}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
                  placeholder=""
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Article
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;

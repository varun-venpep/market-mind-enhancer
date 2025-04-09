
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText, Plus, Search } from "lucide-react";
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Campaign } from '@/types';

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
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Campaigns</h1>
              <p className="text-muted-foreground mt-1">
                Manage your article campaigns and track your SEO progress
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/article-generator')}
              className="gradient-button mt-4 md:mt-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </div>
          
          <div className="relative w-full max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded-md w-3/4"></div>
                    <div className="h-4 bg-muted rounded-md w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded-md w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <Card 
                  key={campaign.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                >
                  <CardHeader>
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {campaign.articleCount || 0} Articles
                        </span>
                      </div>
                      <Badge variant="outline">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted/60 p-3 mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No campaigns found</h3>
                <p className="text-muted-foreground mt-2 mb-4 max-w-md">
                  {searchTerm 
                    ? `We couldn't find any campaigns matching "${searchTerm}". Try a different search term.`
                    : "You don't have any campaigns yet. Create your first article to get started."}
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/article-generator')}
                  className="gradient-button"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Article
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;

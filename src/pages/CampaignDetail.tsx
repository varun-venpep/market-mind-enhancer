
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, FileText, Plus, Edit, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Article, Campaign } from "@/types";
import ArticlePreview from '@/components/Articles/ArticlePreview';

const CampaignDetail = () => {
  const { id: campaignId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!campaignId) return;
      
      try {
        setLoading(true);
        
        // Fetch campaign details
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();
        
        if (campaignError) throw campaignError;
        
        setCampaign(campaignData as Campaign);
        
        // Fetch articles for this campaign
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false });
        
        if (articlesError) throw articlesError;
        
        setArticles(articlesData as Article[] || []);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
        toast.error('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaignDetails();
  }, [campaignId]);
  
  const handleDeleteArticle = () => {
    // Refresh the articles list
    fetchCampaignDetails();
  };
  
  const fetchCampaignDetails = async () => {
    if (!campaignId) return;
    
    try {
      // Fetch articles for this campaign
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });
      
      if (articlesError) throw articlesError;
      
      setArticles(articlesData as Article[] || []);
    } catch (error) {
      console.error('Error refreshing articles:', error);
    }
  };
  
  const handleCreateArticle = () => {
    navigate('/dashboard/article-generator', { state: { campaignId } });
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/campaigns')}
                className="mr-4 p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <p className="text-lg font-medium">Back to Campaigns</p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
            </div>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/campaigns')}
              className="mr-4 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <p className="text-lg font-medium">Back to Campaigns</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text">
                {campaign?.name || 'Campaign Details'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {campaign?.description || 'Articles in this campaign'}
              </p>
            </div>
            <Button 
              onClick={handleCreateArticle}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Article
            </Button>
          </div>
          
          <Card>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle>Articles in this Campaign</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                All articles created for this campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {articles.map((article) => (
                    <ArticlePreview 
                      key={article.id} 
                      article={article} 
                      onDeleted={handleDeleteArticle}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="h-16 w-16 text-blue-500/30 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    No Articles Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Start creating content by adding your first article to this campaign.
                  </p>
                  <Button 
                    onClick={handleCreateArticle}
                    className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Article
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;

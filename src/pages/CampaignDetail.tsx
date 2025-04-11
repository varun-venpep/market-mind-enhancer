
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

const CampaignDetail = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
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
        
        setCampaign(campaignData);
        
        // Fetch articles for this campaign
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false });
        
        if (articlesError) throw articlesError;
        
        setArticles(articlesData || []);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
        toast.error('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaignDetails();
  }, [campaignId]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Draft</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> In Progress</Badge>;
      case 'completed':
        return <Badge variant="success" className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col border rounded-lg p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
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
              onClick={() => navigate('/dashboard/article-generator', { state: { campaignId } })}
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
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {articles.map((article) => (
                    <div 
                      key={article.id} 
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/article-editor/${article.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{article.title}</h3>
                          <div className="text-muted-foreground text-sm mt-1">
                            Keywords: {article.keywords?.join(', ') || 'None'}
                          </div>
                        </div>
                        {getStatusBadge(article.status)}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(article.created_at).toLocaleDateString()}
                          {article.word_count ? ` • ${article.word_count} words` : ''}
                          {article.score ? ` • Score: ${article.score}` : ''}
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                      </div>
                    </div>
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
                    onClick={() => navigate('/dashboard/article-generator', { state: { campaignId } })}
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

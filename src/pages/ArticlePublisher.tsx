
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { BlogPlatformIntegration } from "@/components/Articles/BlogPlatformIntegration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublishScheduler } from "@/components/Articles/PublishScheduler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronRight, ExternalLink, Info, Loader2 } from "lucide-react";
import { fetchArticle } from "@/services/articleService";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";

const ArticlePublisher = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("publish");
  const [platformsConnected, setPlatformsConnected] = useState({
    blogger: false,
    medium: false
  });

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchArticle(articleId);
        setArticle(data);
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [articleId]);

  const handlePlatformConnect = () => {
    // Refresh platform connections when a connection is made
    setPlatformsConnected(prev => ({
      ...prev,
      [activeTab === "blogger-tab" ? "blogger" : "medium"]: true
    }));
  };
  
  const handlePlatformDisconnect = () => {
    // Refresh platform connections when a connection is removed
    setPlatformsConnected(prev => ({
      ...prev,
      [activeTab === "blogger-tab" ? "blogger" : "medium"]: false
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The article you are trying to publish could not be found. It may have been deleted.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => navigate("/dashboard/campaigns")}>
              Go to Campaigns
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/dashboard/article/${article.id}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Article
          </Button>
        </div>
        
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-bold">Publish Article</h1>
          <p className="text-muted-foreground mt-1">
            Publish your article to various platforms
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{article.title}</h2>
                  <div className="flex items-center text-sm text-muted-foreground space-x-2 mt-1">
                    <span>Last updated: {formatDate(article.updated_at)}</span>
                    <span>•</span>
                    <span>{article.word_count || 0} words</span>
                  </div>
                </div>
                
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Ready to Publish</AlertTitle>
                  <AlertDescription>
                    Your article is ready to be published. You can publish it now or schedule it for later.
                  </AlertDescription>
                </Alert>
                
                <div className="prose max-w-none">
                  {article.thumbnail_url && (
                    <img 
                      src={article.thumbnail_url} 
                      alt={article.title} 
                      className="w-full max-h-[300px] object-cover rounded-md mb-6"
                    />
                  )}
                  
                  <div className="line-clamp-6 mb-4" dangerouslySetInnerHTML={{ __html: article.content?.substr(0, 500) || 'No content available.' }} />
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => navigate(`/dashboard/article-editor/${article.id}`)}
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    View Full Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Tabs defaultValue="publish" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="publish">Publish</TabsTrigger>
                <TabsTrigger value="connect">Connect</TabsTrigger>
              </TabsList>
              
              <TabsContent value="publish" className="space-y-6">
                <PublishScheduler 
                  articleId={article.id} 
                  title={article.title}
                />
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Other publishing options</h3>
                    <Button 
                      variant="outline" 
                      className="w-full mb-2 justify-start"
                      onClick={() => window.open(`/dashboard/article/${article.id}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Share article link
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/dashboard/blog-integrations')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Manage blog connections
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="connect" className="space-y-6">
                <Tabs defaultValue="blogger-tab">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="blogger-tab">Blogger</TabsTrigger>
                    <TabsTrigger value="medium-tab">Medium</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="blogger-tab">
                    <BlogPlatformIntegration
                      platform="blogger"
                      title="Blogger"
                      description="Publish your articles directly to your Blogger blogs"
                      authUrl="https://www.blogger.com/blog/connect"
                      onConnect={handlePlatformConnect}
                      onDisconnect={handlePlatformDisconnect}
                    />
                  </TabsContent>
                  
                  <TabsContent value="medium-tab">
                    <BlogPlatformIntegration
                      platform="medium"
                      title="Medium"
                      description="Share your content on Medium to reach a wider audience"
                      authUrl="https://medium.com/me/applications"
                      onConnect={handlePlatformConnect}
                      onDisconnect={handlePlatformDisconnect}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticlePublisher;

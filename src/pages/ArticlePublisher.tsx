
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublishScheduler } from "@/components/Articles/PublishScheduler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronRight, ExternalLink, Info, Loader2 } from "lucide-react";
import { fetchArticle } from "@/services/articleService";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ArticlePublisher() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("publish");

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;
      
      try {
        setLoading(true);
        const fetchedArticle = await fetchArticle(articleId);
        setArticle(fetchedArticle);
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold">Loading article...</h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-md mx-auto p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Publish Article | MarketMind</title>
        <meta name="description" content="Publish and schedule your article across multiple platforms" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{article.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <span>Created: {formatDate(article.created_at)}</span>
                <ChevronRight className="mx-2 h-4 w-4" />
                <span>{article.word_count} words</span>
                {article.score && (
                  <>
                    <ChevronRight className="mx-2 h-4 w-4" />
                    <span>SEO Score: {article.score}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate(`/dashboard/article-preview/${article.id}`)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={() => navigate(`/dashboard/article-editor/${article.id}`)}
              >
                Edit Article
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="publish">Publish Settings</TabsTrigger>
                <TabsTrigger value="preview">Article Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="publish" className="space-y-6">
                <PublishScheduler articleId={article.id} title={article.title} />
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 text-amber-600 dark:text-amber-400">
                      <Info className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-base font-medium mb-1">Publishing Notes</h3>
                        <p className="text-sm text-muted-foreground">
                          Your article will be published exactly as it appears in the preview tab. Make sure to review it before publishing. 
                          Images will be included in your published content. Each platform has its own formatting specifics, 
                          so there might be slight differences in how your content appears.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Scheduled posts will be published automatically at the time you set. You can cancel scheduled posts 
                          at any time before they are published.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
                    
                    {article.thumbnail_url && (
                      <div className="mb-6">
                        <img 
                          src={article.thumbnail_url} 
                          alt={article.title} 
                          className="w-full h-auto rounded-md border"
                        />
                      </div>
                    )}
                    
                    <div className="prose max-w-full dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ 
                        __html: article.content?.replace(/\n/g, '<br />') || "No content available"
                      }} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Publishing Checklist</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-1 ${article.score && article.score >= 70 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {article.score && article.score >= 70 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="12" />
                          <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">SEO Optimization</div>
                      <p className="text-sm text-muted-foreground">
                        {article.score && article.score >= 70
                          ? "Your article is well-optimized for search engines."
                          : "Consider improving your SEO score before publishing."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-1 ${article.thumbnail_url ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {article.thumbnail_url ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="12" />
                          <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">Featured Image</div>
                      <p className="text-sm text-muted-foreground">
                        {article.thumbnail_url
                          ? "You have a featured image for your article."
                          : "Adding a featured image can increase engagement."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-1 ${article.word_count && article.word_count >= 300 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {article.word_count && article.word_count >= 300 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="12" />
                          <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">Content Length</div>
                      <p className="text-sm text-muted-foreground">
                        {article.word_count && article.word_count >= 300
                          ? `Your article has ${article.word_count} words, which is good.`
                          : `Your article is only ${article.word_count} words. Longer content often performs better.`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-1">Quick Actions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Additional options for your article
                </p>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/dashboard/api-integrations')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Set Up More Integrations
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("preview")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View Full Preview
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/dashboard/article-editor/${article.id}`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Article Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

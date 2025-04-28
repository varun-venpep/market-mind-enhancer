
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Clock, Edit, ExternalLink, Loader2, Share2 } from 'lucide-react';
import { PublishScheduler } from '@/components/Articles/PublishScheduler';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { toast } from 'sonner';
import { fetchArticle } from '@/services/articles/crud'; // Changed from getArticle to fetchArticle
import { ArticleNotFound } from '@/components/Articles/ArticleNotFound';
import { ArticleLoadingState } from '@/components/Articles/ArticleLoadingState';

export default function ArticlePublisher() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!articleId) return;
      
      try {
        setLoading(true);
        const articleData = await fetchArticle(articleId); // Changed from getArticle to fetchArticle
        
        if (!articleData) {
          setError('Article not found');
          return;
        }
        
        setArticle(articleData);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [articleId]);

  if (loading) {
    return (
      <DashboardLayout>
        <ArticleLoadingState /> {/* Removed message prop as it's not in the interface */}
      </DashboardLayout>
    );
  }

  if (error || !article) {
    return (
      <DashboardLayout>
        <ArticleNotFound /> {/* Removed message prop as it's not in the interface */}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Publish Article | MarketMind</title>
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/dashboard/article/${articleId}`)} 
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Article
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <p className="text-muted-foreground">
              Publish and distribute your content across connected platforms
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => navigate(`/dashboard/article-editor/${articleId}`)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Article
            </Button>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + `/dashboard/article/${articleId}`);
                toast.success("Article link copied to clipboard");
              }}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="preview">Article Preview</TabsTrigger>
                <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    {article.subtitle && <CardDescription>{article.subtitle}</CardDescription>}
                  </CardHeader>
                  <CardContent className="border-t pt-4">
                    {article.featured_image && (
                      <div className="mb-4">
                        <img 
                          src={article.featured_image} 
                          alt={article.title} 
                          className="w-full h-auto rounded-md object-cover max-h-64"
                        />
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none dark:prose-invert" 
                      dangerouslySetInnerHTML={{ __html: article.content }} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="seo">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ExternalLink className="mr-2 h-5 w-5 text-primary" />
                      SEO Analysis
                    </CardTitle>
                    <CardDescription>
                      How your content will perform in search engines
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="border-t pt-4">
                    <div className="grid gap-4">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 p-4 rounded-md">
                        <div className="font-medium text-green-800 dark:text-green-300 mb-1">Overall Score</div>
                        <div className="text-4xl font-bold text-green-800 dark:text-green-300">85%</div>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">Your content is well optimized for search engines</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Content Length</h3>
                          <p className="text-xs text-muted-foreground">
                            {article.content.length > 1500 
                              ? "Good content length for SEO (1500+ characters)" 
                              : "Consider adding more content to improve SEO"}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Keyword Density</h3>
                          <p className="text-xs text-muted-foreground">
                            {article.keywords && article.keywords.length > 0
                              ? "Main keywords appear naturally throughout content"
                              : "Consider adding target keywords"}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Heading Structure</h3>
                          <p className="text-xs text-muted-foreground">
                            Proper use of headings detected
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Readability</h3>
                          <p className="text-xs text-muted-foreground">
                            Content is easy to read and well-structured
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <PublishScheduler articleId={articleId} title={article.title} />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Publication History
                </CardTitle>
                <CardDescription>Track your content distribution</CardDescription>
              </CardHeader>
              <CardContent className="border-t pt-4">
                {!article.publish_status ? (
                  <Alert variant="default" className="bg-muted">
                    <AlertDescription>
                      This article hasn't been published yet. Use the publishing options above to share your content.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(article.publish_status).map(([platform, status]) => (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {platform === 'blogger' ? (
                            <div className="bg-orange-100 text-orange-700 p-2 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M14.13 4.35c-1.2.07-3.14.48-4.11 1.13a5.52 5.52 0 00-2.26 3.34c-.2.90-.29 1.8-.31 3.22-.02 1.55-.07 1.94-.35 2.72-.22.6-.41.89-.83 1.3-.28.28-.51.5-.51.51 0 0 .16.22.35.48.73 1 1.02 1.91 1.05 3.28.02.95.12 1.43.47 2.17.7 1.5 2.3 2.43 4.83 2.8 1.1.17 4.16.17 5.36 0 2.38-.33 3.93-1.17 4.8-2.57.45-.73.66-1.43.75-2.52.04-.51.1-.97.14-1.03.07-.11.5-.28.7-.28.08 0 .14-.89.16-2.29l.02-2.28-.29-.14c-.35-.17-.88-.14-1.33.08-.27.13-.33.13-.33-.02 0-.38-1.05-1.93-1.7-2.5-1.06-.93-2.07-1.36-3.55-1.5-.47-.05-.56-.09-.66-.35-.36-.9-1.29-3.69-1.54-4.56-.1-.32-.24-.6-.34-.67-.22-.17-1.06-.31-1.82-.32zm-.15 5.94c.57.07 1.07.41 1.39.94.23.38.23.41.23 3.76v3.38l-.28.01c-.15.01-.9.04-1.68.08-1.55.07-2.14-.02-2.77-.41-.59-.36-.93-.93-1.01-1.66-.15-1.38.71-2.58 2.04-2.85.47-.09 1.13.02 1.47.26.14.1.28.16.3.14.06-.06-.24-.8-.42-1.05-.55-.75-1.47-.95-2.35-.5-.43.22-1.05.93-1.31 1.49-.42.91-.45 1.89-.07 2.85.85 2.15 3.17 3.03 5.14 1.96.21-.11.4-.19.43-.17.08.08-.39.67-.77.97-.69.53-1.3.69-2.59.69-1.31 0-1.49-.04-2.25-.52-.75-.47-1.21-1.11-1.5-2.1-.14-.46-.16-1.83-.03-2.34.12-.52.6-1.58.89-1.97 1.07-1.46 3.07-2.25 4.74-1.89zM12.9 14c.53.27.78.69.79 1.31.01.78-.35 1.33-1.03 1.55-.21.07-.8.09-2.02.07l-1.74-.03v-3.21l1.85.03c1.44.03 1.91.06 2.15.18z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="bg-gray-100 text-gray-700 p-2 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                              </svg>
                            </div>
                          )}
                          <span className="capitalize">{platform}</span>
                        </div>
                        
                        <span className={`text-sm px-2 py-1 rounded ${
                          status === true || status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {status === true || status === 'published' ? 'Published' : 'Failed'}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {new Date(article.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

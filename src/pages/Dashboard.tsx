
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Rocket, 
  Globe, 
  FileText, 
  Search, 
  ArrowRight, 
  LayoutGrid,
  FileEdit,
  ListChecks,
  Lightbulb
} from "lucide-react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { ContentBrief, Article } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentBriefCard } from "@/components/Dashboard/ContentBriefCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        setIsLoading(true);
        
        // If no current workspace, we can't fetch content
        if (!currentWorkspace?.id) {
          setIsLoading(false);
          setHasContent(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('user_id', currentWorkspace.id)
          .limit(10);
          
        // Only throw an error if it's a real error, not just no content
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        // Set articles and determine if there's content
        setArticles(data || []);
        setHasContent(data && data.length > 0);
      } catch (error: any) {
        // Only log actual errors, not empty result scenarios
        console.error('Error fetching content:', error);
        // Remove the toast for no content
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserContent();
  }, [currentWorkspace]);

  // Transform Article to ContentBrief for display purposes if needed
  // This is for ContentBriefCard compatibility
  const mapArticlesToBriefs = (articles: Article[]): ContentBrief[] => {
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      keywords: article.keywords || [],
      status: article.status as any,
      createdAt: article.created_at || new Date().toISOString(),
      updatedAt: article.updated_at || new Date().toISOString(),
      score: article.score,
      wordCount: article.word_count,
      thumbnailUrl: article.thumbnail_url
    }));
  };

  const quickActions = [
    {
      title: "Generate an Article",
      description: "Create AI-optimized articles for your blog or website",
      icon: FileEdit,
      action: () => navigate('/dashboard/article-generator'),
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      title: "Research Keywords",
      description: "Discover high-value keywords and search intent",
      icon: Search,
      action: () => navigate('/dashboard/research'),
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Create Content Brief",
      description: "Generate SEO-optimized briefs for your writers",
      icon: FileText,
      action: () => navigate('/dashboard/content-briefs/new'),
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Connect Website",
      description: "Integrate your website for AI optimization",
      icon: Globe,
      action: () => navigate('/dashboard/integrations'),
      gradient: "from-amber-500 to-orange-600"
    },
    {
      title: "Create Campaign",
      description: "Manage content production at scale",
      icon: ListChecks,
      action: () => navigate('/dashboard/campaigns'),
      gradient: "from-rose-500 to-pink-600"
    },
    {
      title: "Manage Workspaces",
      description: "Organize your content by project or client",
      icon: LayoutGrid,
      action: () => navigate('/dashboard/workspaces'),
      gradient: "from-gray-500 to-slate-600"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        {!isLoading && (
          <div className="space-y-8">
            {/* Welcome message */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to {currentWorkspace?.name || 'Your Workspace'}! 👋
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Create, optimize, and manage content that ranks for both traditional search and AI platforms
              </p>
            </div>
            
            {!hasContent ? (
              /* New user experience */
              <div className="space-y-8">
                <Card className="border-2 border-primary/10 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/0 pointer-events-none" />
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Get Started with Market Mind</CardTitle>
                    <CardDescription className="text-base">
                      Welcome! Let's create your first piece of content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                      <div className="bg-primary/10 p-4 rounded-full">
                        <Lightbulb className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-center">
                        Your content journey starts here
                      </h3>
                      <p className="text-center max-w-md text-muted-foreground">
                        Create AI-powered content that's optimized for both traditional search engines and AI platforms
                      </p>
                      <Button
                        size="lg"
                        className="gradient-button mt-4"
                        onClick={() => navigate('/dashboard/article-generator')}
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Your First Article
                      </Button>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h4 className="font-medium mb-4 text-center">Or explore other ways to get started</h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        {quickActions.slice(0, 3).map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className="relative group rounded-lg p-4 text-left transition-all hover:bg-accent"
                          >
                            <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-full bg-primary/10">
                                <action.icon className="h-4 w-4 text-primary" />
                              </div>
                              <h3 className="font-medium">{action.title}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {action.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Returning user experience */
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold tracking-tight">Recent Content</h2>
                  <Button 
                    onClick={() => navigate('/dashboard/article-generator')}
                    className="gradient-button"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Map articles to ContentBrief format for display */}
                  {mapArticlesToBriefs(articles).map((brief) => (
                    <ContentBriefCard
                      key={brief.id}
                      brief={brief}
                      onClick={() => navigate(`/dashboard/articles/${brief.id}`)}
                    />
                  ))}
                </div>
                
                {/* Quick Actions Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks to help optimize your content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className="relative group rounded-lg p-4 text-left transition-all hover:bg-accent"
                        >
                          <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-full bg-primary/10">
                              <action.icon className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-medium">{action.title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {action.description}
                          </p>
                          <div className="flex items-center text-xs text-primary">
                            Get Started <ArrowRight className="h-3 w-3 ml-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse space-y-8 w-full max-w-4xl">
              <div className="h-8 bg-muted rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

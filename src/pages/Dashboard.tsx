
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
  ListChecks
} from "lucide-react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { ContentBrief } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const [briefs, setBriefs] = useState<ContentBrief[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        setIsLoading(true);
        
        // This would be replaced with actual data fetching from your database
        const { data, error } = await supabase
          .from('content_briefs')
          .select('*')
          .eq('workspace_id', currentWorkspace?.id || '')
          .limit(10);
          
        if (error) throw error;
        
        setBriefs(data || []);
        // Determine if user has any content
        setHasContent(data && data.length > 0);
      } catch (error: any) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load your content');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentWorkspace?.id) {
      fetchUserContent();
    } else {
      setIsLoading(false);
    }
  }, [currentWorkspace]);

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
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to {currentWorkspace?.name || 'Your Workspace'}! 👋
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create, optimize, and manage content that ranks for both traditional search and AI platforms
            </p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Get Started with Market Mind</CardTitle>
              <CardDescription className="text-base">Choose an action to begin your content optimization journey</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="relative group rounded-lg p-6 text-left transition-all hover:bg-accent"
                  >
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{action.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {action.description}
                    </p>
                    <div className="flex items-center text-sm text-primary">
                      Get Started <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-muted-foreground max-w-xl">
              Ready to create your first AI-powered article? Our article generator creates SEO-optimized 
              content that ranks well in traditional search and performs well in AI search platforms.
            </p>
            <Button 
              onClick={() => navigate('/dashboard/article-generator')}
              size="lg"
              className="gradient-button"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Generate Your First Article
            </Button>
          </div>

          <div className="text-center space-y-4 pt-8">
            <h2 className="text-2xl font-semibold">Need Help Getting Started?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Discover high-value keywords for your content strategy</p>
                  <Button 
                    variant="link" 
                    className="mt-2 p-0" 
                    onClick={() => navigate('/dashboard/research')}
                  >
                    Start Researching <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connect Your Site</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Integrate your website for AI-driven optimization</p>
                  <Button 
                    variant="link" 
                    className="mt-2 p-0" 
                    onClick={() => navigate('/dashboard/integrations')}
                  >
                    View Integrations <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create a Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Organize your content production at scale</p>
                  <Button 
                    variant="link" 
                    className="mt-2 p-0" 
                    onClick={() => navigate('/dashboard/campaigns')}
                  >
                    Start Campaign <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

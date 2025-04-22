import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Rocket, Globe, FileText, Search, ChevronRight, Filter, LayoutGrid } from "lucide-react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentBriefCard } from "@/components/Dashboard/ContentBriefCard";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { ContentBriefSkeleton } from "@/components/Dashboard/ContentBriefSkeleton";
import { CreateBriefDialog } from "@/components/Dashboard/CreateBriefDialog";
import { ContentBrief } from "@/types";

const mockBriefs: ContentBrief[] = [
  {
    id: "1",
    title: "How to optimize content for AI search engines",
    status: "completed",
    keywords: ["AI search engines", "content optimization", "SEO for AI"],
    createdAt: "2023-10-15T14:00:00Z",
    updatedAt: "2023-10-18T09:30:00Z",
    score: 92,
    wordCount: 1850,
    searchVolume: 2800,
    difficulty: 45
  },
  {
    id: "2",
    title: "The future of voice search and SEO strategies",
    status: "in-progress",
    keywords: ["voice search", "SEO strategies", "future of search"],
    createdAt: "2023-10-12T10:00:00Z",
    updatedAt: "2023-10-14T16:20:00Z",
    score: 78,
    wordCount: 1200,
    searchVolume: 3500,
    difficulty: 62
  },
  {
    id: "3",
    title: "E-commerce SEO best practices for 2023",
    status: "draft",
    keywords: ["e-commerce SEO", "best practices", "online store optimization"],
    createdAt: "2023-10-10T08:15:00Z",
    updatedAt: "2023-10-10T08:15:00Z",
    searchVolume: 5200,
    difficulty: 68
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const [hasContent] = useState(mockBriefs.length > 0); // This should be replaced with actual data check
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const quickActions = [
    {
      title: "Create Content Brief",
      description: "Generate SEO-optimized content briefs for your writers",
      icon: FileText,
      action: () => navigate('/dashboard/content-briefs/new'),
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
      title: "Connect Website",
      description: "Integrate your website for AI optimization",
      icon: Globe,
      action: () => navigate('/dashboard/integrations'),
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  const handleCreateBrief = (title: string, keywords: string[]) => {
    console.log("Creating brief:", title, keywords);
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        {!hasContent ? (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to {currentWorkspace?.name || 'Your Workspace'}! 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                Let's get started by optimizing your content for both traditional search and AI platforms
              </p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center pb-2">
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>Choose an action to begin your optimization journey</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-3">
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
                        Get Started <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/dashboard/article-generator')}
                size="lg"
                className="gradient-button"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Generate Your First Article
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground">
                  Working in <span className="font-medium text-primary">{currentWorkspace?.name}</span> workspace
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button 
                  onClick={() => navigate('/dashboard/workspaces')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LayoutGrid className="h-4 w-4" /> Workspaces
                </Button>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="gradient-button w-full md:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" /> New Brief
                </Button>
              </div>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search briefs..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  Latest
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full md:w-auto justify-start">
                <TabsTrigger value="all">All Briefs</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array(6).fill(0).map((_, i) => <ContentBriefSkeleton key={i} />)
                  ) : mockBriefs.length > 0 ? (
                    mockBriefs.map((brief) => (
                      <ContentBriefCard 
                        key={brief.id} 
                        brief={brief} 
                        onClick={() => navigate(`/dashboard/briefs/${brief.id}`)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No briefs found in this workspace</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Get started by creating your first content brief in the {currentWorkspace?.name} workspace
                      </p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="gradient-button"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Create Brief
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <CreateBriefDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateBrief}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

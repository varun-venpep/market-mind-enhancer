
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, TrendingUp, FileText, BookOpen, Filter } from "lucide-react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const handleCreateBrief = (title: string, keywords: string[]) => {
    console.log("Creating brief:", title, keywords);
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground">Here's an overview of your content strategy</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
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
                    <h3 className="text-lg font-medium">No briefs found</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                      Get started by creating your first content brief
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

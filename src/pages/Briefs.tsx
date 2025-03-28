
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentBriefCard } from "@/components/Dashboard/ContentBriefCard";
import { ContentBriefSkeleton } from "@/components/Dashboard/ContentBriefSkeleton";
import { CreateBriefDialog } from "@/components/Dashboard/CreateBriefDialog";
import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContentBrief } from "@/types";

// Mock data
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
  },
  {
    id: "4",
    title: "Content marketing strategies for B2B companies",
    status: "completed",
    keywords: ["B2B content marketing", "lead generation", "business content"],
    createdAt: "2023-10-05T11:30:00Z",
    updatedAt: "2023-10-08T14:45:00Z",
    score: 85,
    wordCount: 2200,
    searchVolume: 4100,
    difficulty: 55
  },
  {
    id: "5",
    title: "Local SEO guide for small businesses",
    status: "in-progress",
    keywords: ["local SEO", "small business marketing", "Google My Business"],
    createdAt: "2023-10-02T09:20:00Z",
    updatedAt: "2023-10-06T13:10:00Z",
    score: 72,
    wordCount: 1600,
    searchVolume: 6300,
    difficulty: 40
  },
  {
    id: "6",
    title: "How to create an effective content calendar",
    status: "draft",
    keywords: ["content calendar", "content planning", "editorial schedule"],
    createdAt: "2023-09-28T15:45:00Z",
    updatedAt: "2023-09-28T15:45:00Z",
    searchVolume: 3800,
    difficulty: 35
  }
];

export const Briefs = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [briefs, setBriefs] = useState<ContentBrief[]>(mockBriefs);

  const filteredBriefs = briefs.filter(brief => {
    // Filter by search term
    const matchesSearch = brief.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brief.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status tab
    const matchesTab = activeTab === "all" || brief.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleCreateBrief = (title: string, keywords: string[]) => {
    // In a real app, this would create a new brief in the database
    const newBrief: ContentBrief = {
      id: (briefs.length + 1).toString(),
      title,
      keywords,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      searchVolume: Math.floor(Math.random() * 5000) + 1000,
      difficulty: Math.floor(Math.random() * 60) + 30
    };

    setBriefs([newBrief, ...briefs]);
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Content Briefs</h1>
              <p className="text-muted-foreground">Create and manage your content optimization briefs</p>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="gradient-button w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> New Brief
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search briefs by title or keyword..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="aspect-square flex-shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>Sort: Latest</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full md:w-auto justify-start">
              <TabsTrigger value="all">All Briefs</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <ContentBriefSkeleton key={i} />
                  ))}
                </div>
              ) : filteredBriefs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBriefs.map((brief) => (
                    <ContentBriefCard 
                      key={brief.id} 
                      brief={brief} 
                      onClick={() => navigate(`/dashboard/briefs/${brief.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted/60 p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No matching briefs found</h3>
                    <p className="text-muted-foreground mt-2 mb-4 max-w-md">
                      {searchTerm 
                        ? `We couldn't find any briefs matching "${searchTerm}". Try a different search term or clear your filters.`
                        : "You don't have any content briefs yet. Create your first brief to get started."}
                    </p>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="gradient-button"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create Brief
                    </Button>
                  </CardContent>
                </Card>
              )}
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

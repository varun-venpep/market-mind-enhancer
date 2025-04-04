
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentBriefCard } from "@/components/Dashboard/ContentBriefCard";
import { ContentBriefSkeleton } from "@/components/Dashboard/ContentBriefSkeleton";
import { CreateBriefDialog } from "@/components/Dashboard/CreateBriefDialog";
import { Filter, Plus, Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContentBrief } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { generateBriefContent, generateBriefThumbnail } from "@/services/briefService";

export const Briefs = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [briefs, setBriefs] = useState<ContentBrief[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading briefs from a database
    setIsLoading(true);
    
    // In a real app, this would fetch from Supabase or another backend
    setTimeout(() => {
      setBriefs([
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
          difficulty: 45,
          thumbnailUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1632&auto=format&fit=crop"
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
          difficulty: 62,
          thumbnailUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1740&auto=format&fit=crop"
        },
        {
          id: "3",
          title: "E-commerce SEO best practices for 2023",
          status: "draft",
          keywords: ["e-commerce SEO", "best practices", "online store optimization"],
          createdAt: "2023-10-10T08:15:00Z",
          updatedAt: "2023-10-10T08:15:00Z",
          searchVolume: 5200,
          difficulty: 68,
          thumbnailUrl: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=1674&auto=format&fit=crop"
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
          difficulty: 55,
          thumbnailUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1740&auto=format&fit=crop"
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
          difficulty: 40,
          thumbnailUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?q=80&w=1740&auto=format&fit=crop"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredBriefs = briefs.filter(brief => {
    // Filter by search term
    const matchesSearch = brief.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brief.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status tab
    const matchesTab = activeTab === "all" || brief.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleCreateBrief = async (title: string, keywords: string[]) => {
    try {
      setIsCreateDialogOpen(false);
      
      // Create loading toast
      toast({
        title: "Creating Brief",
        description: "Generating content brief with AI...",
      });
      
      // In a real app, this would create a new brief in Supabase
      const newBriefId = (briefs.length + 1).toString();
      
      // Create base brief object
      const newBrief: ContentBrief = {
        id: newBriefId,
        title,
        keywords,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        searchVolume: Math.floor(Math.random() * 5000) + 1000,
        difficulty: Math.floor(Math.random() * 60) + 30
      };
      
      // Generate content details using Gemini
      const { outline, questions, recommendedWordCount, contentScore } = 
        await generateBriefContent(newBrief);
      
      // Generate thumbnail image
      const thumbnailUrl = await generateBriefThumbnail(newBrief);
      
      // Update the brief with generated content
      const completeBrief: ContentBrief = {
        ...newBrief,
        thumbnailUrl,
        outline,
        questions,
        recommendedWordCount,
        score: contentScore
      };
      
      // Update state with the new brief
      setBriefs(prev => [completeBrief, ...prev]);
      
      // Show success toast
      toast({
        title: "Brief Created",
        description: "Your content brief has been created successfully.",
        variant: "success",
      });
      
      // Navigate to the new brief
      navigate(`/dashboard/briefs/${newBriefId}`);
      
    } catch (error) {
      console.error("Error creating brief:", error);
      toast({
        title: "Error Creating Brief",
        description: "There was a problem creating your content brief. Please try again.",
        variant: "destructive",
      });
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          
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

export default Briefs;

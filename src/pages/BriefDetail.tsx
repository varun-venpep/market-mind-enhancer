
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { BriefHeader } from "@/components/ContentBrief/BriefHeader";
import { KeywordSection } from "@/components/ContentBrief/KeywordSection";
import { ContentOutline } from "@/components/ContentBrief/ContentOutline";
import { OptimizationTips } from "@/components/ContentBrief/OptimizationTips";
import { CompetitorInsights } from "@/components/ContentBrief/CompetitorInsights";
import { ContentEditor } from "@/components/ContentBrief/ContentEditor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ContentBrief } from "@/types";
import { generateBriefContent, generateBriefThumbnail } from "@/services/briefService";

const BriefDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [brief, setBrief] = useState<ContentBrief | null>(null);
  const [score, setScore] = useState(60);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const { toast } = useToast();

  // Mock briefs data
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
  ];

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from a database
        const foundBrief = mockBriefs.find(b => b.id === id);
        
        if (foundBrief) {
          // If this brief doesn't have AI-generated content yet, generate it
          if (!foundBrief.outline || !foundBrief.questions) {
            try {
              // Generate content with Gemini
              const { outline, questions, recommendedWordCount, contentScore } = 
                await generateBriefContent(foundBrief);
                
              // Update the brief with generated content
              const updatedBrief = {
                ...foundBrief,
                outline,
                questions,
                recommendedWordCount,
                score: contentScore
              };
              
              // If no thumbnail, generate one
              if (!updatedBrief.thumbnailUrl) {
                const thumbnailUrl = await generateBriefThumbnail(updatedBrief);
                updatedBrief.thumbnailUrl = thumbnailUrl;
              }
              
              setBrief(updatedBrief);
              setScore(contentScore);
            } catch (error) {
              console.error("Error generating brief content:", error);
              // Use the brief without AI-generated content
              setBrief(foundBrief);
              setScore(foundBrief.score || 60);
            }
          } else {
            setBrief(foundBrief);
            setScore(foundBrief.score || 60);
          }
        } else {
          // Brief not found
          toast({
            title: "Brief Not Found",
            description: "The requested content brief could not be found.",
            variant: "destructive",
          });
          navigate("/dashboard/briefs");
        }
      } catch (error) {
        console.error("Error fetching brief:", error);
        toast({
          title: "Error",
          description: "Failed to load the content brief.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrief();
  }, [id, navigate, toast]);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    
    // In a real app, this would update the score in a database
    if (brief) {
      setBrief({
        ...brief,
        score: newScore,
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading Brief...</h2>
          <p className="text-muted-foreground mt-2">Preparing your content optimization data</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!brief) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h2 className="text-xl font-medium">Brief Not Found</h2>
          <p className="text-muted-foreground mt-2 mb-4">The requested brief could not be found.</p>
          <Button onClick={() => navigate("/dashboard/briefs")}>
            Back to Briefs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Default data if certain properties are missing
  const briefData = {
    ...brief,
    outline: brief.outline || [
      { text: "Introduction", importance: 10, description: "Introduce the topic and its importance" },
      { text: "Main Points", importance: 8, description: "Cover the key aspects of the topic" },
      { text: "Practical Tips", importance: 7, description: "Provide actionable advice for readers" },
      { text: "Case Studies", importance: 6, description: "Include real-world examples" },
      { text: "Conclusion", importance: 9, description: "Summarize key takeaways" }
    ],
    questions: brief.questions || [
      "What are the key benefits of this approach?",
      "How can beginners get started with this topic?",
      "What common challenges might someone face?",
      "How does this compare to alternatives?",
      "What future trends should readers be aware of?"
    ],
    recommendedWordCount: brief.recommendedWordCount || { min: 1200, max: 2000 }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/briefs')} 
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Briefs</span>
          </Button>
        </div>

        <BriefHeader brief={briefData} score={score} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto justify-start">
            <TabsTrigger value="editor">Content Editor</TabsTrigger>
            <TabsTrigger value="brief">Brief Details</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-6">
            <ContentEditor 
              briefData={briefData} 
              score={score}
              onScoreChange={handleScoreChange}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </TabsContent>
          
          <TabsContent value="brief" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <ContentOutline 
                  outline={briefData.outline} 
                  onUpdate={(outline) => console.log(outline)}
                />
                <KeywordSection 
                  keywords={briefData.keywords} 
                  questions={briefData.questions}
                />
              </div>
              <div>
                <OptimizationTips brief={briefData} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="competitors" className="mt-6">
            <CompetitorInsights keyword={briefData.keywords[0]} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BriefDetail;

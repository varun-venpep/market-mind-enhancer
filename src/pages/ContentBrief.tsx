
import { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowUpRight, Award, BookOpen, CheckCircle, Clock, Download, FileText, HelpCircle, Layers, List, Play, Plus, Save, Share2, Target, Trash2 } from "lucide-react";
import {
  BriefHeader,
  KeywordSection,
  ContentOutline,
  CompetitorInsights,
  OptimizationTips,
  ContentEditor
} from "@/components/ContentBrief";
import { ContentBrief as ContentBriefType, OutlineItem } from "@/types";

const ContentBrief = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("brief");
  const [score, setScore] = useState(78);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data that would normally be fetched from the API
  const briefData: ContentBriefType = {
    id: id || "1",
    title: "How to optimize content for AI search engines",
    status: "in-progress",
    keywords: ["AI search engines", "content optimization", "SEO for AI"],
    searchVolume: 2800,
    difficulty: 55,
    aiPotential: 89,
    createdAt: "2023-10-15T14:00:00Z",
    updatedAt: "2023-10-18T09:30:00Z",
    outline: [
      {
        id: "h1",
        type: "h1" as const,
        text: "Optimizing Content for AI Search Engines in 2023",
        score: 95
      },
      {
        id: "h2-1",
        type: "h2" as const,
        text: "Understanding How AI Search Engines Work",
        score: 85,
        children: [
          {
            id: "h3-1",
            type: "h3" as const,
            text: "Key Differences Between Traditional and AI Search",
            score: 90
          },
          {
            id: "h3-2",
            type: "h3" as const,
            text: "How AI Evaluates Content Quality and Relevance",
            score: 88
          }
        ]
      },
      {
        id: "h2-2",
        type: "h2" as const,
        text: "Essential Optimization Strategies for AI Search",
        score: 92,
        children: [
          {
            id: "h3-3",
            type: "h3" as const,
            text: "Creating Comprehensive, In-depth Content",
            score: 95
          },
          {
            id: "h3-4",
            type: "h3" as const,
            text: "Focusing on User Intent and Conversational Queries",
            score: 96
          }
        ]
      },
      {
        id: "h2-3",
        type: "h2" as const,
        text: "Tools and Techniques for AI-First Content Creation",
        score: 89
      },
      {
        id: "h2-4",
        type: "h2" as const,
        text: "Measuring Success in AI Search Environments",
        score: 86
      },
      {
        id: "h2-5",
        type: "h2" as const,
        text: "Future Trends in AI Search Optimization",
        score: 82
      }
    ],
    recommendedWordCount: {
      min: 1800,
      max: 2400
    },
    questions: [
      "How do AI search engines differ from traditional search?",
      "What content formats work best for AI search engines?",
      "How to optimize for voice search powered by AI?",
      "Will AI search completely replace traditional search engines?",
      "What metrics should I track for AI search optimization?"
    ],
    score: score,
    wordCount: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1920&auto=format&fit=crop"
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <BriefHeader 
          brief={briefData}
          score={score}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full md:w-auto justify-start">
                <TabsTrigger value="brief">
                  <FileText className="h-4 w-4 mr-2" />
                  Content Brief
                </TabsTrigger>
                <TabsTrigger value="editor">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Content Editor
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <Layers className="h-4 w-4 mr-2" />
                  Competitor Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="brief" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Target Keywords</CardTitle>
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Keyword
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <KeywordSection 
                        mainKeyword={briefData.keywords[0]}
                        keywords={briefData.keywords}
                        searchVolume={briefData.searchVolume}
                        difficulty={briefData.difficulty}
                        aiPotential={briefData.aiPotential || 0}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Content Outline</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            AI Suggestions
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Section
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ContentOutline 
                        outline={briefData.outline}
                        onUpdate={(newOutline) => console.log(newOutline)}
                      />
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t">
                      <div className="w-full">
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                          <span>Estimated Word Count</span>
                          <span className="font-medium">{briefData.recommendedWordCount.min}-{briefData.recommendedWordCount.max} words</span>
                        </div>
                        <Progress value={45} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Too Short</span>
                          <span>Recommended</span>
                          <span>Too Long</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Questions to Address</CardTitle>
                      <CardDescription>
                        Cover these user questions to make your content more comprehensive
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {briefData.questions.map((question, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                              <Target className="h-4 w-4 text-primary" />
                            </div>
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <OptimizationTips brief={briefData} />
                </div>
              </TabsContent>
              
              <TabsContent value="editor" className="mt-6">
                <ContentEditor 
                  briefData={briefData}
                  score={score}
                  onScoreChange={setScore}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-6">
                <CompetitorInsights keyword={briefData.keywords[0]} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Content Score</CardTitle>
                <CardDescription>
                  How well your content aligns with search intent
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 w-24 h-24 mb-4">
                    <span className="text-3xl font-bold text-white">{score}</span>
                  </div>
                  <div>
                    {score >= 90 ? (
                      <Badge className="bg-green-500">Excellent</Badge>
                    ) : score >= 70 ? (
                      <Badge className="bg-amber-500">Good</Badge>
                    ) : (
                      <Badge className="bg-red-500">Needs Work</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Keyword Usage", score: 85 },
                    { name: "Topic Coverage", score: 72 },
                    { name: "Readability", score: 90 },
                    { name: "AI Search Potential", score: 68 }
                  ].map((metric) => (
                    <div key={metric.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">{metric.name}</span>
                        <span className="text-sm font-medium">{metric.score}</span>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button className="justify-start" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save As
                  </Button>
                </div>
              </CardContent>
              <Separator />
              <CardContent className="pt-3">
                <Button variant="destructive" className="w-full justify-center">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Brief
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    { name: "Content Optimization Guide", icon: BookOpen },
                    { name: "AI Search Best Practices", icon: Award },
                    { name: "Keyword Research Tips", icon: Target }
                  ].map((resource) => (
                    <li key={resource.name}>
                      <Button variant="ghost" className="w-full justify-start hover:bg-muted p-2 h-auto">
                        <resource.icon className="h-4 w-4 mr-2" />
                        <span>{resource.name}</span>
                        <ArrowUpRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentBrief;

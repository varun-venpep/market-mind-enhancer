
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { List, Lightbulb, ArrowRight, HelpCircle, Bookmark, Plus, Loader2 } from "lucide-react";
import { generateContent } from "@/services/geminiApi";
import { useToast } from "@/components/ui/use-toast";

interface TopicExplorerProps {
  keyword: string;
  questions?: string[]; // Add questions prop to interface
}

export const TopicExplorer = ({ keyword, questions: initialQuestions }: TopicExplorerProps) => {
  const [activeTab, setActiveTab] = useState("topics");
  const [topics, setTopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch topics and questions from Gemini if we don't have initial questions
    if (!initialQuestions || initialQuestions.length === 0) {
      generateTopicsAndQuestions();
    } else {
      setQuestions(initialQuestions);
      generateTopicsOnly();
    }
  }, [keyword, initialQuestions]);
  
  const generateTopicsAndQuestions = async () => {
    setIsLoading(true);
    try {
      const prompt = `Analyze the keyword "${keyword}" and provide:
      1. A JSON array of 5 related topic clusters, each with:
         - name: Name of the topic cluster
         - relevance: A number from 1-100 indicating relevance to main keyword
         - questions: An array of 4 common user questions about this topic
      
      2. A separate JSON array of 15 most popular questions users ask about "${keyword}"
      
      Format your response as a single JSON object with two properties:
      - topics: The array of topic clusters
      - questions: The array of popular questions
      
      Return ONLY the JSON, with no additional text.`;
      
      const response = await generateContent(prompt);
      
      // Extract JSON from the response
      const jsonStr = response.replace(/```json|```/g, '').trim();
      let data;
      
      try {
        data = JSON.parse(jsonStr);
        setTopics(data.topics || []);
        setQuestions(data.questions || []);
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        // Fallback to default data
        setTopics(getFallbackTopics());
        setQuestions(getFallbackQuestions());
      }
    } catch (error) {
      console.error("Error generating topics and questions:", error);
      toast({
        title: "Error",
        description: "Failed to generate research data. Using sample data instead.",
        variant: "destructive"
      });
      
      // Fallback to default data
      setTopics(getFallbackTopics());
      setQuestions(getFallbackQuestions());
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateTopicsOnly = async () => {
    setIsLoading(true);
    try {
      const prompt = `Analyze the keyword "${keyword}" and provide a JSON array of 5 related topic clusters, each with:
      - name: Name of the topic cluster
      - relevance: A number from 1-100 indicating relevance to main keyword
      - questions: An array of 4 common user questions about this topic
      
      Return ONLY the JSON array, with no additional text.`;
      
      const response = await generateContent(prompt);
      
      // Extract JSON from the response
      const jsonStr = response.replace(/```json|```/g, '').trim();
      
      try {
        const data = JSON.parse(jsonStr);
        setTopics(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        setTopics(getFallbackTopics());
      }
    } catch (error) {
      console.error("Error generating topics:", error);
      setTopics(getFallbackTopics());
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFallbackTopics = () => {
    return [
      {
        name: "AI Search Technology",
        relevance: 95,
        questions: [
          "How do AI search engines work compared to traditional search?",
          "What technology powers AI search engines?",
          "How accurate are AI search results?",
          "Can AI search engines understand context better than traditional search?"
        ]
      },
      {
        name: "Content Optimization Strategies",
        relevance: 92,
        questions: [
          "What content formats work best for AI search engines?",
          "How should content be structured for AI search?",
          "Do AI search engines prefer longer or shorter content?",
          "How important is keyword density for AI search optimization?"
        ]
      },
      {
        name: "Voice Search Optimization",
        relevance: 88,
        questions: [
          "How to optimize content for voice search powered by AI?",
          "What are the differences between text and voice search optimization?",
          "How are featured snippets related to voice search results?",
          "What role do conversational keywords play in voice search?"
        ]
      },
      {
        name: "AI Search Metrics and Analytics",
        relevance: 86,
        questions: [
          "What metrics should I track for AI search optimization?",
          "How do I measure success in AI search engines?",
          "What analytics tools work with AI search performance?",
          "Are traditional SEO metrics relevant for AI search?"
        ]
      },
      {
        name: "Future of AI Search",
        relevance: 84,
        questions: [
          "Will AI search completely replace traditional search engines?",
          "How will AI search evolve in the next 5 years?",
          "What new AI search technologies are being developed?",
          "How will AI search impact content creation in the future?"
        ]
      }
    ];
  };
  
  const getFallbackQuestions = () => {
    return [
      "How do AI search engines work?",
      "What is the difference between AI search and traditional search?",
      "How to optimize content for AI search engines?",
      "Do AI search engines prioritize different content than Google?",
      "What are the best AI search engines in 2023?",
      "How to measure content performance in AI search?",
      "Can AI search understand context better than traditional search?",
      "What content formats work best with AI search engines?",
      "How important is keyword optimization for AI search?",
      "Will AI search replace traditional search engines?",
      "How to optimize for voice search powered by AI?",
      "What role does structured data play in AI search optimization?",
      "How do AI chatbots use search technology?",
      "Are backlinks important for AI search engines?",
      "What metrics should I track for AI search optimization?"
    ];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium mb-2">Analyzing Topic Data</h3>
        <p className="text-center text-muted-foreground max-w-md">
          Researching trends and questions related to "{keyword}"...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-auto justify-start">
          <TabsTrigger value="topics">
            <Lightbulb className="h-4 w-4 mr-2" />
            Topic Clusters
          </TabsTrigger>
          <TabsTrigger value="questions">
            <HelpCircle className="h-4 w-4 mr-2" />
            Popular Questions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="topics" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {topics.map((topic, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{topic.name}</CardTitle>
                      <CardDescription>
                        Relevance: <span className="font-medium text-brand-600">{topic.relevance}%</span>
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                      <span className="sr-only">Save topic</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium mb-2">Popular Questions:</h4>
                  <ul className="space-y-2">
                    {topic.questions.map((question, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <HelpCircle className="h-3 w-3 text-primary" />
                        </div>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Brief
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Popular Questions About {keyword}</CardTitle>
              <CardDescription>
                Questions frequently asked by users searching for this topic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {questions.map((question, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{question}</p>
                      <Button variant="ghost" size="sm" className="mt-1 h-7 px-2">
                        <Plus className="h-3 w-3 mr-1" />
                        <span className="text-xs">Add to Brief</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

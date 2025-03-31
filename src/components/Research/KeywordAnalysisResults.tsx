import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Globe, Heading1, List, Star, Zap } from "lucide-react";
import { SerpResult } from "@/types";

interface KeywordAnalysisResultsProps {
  keyword: string;
  results?: SerpResult[];
}

export const KeywordAnalysisResults = ({ keyword, results }: KeywordAnalysisResultsProps) => {
  const [currentTab, setCurrentTab] = useState("overview");
  
  const mockResults = [
    {
      id: 1,
      position: 1,
      title: "The Ultimate Guide to AI Search Engines in 2023",
      url: "https://example.com/ai-search-engines-guide",
      snippet: "Learn everything about AI search engines and how they're changing the way we find information online. This comprehensive guide covers...",
      wordCount: 2450,
      headings: [
        "What Are AI Search Engines?",
        "How AI Search Differs From Traditional Search",
        "Top AI Search Engines in 2023",
        "Optimizing Content for AI Search",
        "The Future of AI-Powered Search"
      ],
      domain: "example.com",
      publishDate: "2023-08-15"
    },
    {
      id: 2,
      position: 2,
      title: "AI Search Optimization: 10 Strategies That Work",
      url: "https://anothersite.com/ai-search-optimization",
      snippet: "Discover 10 proven strategies to optimize your content for AI search engines and increase your visibility in AI-powered platforms...",
      wordCount: 1850,
      headings: [
        "Understanding AI Search Algorithms",
        "Strategy 1: Comprehensive Content Creation",
        "Strategy 2: Natural Language Optimization",
        "Strategy 3: User Intent Mapping",
        "Strategy 4: AI-Friendly Structured Data"
      ],
      domain: "anothersite.com",
      publishDate: "2023-07-22"
    },
    {
      id: 3,
      position: 3,
      title: "How AI Is Changing SEO and Content Creation",
      url: "https://seoblog.com/ai-changing-seo",
      snippet: "Artificial intelligence is transforming how content ranks in search engines. Learn how content creators need to adapt their strategies...",
      wordCount: 2100,
      headings: [
        "The Rise of AI in Search Technology",
        "Key Differences Between Traditional SEO and AI SEO",
        "Content Strategies for AI Search Success",
        "Tools for AI-Optimized Content Creation",
        "Case Studies: Successful AI Content Optimization"
      ],
      domain: "seoblog.com",
      publishDate: "2023-09-05"
    }
  ];

  const resultsToDisplay = results || mockResults;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
            Top Ranking Content for "{keyword}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="headings">Headings</TabsTrigger>
              <TabsTrigger value="content">Content Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {resultsToDisplay.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="mb-2">{result.position}</Badge>
                    <Badge variant="secondary" className="font-normal">
                      {result.wordCount} words
                    </Badge>
                  </div>
                  <h3 className="text-lg font-medium mb-1 line-clamp-2">{result.title}</h3>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center">
                    <span className="text-green-600">{result.domain}</span>
                    <span className="mx-2">•</span>
                    <span>{result.publishDate}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{result.snippet}</p>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Page
                  </Button>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="headings" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {resultsToDisplay.map((result) => (
                  <Card key={result.id} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-muted/30">
                      <Badge className="w-fit mb-2">{result.position}</Badge>
                      <h3 className="font-medium line-clamp-2">{result.title}</h3>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Heading1 className="h-4 w-4 mr-2" />
                        Main Headings
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {result.headings.map((heading, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="bg-primary/10 text-primary text-xs rounded px-1.5 py-0.5 mt-0.5">
                              H{i === 0 ? "1" : "2"}
                            </span>
                            <span>{heading}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Word Count Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average:</span>
                        <span className="font-medium">2,133 words</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Range:</span>
                        <span className="font-medium">1,850 - 2,450 words</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Recommendation:</span>
                        <span className="font-medium text-green-600">2,000 - 2,500 words</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Common Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex flex-wrap gap-1">
                      {[
                        "AI search algorithms",
                        "Optimization strategies",
                        "Traditional vs AI search",
                        "Content structure",
                        "User intent",
                        "Future trends",
                        "Structured data",
                        "Natural language"
                      ].map((topic, i) => (
                        <Badge key={i} variant="secondary" className="font-normal">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Content Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-2">
                    {[
                      "Include a comprehensive explanation of AI search technology",
                      "Compare traditional search engines with AI-powered ones",
                      "Provide actionable optimization strategies",
                      "Use structured data to enhance content clarity",
                      "Include examples or case studies of successful optimization",
                      "Address future trends and implications for content creators"
                    ].map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <List className="h-3 w-3 text-primary" />
                        </div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

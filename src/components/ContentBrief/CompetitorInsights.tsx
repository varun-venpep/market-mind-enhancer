
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, BarChart3, ExternalLink, FileText, Globe, ImageIcon, Search } from "lucide-react";

interface CompetitorInsightsProps {
  keyword?: string;
  keywords?: string[];
}

export const CompetitorInsights = ({ keyword, keywords }: CompetitorInsightsProps) => {
  const [activeTab, setActiveTab] = useState("serp");
  const mainKeyword = keyword || (keywords && keywords.length > 0 ? keywords[0] : "");

  const competitorData = [
    {
      title: "10 Proven Strategies for AI Search Engine Optimization in 2023",
      url: "https://example.com/ai-seo-strategies",
      snippet: "Learn the most effective techniques for optimizing your content specifically for AI-powered search engines. This comprehensive guide covers everything from...",
      position: 1,
      wordCount: 2450,
      headings: ["Introduction to AI Search", "How AI Search Differs from Traditional SEO", "10 Optimization Strategies", "Implementation Guide", "Case Studies", "Future Trends"]
    },
    {
      title: "AI Search Engines: The Complete Optimization Guide",
      url: "https://example.com/complete-ai-search-guide",
      snippet: "Our step-by-step optimization guide for the new generation of AI-powered search engines. Discover how to make your content more visible and relevant...",
      position: 2,
      wordCount: 3100,
      headings: ["Understanding AI Search", "Content Quality Factors", "Technical Requirements", "User Intent Optimization", "Performance Metrics", "Tools and Resources"]
    },
    {
      title: "Why Traditional SEO Fails with AI Search Engines",
      url: "https://example.com/traditional-seo-vs-ai",
      snippet: "The rules have changed. Find out why your old SEO tactics might be hurting your rankings in AI search results and what you should be doing instead...",
      position: 3,
      wordCount: 1850,
      headings: ["The Evolution of Search", "Where Traditional SEO Falls Short", "Core AI Ranking Factors", "Content Strategy Shift", "Practical Examples", "Action Steps"]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Competitor Analysis</h2>
        <p className="text-muted-foreground">
          See what's currently ranking for "{mainKeyword}" and learn what makes these pages successful
        </p>
      </div>

      <Tabs defaultValue="serp" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="serp">
            <Search className="h-4 w-4 mr-2" />
            SERP Analysis
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Content Patterns
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="serp" className="mt-6 space-y-4">
          {competitorData.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center text-sm mb-1">
                      <Globe className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                      <span className="text-muted-foreground">{item.url.split('/')[2]}</span>
                    </div>
                    <CardTitle className="text-base font-medium">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center"
                      >
                        {item.title}
                        <ExternalLink className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
                      </a>
                    </CardTitle>
                  </div>
                  <span className="bg-muted px-2 py-1 rounded-md text-sm font-medium">
                    #{item.position}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {item.snippet}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="bg-muted/60 px-2 py-1 rounded flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {item.wordCount} words
                  </div>
                  <div className="bg-muted/60 px-2 py-1 rounded flex items-center">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    6 images
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" className="w-full">
            View More Results
          </Button>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Common Headings & Topics</CardTitle>
              <CardDescription>
                Topics frequently covered by top-ranking content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {['Understanding AI Search', 'Key Differences from Traditional SEO', 'Content Quality Factors', 
                  'Optimization Strategies', 'Technical Requirements', 'Case Studies', 'Future Trends'].map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-primary font-medium">{i+1}</span>
                    </div>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Add Missing Topics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Metrics</CardTitle>
              <CardDescription>
                Average metrics from top-ranking content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Word Count</span>
                    <span className="text-sm font-medium">2,450 words</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1,500</span>
                    <span>3,500</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Headings</span>
                    <span className="text-sm font-medium">8 headings</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Images</span>
                    <span className="text-sm font-medium">6 images</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Keyword Density</span>
                    <span className="text-sm font-medium">1.3%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

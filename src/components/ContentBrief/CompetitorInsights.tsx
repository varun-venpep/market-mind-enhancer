
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, BarChart2, BookOpen, ChevronRight, Download, ExternalLink, File, FileText, Globe, Heading1, Heading2, Layers, List, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompetitorInsightsProps {
  keyword: string;
}

export const CompetitorInsights = ({ keyword }: CompetitorInsightsProps) => {
  // Mock data for demonstration
  const competitorData = [
    {
      url: "example.com/ai-search-optimization",
      title: "The Ultimate Guide to AI Search Optimization",
      metrics: {
        wordCount: 2450,
        headings: 12,
        images: 6,
        links: 18,
        readability: "Advanced"
      },
      contentTypes: ["How-to Guide", "Educational", "In-depth"],
      topics: ["AI Algorithms", "Search Intent", "Natural Language", "Voice Search", "Structured Data"],
      strengths: ["Comprehensive coverage", "Clear structure", "Expert insights", "Practical examples"]
    },
    {
      url: "anothersite.com/ai-seo-guide",
      title: "AI SEO: The Complete 2023 Strategy Guide",
      metrics: {
        wordCount: 3100,
        headings: 15,
        images: 9,
        links: 22,
        readability: "Intermediate"
      },
      contentTypes: ["Strategy Guide", "Tutorial", "Case Study"],
      topics: ["SEO Fundamentals", "AI Tools", "Content Strategy", "Technical SEO", "Performance Analysis"],
      strengths: ["Actionable tips", "Case studies", "Visual examples", "Step-by-step process"]
    },
    {
      url: "seoexperts.com/optimize-for-ai-search",
      title: "How to Optimize Your Content for AI Search Engines",
      metrics: {
        wordCount: 1850,
        headings: 9,
        images: 5,
        links: 14,
        readability: "Beginner"
      },
      contentTypes: ["Beginner Guide", "How-to", "Tips"],
      topics: ["Keyword Research", "Content Quality", "User Experience", "Mobile Optimization", "Page Speed"],
      strengths: ["Easy to understand", "Beginner-friendly", "Simple language", "Quick wins"]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Activity className="mr-2 h-5 w-5 text-muted-foreground" />
            Top Competitor Content Analysis for "{keyword}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="w-full md:w-auto justify-start mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content Structure</TabsTrigger>
              <TabsTrigger value="topics">Topic Coverage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        <div className="flex items-center">
                          <FileText className="mr-1 h-4 w-4" />
                          Length
                        </div>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Layers className="mr-1 h-4 w-4" />
                          Type
                        </div>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <div className="flex items-center">
                          <Zap className="mr-1 h-4 w-4" />
                          Key Strengths
                        </div>
                      </TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitorData.map((competitor, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="font-medium line-clamp-1">{competitor.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Globe className="mr-1 h-3 w-3" />
                            {competitor.url}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {competitor.metrics.wordCount.toLocaleString()} words
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {competitor.contentTypes.slice(0, 2).map((type, j) => (
                              <Badge key={j} variant="secondary" className="font-normal">
                                {type}
                              </Badge>
                            ))}
                            {competitor.contentTypes.length > 2 && (
                              <Badge variant="outline" className="font-normal">
                                +{competitor.contentTypes.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <ul className="text-xs space-y-1">
                            {competitor.strengths.slice(0, 2).map((strength, j) => (
                              <li key={j} className="flex items-start gap-1">
                                <div className="rounded-full bg-primary/10 p-0.5 mt-0.5">
                                  <List className="h-2 w-2 text-primary" />
                                </div>
                                <span>{strength}</span>
                              </li>
                            ))}
                            {competitor.strengths.length > 2 && (
                              <li className="text-muted-foreground">
                                +{competitor.strengths.length - 2} more
                              </li>
                            )}
                          </ul>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium">Avg. Word Count</h3>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">2,470</div>
                    <p className="text-xs text-muted-foreground">Range: 1,850 - 3,100</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium">Avg. Headings</h3>
                      <Heading1 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Mostly H2 + H3 structure</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium">Content Types</h3>
                      <Layers className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="font-normal text-xs">How-to</Badge>
                      <Badge variant="secondary" className="font-normal text-xs">Guide</Badge>
                      <Badge variant="secondary" className="font-normal text-xs">Tutorial</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium">Common Topics</h3>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="font-normal text-xs">AI Search</Badge>
                      <Badge variant="secondary" className="font-normal text-xs">SEO</Badge>
                      <Badge variant="secondary" className="font-normal text-xs">Content</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {competitorData.map((competitor, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-muted/30">
                      <div className="text-xs text-muted-foreground mb-1">
                        {competitor.url}
                      </div>
                      <h3 className="font-medium line-clamp-2">{competitor.title}</h3>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center bg-muted/30 rounded-md p-2">
                          <div className="text-xs text-muted-foreground">Words</div>
                          <div className="font-bold">{competitor.metrics.wordCount}</div>
                        </div>
                        <div className="text-center bg-muted/30 rounded-md p-2">
                          <div className="text-xs text-muted-foreground">Headings</div>
                          <div className="font-bold">{competitor.metrics.headings}</div>
                        </div>
                        <div className="text-center bg-muted/30 rounded-md p-2">
                          <div className="text-xs text-muted-foreground">Images</div>
                          <div className="font-bold">{competitor.metrics.images}</div>
                        </div>
                        <div className="text-center bg-muted/30 rounded-md p-2">
                          <div className="text-xs text-muted-foreground">Links</div>
                          <div className="font-bold">{competitor.metrics.links}</div>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium mb-2">Content Structure</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 p-1">
                            <Heading1 className="h-3 w-3 text-primary" />
                          </div>
                          <span>1 H1 heading</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 p-1">
                            <Heading2 className="h-3 w-3 text-primary" />
                          </div>
                          <span>{Math.floor(competitor.metrics.headings * 0.4)} H2 headings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 p-1">
                            <BarChart2 className="h-3 w-3 text-primary" />
                          </div>
                          <span>Readability: {competitor.metrics.readability}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button size="sm" variant="outline" className="w-full">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          View Content
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="topics">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-base font-medium mb-4">Topic Coverage Comparison</h3>
                  
                  <div className="space-y-6">
                    {["AI Search Technology", "Content Optimization", "User Intent", "Technical Factors", "Future Trends"].map((topicGroup, i) => (
                      <div key={i}>
                        <h4 className="text-sm font-medium mb-2">{topicGroup}</h4>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Topic</TableHead>
                                <TableHead className="text-center">Coverage</TableHead>
                                <TableHead className="hidden md:table-cell">Competitors Covering</TableHead>
                                <TableHead className="hidden lg:table-cell">Recommendation</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[1, 2, 3].map((_, j) => {
                                const topics = [
                                  "AI algorithms explained",
                                  "Traditional vs AI search differences",
                                  "AI content evaluation methods",
                                  "Semantic search understanding",
                                  "Natural language processing",
                                  "Content structure best practices",
                                  "User search behavior",
                                  "Question-based content",
                                  "Mobile optimization",
                                  "Page speed factors",
                                  "Structured data implementation",
                                  "Voice search optimization",
                                  "Future AI search trends",
                                  "AI-only content types",
                                  "Multimodal search"
                                ];
                                
                                const topic = topics[(i * 3 + j) % topics.length];
                                const coverage = Math.floor(Math.random() * 3) + 1;
                                const isImportant = Math.random() > 0.3;
                                
                                return (
                                  <TableRow key={j}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <span>{topic}</span>
                                        {isImportant && (
                                          <Badge className="bg-brand-500">Important</Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex justify-center">
                                        {Array(3).fill(0).map((_, k) => (
                                          <div 
                                            key={k}
                                            className={`h-2.5 w-2.5 rounded-full mx-0.5 ${
                                              k < coverage 
                                                ? "bg-green-500" 
                                                : "bg-muted"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {coverage}/3 competitors
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                      <div className="flex items-center gap-1">
                                        {coverage === 3 ? (
                                          <Badge variant="outline" className="font-normal text-green-600 border-green-600">
                                            Include
                                          </Badge>
                                        ) : coverage === 2 ? (
                                          <Badge variant="outline" className="font-normal text-amber-600 border-amber-600">
                                            Recommended
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="font-normal text-brand-600 border-brand-600">
                                            Opportunity
                                          </Badge>
                                        )}
                                        
                                        {coverage === 1 && (
                                          <div className="rounded-full bg-brand-100 p-0.5">
                                            <AlertCircle className="h-3 w-3 text-brand-600" />
                                          </div>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

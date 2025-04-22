import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Lightbulb, Search, Target, TrendingUp, Clock, Calendar, Users, Map, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchInsightsProps {
  keyword: string;
  data?: any;
}

export const SearchInsights = ({ keyword, data }: SearchInsightsProps) => {
  const searchVolume = data?.relatedKeywords && data.relatedKeywords.length > 0 
    ? Math.round(data.relatedKeywords.reduce((sum: number, kw: any) => sum + kw.searchVolume, 0) / data.relatedKeywords.length)
    : 0;
  
  const difficulty = data?.relatedKeywords && data.relatedKeywords.length > 0
    ? Math.round(data.relatedKeywords.reduce((sum: number, kw: any) => sum + kw.difficulty, 0) / data.relatedKeywords.length)
    : 0;
  
  const aiPotential = data?.relatedKeywords && data.relatedKeywords.length > 0
    ? Math.min(95, Math.max(65, 100 - difficulty + Math.floor(Math.random() * 10)))
    : 0;
  
  const growthTrend = data?.relatedKeywords && data.relatedKeywords.length > 0
    ? `+${Math.floor(Math.random() * 20 + 5)}%`
    : '+0%';
  
  const questions = data?.relatedQuestions && data.relatedQuestions.length > 0
    ? data.relatedQuestions.map((q: any) => q.question || q)
    : [];
  
  const hasData = data && Object.keys(data).length > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              Search Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <>
                <div className="text-2xl font-bold">{searchVolume.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+12%</span> from last month
                </p>
              </>
            ) : (
              <Skeleton className="h-8 w-full" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="mr-2 h-4 w-4 text-muted-foreground" />
              Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl font-bold">{difficulty}/100</span>
                  <Badge className={`${difficulty < 40 ? 'bg-green-500' : difficulty < 60 ? 'bg-amber-500' : 'bg-red-500'}`}>
                    {difficulty < 40 ? 'Easy' : difficulty < 60 ? 'Medium' : 'Hard'}
                  </Badge>
                </div>
                <Progress value={difficulty} className="h-2" />
              </>
            ) : (
              <Skeleton className="h-8 w-full" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Lightbulb className="mr-2 h-4 w-4 text-muted-foreground" />
              AI Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl font-bold">{aiPotential}/100</span>
                  <Badge className={`${aiPotential < 70 ? 'bg-amber-500' : 'bg-green-500'}`}>
                    {aiPotential < 70 ? 'Medium' : 'High'}
                  </Badge>
                </div>
                <Progress value={aiPotential} className="h-2" />
              </>
            ) : (
              <Skeleton className="h-8 w-full" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
              Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <>
                <div className="text-2xl font-bold">{growthTrend}</div>
                <p className="text-xs text-muted-foreground">Year over year increase</p>
              </>
            ) : (
              <Skeleton className="h-8 w-full" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Target className="mr-2 h-5 w-5 text-muted-foreground" />
            Search Intent Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <Tabs defaultValue="overview">
              <TabsList className="w-full md:w-auto justify-start mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">Primary Intent</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { type: "Informational", percentage: 65, icon: Search },
                        { type: "Commercial", percentage: 20, icon: Target },
                        { type: "Navigational", percentage: 10, icon: Map },
                        { type: "Transactional", percentage: 5, icon: TrendingUp }
                      ].map((intent) => (
                        <Card key={intent.type} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <div className={`rounded-full p-2 mb-2 ${
                                intent.type === "Informational" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" :
                                intent.type === "Commercial" ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300" :
                                intent.type === "Navigational" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" :
                                "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                              }`}>
                                <intent.icon className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-medium mb-1">{intent.type}</span>
                              <span className="text-2xl font-bold">{intent.percentage}%</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Key Insights</h3>
                    <ul className="space-y-2">
                      {questions.length > 0 ? (
                        questions.slice(0, 5).map((question: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                              <Lightbulb className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">{question}</span>
                          </li>
                        ))
                      ) : (
                        Array(5).fill(0).map((_, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                              <Lightbulb className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Users are interested in {keyword} fundamentals and best practices.</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="audience">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <Users className="h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="text-sm font-medium mb-1">Primary Audience</h3>
                          <span className="text-base font-bold">Content Creators</span>
                          <span className="text-xs text-muted-foreground mt-1">65% of searches</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <Map className="h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="text-sm font-medium mb-1">Top Locations</h3>
                          <span className="text-base font-bold">US, UK, Canada</span>
                          <span className="text-xs text-muted-foreground mt-1">82% of searches</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="text-sm font-medium mb-1">Average Time</h3>
                          <span className="text-base font-bold">4.2 minutes</span>
                          <span className="text-xs text-muted-foreground mt-1">on search results</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Audience Segments</h3>
                    <div className="space-y-3">
                      {[
                        { segment: "Content Marketers", percentage: 40, color: "bg-brand-500" },
                        { segment: "SEO Professionals", percentage: 25, color: "bg-amber-500" },
                        { segment: "Business Owners", percentage: 20, color: "bg-green-500" },
                        { segment: "Developers", percentage: 10, color: "bg-purple-500" },
                        { segment: "Others", percentage: 5, color: "bg-gray-500" }
                      ].map((segment) => (
                        <div key={segment.segment}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{segment.segment}</span>
                            <span className="text-sm font-medium">{segment.percentage}%</span>
                          </div>
                          <Progress value={segment.percentage} className={`h-2 ${segment.color}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium">Search Trend</h3>
                            <Badge variant="outline">Last 12 months</Badge>
                          </div>
                          <div className="h-32 flex items-end justify-between gap-1">
                            {[25, 30, 35, 40, 38, 42, 45, 50, 60, 70, 80, 85].map((value, i) => (
                              <div 
                                key={i} 
                                className="bg-brand-500 rounded-t w-full"
                                style={{ height: `${value}%` }}
                              ></div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>Jul</span>
                            <span>Aug</span>
                            <span>Sep</span>
                            <span>Oct</span>
                            <span>Nov</span>
                            <span>Dec</span>
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-medium mb-2">Seasonal Factors</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Peak Season
                              </span>
                              <span className="text-xs font-medium">Q1 & Q4</span>
                            </div>
                            <Progress value={75} className="h-1.5 bg-muted" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Growth Rate
                              </span>
                              <span className="text-xs font-medium">+18% YoY</span>
                            </div>
                            <Progress value={65} className="h-1.5 bg-muted" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs flex items-center">
                                <Target className="h-3 w-3 mr-1" />
                                Competitive Pressure
                              </span>
                              <span className="text-xs font-medium">Medium</span>
                            </div>
                            <Progress value={50} className="h-1.5 bg-muted" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Related Trending Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "AI content detection", growth: "+124%" },
                        { name: "Claude AI search", growth: "+98%" },
                        { name: "ChatGPT SEO", growth: "+86%" },
                        { name: "AI content guidelines", growth: "+72%" },
                        { name: "Perplexity search", growth: "+65%" },
                        { name: "BERT algorithm", growth: "+52%" },
                        { name: "Voice search AI", growth: "+48%" },
                        { name: "AI search accuracy", growth: "+45%" }
                      ].map((topic, i) => (
                        <Badge key={i} variant="secondary" className="gap-1 py-1">
                          {topic.name}
                          <span className="text-xs text-green-600">{topic.growth}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Info className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No data available for this keyword yet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart, FileText, ArrowRight, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

const Research = () => {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasResults(true);
    }, 1500);
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Keyword Research</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze search intent, discover related topics, and plan content that ranks.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <Card className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-6">
              <form onSubmit={handleSearch}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                      placeholder="Enter a keyword or topic (e.g., 'content optimization')"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="gradient-button" 
                    disabled={isLoading || !keyword.trim()}
                  >
                    {isLoading ? "Analyzing..." : "Analyze Intent"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
          
          {isLoading && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              <p className="mt-4 text-gray-500">Analyzing search intent and gathering insights...</p>
            </div>
          )}
          
          {hasResults && !isLoading && (
            <div className="mt-8">
              <Tabs defaultValue="intent">
                <TabsList className="mb-8">
                  <TabsTrigger value="intent">Search Intent</TabsTrigger>
                  <TabsTrigger value="topics">Related Topics</TabsTrigger>
                  <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="intent">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Search Intent Analysis</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Based on our analysis of top-ranking content for "content optimization"
                    </p>
                    
                    <div className="mt-6">
                      <div className="bg-brand-50 rounded-lg p-4 border border-brand-100">
                        <h3 className="font-medium text-brand-800">Primary Intent</h3>
                        <p className="mt-1 text-brand-600">
                          Informational - Users are looking for comprehensive guides on how to optimize their content for search engines.
                        </p>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-medium text-gray-800">Recommended Content Type</h3>
                          <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            <li className="flex items-center">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-600 mr-2"></span>
                              How-to guide (73% of top results)
                            </li>
                            <li className="flex items-center">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-400 mr-2"></span>
                              Step-by-step tutorial (18%)
                            </li>
                            <li className="flex items-center">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mr-2"></span>
                              Case study (9%)
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-medium text-gray-800">Recommended Word Count</h3>
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="flex items-center justify-between mb-1">
                              <span>1,800 - 2,500 words</span>
                              <span className="text-brand-600 font-medium">Recommended</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                              Top 10 results average: 2,120 words
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-800">User Questions</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Common questions users are asking related to this keyword:
                        </p>
                        <ul className="mt-3 space-y-3">
                          {["What is content optimization?", "How to optimize content for SEO?", "Content optimization tools", "How to optimize content for AI search engines?", "Content optimization best practices"].map((question, i) => (
                            <li key={i} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-800">{question}</span>
                                <Button variant="ghost" size="sm">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="topics">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Related Topics</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Discover related topics and keywords to expand your content strategy
                    </p>
                    
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {["SEO Content Optimization", "Content Readability", "Keyword Research", "Content Structure", "Meta Description Optimization", "Internal Linking Strategy"].map((topic, i) => (
                        <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                          <div className="p-4">
                            <h3 className="font-medium text-gray-800">{topic}</h3>
                            <div className="mt-2 flex items-center">
                              <div className="text-xs px-2 py-1 rounded-full bg-brand-100 text-brand-800">
                                Search Volume: {Math.floor(Math.random() * 10000)}
                              </div>
                              <div className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                Competition: {['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                            <Button variant="ghost" size="sm" className="text-brand-600 p-0 h-auto">
                              Explore topic <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="competitors">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Competitor Analysis</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Analyze the top-ranking content for your target keyword
                    </p>
                    
                    <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Title
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Domain
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Word Count
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Score
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {[
                            { title: "The Ultimate Guide to Content Optimization", domain: "hubspot.com", wordCount: 2430, score: 92 },
                            { title: "Content Optimization: The Complete SEO Guide", domain: "backlinko.com", wordCount: 3150, score: 94 },
                            { title: "How to Optimize Content for Search Engines", domain: "moz.com", wordCount: 1860, score: 90 },
                            { title: "Content Optimization Best Practices", domain: "semrush.com", wordCount: 2240, score: 89 },
                            { title: "Content Optimization for SEO in 2023", domain: "ahrefs.com", wordCount: 2680, score: 91 }
                          ].map((item, i) => (
                            <tr key={i}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {item.title}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.domain}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.wordCount}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {item.score} / 100
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="gradient-button">
                        Generate Content Brief
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Research;

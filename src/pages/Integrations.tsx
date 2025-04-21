
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, ArrowRight, ArrowLeft, Brain, Activity, FileText, Globe, Code, Rss } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSerpResults, extractSerpData } from "@/services/serpApi";

export default function Integrations() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalKeywords: 0,
    avgDifficulty: 0,
    avgVolume: 0,
    topKeywords: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSEOStats = async () => {
      try {
        setIsLoading(true);
        // Fetch real SERP data for stats
        const result = await fetchSerpResults("content marketing seo");
        const data = extractSerpData(result);
        
        // Calculate stats from actual data
        if (data.relatedKeywords && data.relatedKeywords.length > 0) {
          const totalKeywords = data.relatedKeywords.length;
          const avgDifficulty = Math.round(
            data.relatedKeywords.reduce((sum, kw) => sum + kw.difficulty, 0) / totalKeywords
          );
          const avgVolume = Math.round(
            data.relatedKeywords.reduce((sum, kw) => sum + kw.searchVolume, 0) / totalKeywords
          );
          
          // Get top keywords by search volume
          const topKeywords = [...data.relatedKeywords]
            .sort((a, b) => b.searchVolume - a.searchVolume)
            .slice(0, 5)
            .map(kw => kw.keyword);
          
          setStats({
            totalKeywords,
            avgDifficulty,
            avgVolume,
            topKeywords
          });
        }
      } catch (error) {
        console.error("Error fetching SERP data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSEOStats();
  }, []);

  const integrations = [
    {
      id: "shopify",
      name: "Shopify",
      description: "Connect your Shopify store to optimize product listings, create blog content, and enhance SEO performance.",
      icon: ShoppingBag,
      url: "/dashboard/shopify",
      status: "available",
      features: ["Product SEO", "Blog Content", "Site Audit"]
    },
    {
      id: "custom-site",
      name: "Custom Website",
      description: "Connect your custom-built website or web application with our API for SEO optimization.",
      icon: Code,
      url: "/dashboard/custom-site",
      status: "available",
      features: ["API Integration", "Content Optimization", "SEO Analytics"]
    },
    {
      id: "wordpress",
      name: "WordPress",
      description: "Integrate with WordPress sites to analyze and optimize content for better search visibility.",
      icon: Package,
      url: "#",
      status: "coming-soon",
      features: ["Content Audit", "SEO Optimization", "AI Content"]
    },
    {
      id: "content-generator",
      name: "AI Content Generator",
      description: "Generate SEO-optimized blog posts, articles, and product descriptions using Gemini AI.",
      icon: FileText,
      url: "/dashboard/content-generator",
      status: "available",
      features: ["Blog Posts", "Product Descriptions", "AI Images"]
    },
    {
      id: "blog-publishing",
      name: "Blog Publishing",
      description: "Connect Blogger and Medium accounts to publish and schedule your content directly from MarketMind.",
      icon: Rss,
      url: "/dashboard/blog-integrations",
      status: "available",
      features: ["Blogger", "Medium", "Scheduling"]
    },
    {
      id: "ai-agent",
      name: "AI SEO Agent",
      description: "Let AI automatically analyze and optimize your website based on keyword research and SERP analysis.",
      icon: Brain,
      url: "#",
      status: "coming-soon",
      features: ["Automated Audits", "Technical SEO", "Content Strategy"]
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')} 
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-3xl font-bold gradient-text">Integrations</h1>
            <p className="text-muted-foreground mt-1">
              Connect your platforms and leverage AI to automate SEO optimization and content creation
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="integrations" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="integrations">Platform Integrations</TabsTrigger>
            <TabsTrigger value="insights">SEO Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="hover-card transition-all duration-200 border-muted/40">
                  <CardHeader className="bg-muted/5">
                    <CardTitle className="flex items-center gap-2">
                      <integration.icon className="h-5 w-5 text-primary" />
                      {integration.name}
                    </CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {integration.features.map((feature, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end bg-muted/5 border-t p-4">
                    {integration.status === "available" ? (
                      <Button asChild>
                        <Link to={integration.url} className="gap-2">
                          Connect
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled variant="outline" className="gap-2">
                        Coming Soon
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-indigo-950/30 dark:to-pink-950/30 border-muted/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    Keyword Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
                  ) : (
                    <div className="text-3xl font-bold">{stats.totalKeywords}</div>
                  )}
                  <p className="text-muted-foreground text-sm">Analyzed keywords</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 border-muted/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    Average Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
                  ) : (
                    <div className="text-3xl font-bold">{stats.avgDifficulty}/100</div>
                  )}
                  <p className="text-muted-foreground text-sm">Keyword difficulty score</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-muted/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-500" />
                    Search Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
                  ) : (
                    <div className="text-3xl font-bold">{stats.avgVolume.toLocaleString()}</div>
                  )}
                  <p className="text-muted-foreground text-sm">Avg. monthly searches</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-muted/40 mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingKeywords className="h-5 w-5 text-primary" />
                  Trending Keywords
                </CardTitle>
                <CardDescription>
                  Popular keywords that can drive traffic to your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 w-32 animate-pulse bg-muted/30 rounded-full"></div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {stats.topKeywords.map((keyword, i) => (
                      <div key={i} className="bg-muted/20 text-primary rounded-full px-3 py-1 text-sm">
                        {keyword}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function TrendingKeywords(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

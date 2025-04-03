
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, ArrowRight, ArrowLeft, Brain, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { fetchSerpResults, extractSerpData } from "@/services/serpApi";
import { toast } from "sonner";

export default function Integrations() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalKeywords: 0,
    avgDifficulty: 0,
    avgVolume: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSEOStats = async () => {
      try {
        setIsLoading(true);
        // Fetch some real SERP data for stats
        const result = await fetchSerpResults("digital marketing trends");
        const data = extractSerpData(result);
        
        // Calculate some basic stats
        if (data.relatedKeywords && data.relatedKeywords.length > 0) {
          const totalKeywords = data.relatedKeywords.length;
          const avgDifficulty = Math.round(
            data.relatedKeywords.reduce((sum, kw) => sum + kw.difficulty, 0) / totalKeywords
          );
          const avgVolume = Math.round(
            data.relatedKeywords.reduce((sum, kw) => sum + kw.searchVolume, 0) / totalKeywords
          );
          
          setStats({
            totalKeywords,
            avgDifficulty,
            avgVolume
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
      description: "Connect your Shopify store to optimize product listings and enhance SEO performance.",
      icon: ShoppingBag,
      url: "/dashboard/shopify",
      status: "available"
    },
    {
      id: "wordpress",
      name: "WordPress",
      description: "Integrate with WordPress sites to analyze and optimize content for better search visibility.",
      icon: Package,
      url: "#",
      status: "coming-soon"
    },
    {
      id: "ai-agent",
      name: "AI Content Agent",
      description: "Let AI automatically generate and optimize content based on keyword research.",
      icon: Brain,
      url: "#",
      status: "coming-soon"
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
              Connect your website platforms and e-commerce stores for automated SEO optimization
            </p>
          </div>
        </div>
        
        {/* Stats Cards */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="hover-card transition-all duration-200 border-muted/40">
              <CardHeader className="bg-muted/5">
                <CardTitle className="flex items-center gap-2">
                  <integration.icon className="h-5 w-5 text-primary" />
                  {integration.name}
                </CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
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
      </div>
    </DashboardLayout>
  );
}

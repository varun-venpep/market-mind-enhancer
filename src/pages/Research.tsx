import { useState } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Lightbulb, 
  ArrowRight, 
  BarChart3, 
  BookOpen, 
  TrendingUp, 
  Download,
  HelpCircle,
  Loader,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { 
  KeywordAnalysisResults, 
  RelatedKeywords,
  TopicExplorer,
  SearchInsights,
  KeywordSkeletonLoader
} from "@/components/Research";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchSerpResults, extractSerpData } from "@/services/serpApi";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Research = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [activeTab, setActiveTab] = useState("insights");
  const [serpData, setSerpData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching SERP data for:", searchQuery);
      const data = await fetchSerpResults(searchQuery);
      console.log("SERP data received:", data);
      
      const processedData = extractSerpData(data);
      console.log("Processed SERP data:", processedData);
      
      setSerpData(processedData);
      setHasResults(true);
      
      toast({
        title: "Analysis Complete",
        description: `We've analyzed "${searchQuery}" and found ${processedData.organicResults?.length || 0} results.`,
      });
    } catch (err: any) {
      console.error("Error fetching SERP data:", err);
      setError(err.message || "Failed to analyze keyword. Please try again.");
      
      toast({
        title: "Analysis Failed",
        description: err.message || "There was an error analyzing your keyword.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="p-6 max-w-7xl mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Keyword Research</h1>
            <p className="text-muted-foreground mt-1">
              Discover high-value keywords and topics for your content strategy
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <form onSubmit={handleSearch} className="space-y-4 p-6 border-2 border-brand-100 rounded-lg bg-card">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="keyword-search" className="text-sm font-medium">
                    Enter a keyword or topic
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>Enter a primary keyword to analyze. For best results, use specific phrases that your audience would search for.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="keyword-search"
                    placeholder="e.g., content marketing strategy, seo best practices"
                    className="pl-10 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {hasResults && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center text-green-600"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Analysis complete
                    </motion.span>
                  )}
                  {error && (
                    <span className="flex items-center text-red-500">
                      <AlertCircle className="h-3 w-3 mr-1" /> {error}
                    </span>
                  )}
                  {!hasResults && !error && (
                    <span>Powered by real-time SERP analysis</span>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="submit" 
                    className="gradient-button" 
                    disabled={isLoading || !searchQuery.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>

          {isLoading && (
            <KeywordSkeletonLoader />
          )}

          <AnimatePresence>
            {hasResults && serpData && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full md:w-auto justify-start">
                    <TabsTrigger value="insights">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Search Insights
                    </TabsTrigger>
                    <TabsTrigger value="keywords">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Related Keywords
                    </TabsTrigger>
                    <TabsTrigger value="topics">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Topic Explorer
                    </TabsTrigger>
                    <TabsTrigger value="serps">
                      <BookOpen className="h-4 w-4 mr-2" />
                      SERP Analysis
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="insights" className="mt-6">
                    <SearchInsights keyword={searchQuery} data={serpData} />
                  </TabsContent>
                  
                  <TabsContent value="keywords" className="mt-6">
                    <RelatedKeywords mainKeyword={searchQuery} keywords={serpData.relatedKeywords} />
                  </TabsContent>
                  
                  <TabsContent value="topics" className="mt-6">
                    <TopicExplorer keyword={searchQuery} questions={serpData.relatedQuestions} />
                  </TabsContent>
                  
                  <TabsContent value="serps" className="mt-6">
                    <KeywordAnalysisResults keyword={searchQuery} results={serpData.organicResults} />
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && !hasResults && (
            <motion.div variants={itemVariants}>
              <div className="border-dashed border-2 border-muted p-8 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="bg-brand-50 p-3 rounded-full mb-4">
                  <Search className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Discover insights for your content</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Enter a keyword above to analyze search intent, find related topics, and get content recommendations.
                </p>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl"
                  variants={containerVariants}
                >
                  {[
                    { icon: BarChart3, title: "Keyword Metrics", desc: "Search volume, difficulty, and CPC" },
                    { icon: Lightbulb, title: "Topic Suggestions", desc: "Popular questions and related topics" },
                    { icon: BookOpen, title: "Content Analysis", desc: "SERP insights and content briefs" }
                  ].map((item, i) => (
                    <motion.div key={i} variants={itemVariants}>
                      <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="bg-primary/10 p-2 rounded-full mb-2">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <h4 className="text-sm font-medium">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Research;

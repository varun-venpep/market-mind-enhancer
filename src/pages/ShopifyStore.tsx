import React from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ShopifyProtected } from "@/components/ShopifyProtected";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { bulkOptimizeSEO, fetchShopifyProducts, ShopifyProductsResponse } from '@/services/api';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import type { SEOAnalysisResult, ShopifyProduct, ShopifyStore, SEOIssue, SEOOptimization } from '@/types/shopify';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from '@/components/Shopify/LoadingState';
import { StoreHeader } from '@/components/Shopify/StoreHeader';
import { ProductList } from '@/components/Shopify/ProductList';
import { ArrowLeft, BarChart2, TrendingUp, Share2, FileText, ArrowRight, Loader2, Pencil } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateContent } from '@/services/geminiApi';

const ShopifyStore = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [serpData, setSerpData] = useState<any>(null);
  const [serpLoading, setSerpLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogKeywords, setBlogKeywords] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!storeId) return;
    
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch store details from the shopify_stores table
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .single();
          
        if (storeError) throw storeError;
        
        setStore(storeData as ShopifyStore);
        
        // Fetch products with proper typing
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
        
        // Fetch existing analyses
        const { data: analyses, error: analysesError } = await supabase
          .from('shopify_seo_analyses')
          .select('*')
          .eq('store_id', storeId);
          
        if (!analysesError && analyses) {
          // Create a lookup table by product ID
          const analysisMap = analyses.reduce((acc, analysis) => {
            // Ensure analysis conforms to SEOAnalysisResult type and properly cast the JSON fields
            const typedAnalysis: SEOAnalysisResult = {
              product_id: analysis.product_id, // This will be a string
              title: analysis.title,
              handle: analysis.handle,
              issues: analysis.issues as unknown as SEOIssue[],
              score: analysis.score,
              optimizations: analysis.optimizations as unknown as SEOOptimization[]
            };
            
            acc[analysis.product_id] = typedAnalysis;
            return acc;
          }, {} as Record<string, SEOAnalysisResult>);
          
          setAnalysisResults(analysisMap);
        }
        
        // Fetch SERP data for this store's main product category
        if (storeData && storeData.store_name) {
          const keyword = `${storeData.store_name.toLowerCase()} products`;
          setSerpLoading(true);
          
          try {
            const serpResult = await fetchSerpResults(keyword);
            const extractedData = extractSerpData(serpResult);
            setSerpData(extractedData);
          } catch (error) {
            console.error("Error fetching SERP data:", error);
          } finally {
            setSerpLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
        toast({
          title: "Error",
          description: "Failed to load store data",
          variant: "destructive"
        });
        navigate('/dashboard/shopify');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId, toast, navigate]);
  
  const handleAnalysisComplete = (productId: string, analysis: SEOAnalysisResult) => {
    setAnalysisResults(prev => ({
      ...prev,
      [productId]: analysis
    }));
  };
  
  const handleBulkOptimize = async () => {
    if (!storeId) return;
    
    setIsOptimizing(true);
    
    try {
      const result = await bulkOptimizeSEO(storeId);
      
      toast({
        title: "Bulk Optimization Started",
        description: `SEO optimization for ${result.total} products has been initiated`
      });
      
      // Refresh the data after a delay to allow for processing
      setTimeout(async () => {
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
        
        // Refresh analyses
        const { data: analyses } = await supabase
          .from('shopify_seo_analyses')
          .select('*')
          .eq('store_id', storeId);
          
        if (analyses) {
          const analysisMap = analyses.reduce((acc, analysis) => {
            // Ensure analysis conforms to SEOAnalysisResult type and properly cast the JSON fields
            const typedAnalysis: SEOAnalysisResult = {
              product_id: analysis.product_id, // This will be a string
              title: analysis.title,
              handle: analysis.handle,
              issues: analysis.issues as unknown as SEOIssue[],
              score: analysis.score,
              optimizations: analysis.optimizations as unknown as SEOOptimization[]
            };
            
            acc[analysis.product_id] = typedAnalysis;
            return acc;
          }, {} as Record<string, SEOAnalysisResult>);
          
          setAnalysisResults(analysisMap);
        }
        
        setIsOptimizing(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Bulk Optimization Failed",
        description: "Failed to start bulk SEO optimization",
        variant: "destructive"
      });
      setIsOptimizing(false);
    }
  };

  const handleBlogGenerate = async () => {
    if (!blogTitle) {
      toast({
        title: "Missing Title",
        description: "Please enter a blog post title",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingBlog(true);
    setBlogContent("");

    try {
      const storeContext = store?.store_name || "e-commerce store";
      const prompt = `
        Write an SEO-optimized blog post for a Shopify store called "${storeContext}" with the title: "${blogTitle}".
        ${blogKeywords ? `Focus on these keywords: ${blogKeywords}` : ''}
        The blog post should be informative, engaging, and follow best practices for SEO content.
        Include a compelling introduction, 3-5 main sections with subheadings, and a conclusion.
        Format the content using markdown with proper headings, lists, and emphasis where appropriate.
        The blog post should be around 800-1000 words.
      `;

      const content = await generateContent(prompt);
      setBlogContent(content);

      toast({
        title: "Blog Post Generated",
        description: "Your SEO-optimized blog post has been created"
      });
    } catch (error) {
      console.error("Error generating blog post:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog post content",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingBlog(false);
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }
  
  if (!store) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Store not found</h1>
          <Button onClick={() => navigate('/dashboard/shopify')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Stores
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate overall SEO score
  const allScores = Object.values(analysisResults).map(result => result.score);
  const averageScore = allScores.length > 0 
    ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) 
    : 0;
  
  return (
    <DashboardLayout>
      <ShopifyProtected>
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-2 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard/shopify')} 
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Stores
            </Button>
          </div>
          
          <StoreHeader 
            store={store} 
            onBulkOptimize={handleBulkOptimize} 
            isOptimizing={isOptimizing} 
          />
          
          {/* SERP Insights Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Market Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* SEO Performance Card */}
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-muted/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-indigo-500" />
                    Overall SEO Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-3xl font-bold">{averageScore}/100</div>
                    <span className={`text-sm ${
                      averageScore >= 80 ? 'text-green-600 dark:text-green-400' : 
                      averageScore >= 60 ? 'text-amber-600 dark:text-amber-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {averageScore >= 80 ? 'Good' : averageScore >= 60 ? 'Needs Improvement' : 'Poor'}
                    </span>
                  </div>
                  <Progress 
                    value={averageScore} 
                    className={`h-2 ${
                      averageScore >= 80 ? 'bg-green-100 dark:bg-green-950' : 
                      averageScore >= 60 ? 'bg-amber-100 dark:bg-amber-950' : 
                      'bg-red-100 dark:bg-red-950'
                    }`} 
                  />
                  <p className="text-muted-foreground text-sm mt-2">
                    Based on {allScores.length} product{allScores.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
              
              {/* Keyword Competition Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-muted/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Keyword Competition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {serpLoading ? (
                    <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
                  ) : serpData?.relatedKeywords ? (
                    <div>
                      <div className="text-3xl font-bold">
                        {Math.round(serpData.relatedKeywords.reduce((sum: number, kw: any) => sum + kw.difficulty, 0) / 
                        serpData.relatedKeywords.length)}/100
                      </div>
                      <p className="text-muted-foreground text-sm">Average difficulty for related keywords</p>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No data available</div>
                  )}
                </CardContent>
              </Card>
              
              {/* Organic Search Traffic Potential */}
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-muted/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Search Traffic Potential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {serpLoading ? (
                    <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
                  ) : serpData?.relatedKeywords ? (
                    <div>
                      <div className="text-3xl font-bold">
                        {serpData.relatedKeywords.reduce((sum: number, kw: any) => sum + kw.searchVolume, 0).toLocaleString()}
                      </div>
                      <p className="text-muted-foreground text-sm">Monthly searches for related keywords</p>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Trending Keywords */}
            {!serpLoading && serpData?.relatedKeywords && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Trending Keywords</CardTitle>
                  <CardDescription>Popular keywords related to your store that could drive traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {serpData.relatedKeywords.slice(0, 10).map((keyword: any, index: number) => (
                      <div key={index} className="flex items-center bg-muted/30 rounded-full px-3 py-1 text-sm">
                        <span>{keyword.keyword}</span>
                        <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                          {keyword.searchVolume.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="products" className="flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Blog Content</span>
              </TabsTrigger>
              <TabsTrigger value="site-audit" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>Site Audit</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <ProductList 
                products={products}
                storeId={storeId}
                analysisResults={analysisResults}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </TabsContent>
            
            <TabsContent value="blog">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Blog Post Generator
                    </CardTitle>
                    <CardDescription>
                      Create SEO-optimized blog content for your Shopify store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="blog-title">Blog Post Title</Label>
                      <Input
                        id="blog-title"
                        placeholder="e.g., 5 Ways to Improve Your Online Store"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="blog-keywords">Target Keywords (optional)</Label>
                      <Input
                        id="blog-keywords"
                        placeholder="e.g., e-commerce tips, shopify store"
                        value={blogKeywords}
                        onChange={(e) => setBlogKeywords(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate keywords with commas
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2"
                      onClick={handleBlogGenerate}
                      disabled={isGeneratingBlog}
                    >
                      {isGeneratingBlog ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Blog Post
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Generated Blog Content</CardTitle>
                    <CardDescription>
                      Your AI-generated blog post will appear here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isGeneratingBlog ? (
                      <div className="flex flex-col items-center justify-center h-[500px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <p className="text-muted-foreground">Creating your SEO-optimized blog post...</p>
                      </div>
                    ) : blogContent ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none h-[500px] overflow-y-auto border rounded-md p-4">
                        <div dangerouslySetInnerHTML={{ __html: blogContent.replace(/\n/g, '<br/>') }} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md">
                        <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
                        <p className="text-muted-foreground">Your blog post will appear here</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter a title and click Generate to create content
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {blogContent && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            navigator.clipboard.writeText(blogContent);
                            toast({
                              title: "Content Copied",
                              description: "Blog post copied to clipboard"
                            });
                          }}
                        >
                          Copy Content
                        </Button>
                        <Button disabled>
                          Publish to Store
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="site-audit">
              <Card>
                <CardHeader>
                  <CardTitle>Site Audit</CardTitle>
                  <CardDescription>
                    Comprehensive SEO audit for your Shopify store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <Globe className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-2">Site Audit Coming Soon</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      Our comprehensive site audit feature is currently in development. 
                      It will analyze your entire Shopify store for technical SEO issues, 
                      content optimization opportunities, and more.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button disabled>
                    Start Audit
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ShopifyProtected>
    </DashboardLayout>
  );
};

// Helper components for icons
function ShoppingBag(props) {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <path d="M3 6h18"></path>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}

function Globe(props) {
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
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" x2="22" y1="12" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}

export default ShopifyStore;


import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { bulkOptimizeSEO, fetchShopifyProducts, ShopifyProductsResponse } from '@/services/api';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import type { SEOAnalysisResult, ShopifyProduct, ShopifyStore, SEOIssue, SEOOptimization } from '@/types/shopify';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from '@/components/Shopify/LoadingState';
import { StoreHeader } from '@/components/Shopify/StoreHeader';
import { ProductList } from '@/components/Shopify/ProductList';
import { ArrowLeft, BarChart2, TrendingUp, Share2 } from 'lucide-react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { Progress } from '@/components/ui/progress';

export default function ShopifyStore() {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [serpData, setSerpData] = useState<any>(null);
  const [serpLoading, setSerpLoading] = useState(true);
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
        
        <ProductList 
          products={products}
          storeId={storeId}
          analysisResults={analysisResults}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    </DashboardLayout>
  );
}

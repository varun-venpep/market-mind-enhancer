
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, ShoppingBag, Zap } from "lucide-react";
import { analyzeSEO, optimizeSEO } from '@/services/api';
import type { SEOAnalysisResult, ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  storeId: string;
  initialAnalysis?: SEOAnalysisResult | null;
  onAnalysisComplete?: (productId: string, analysis: SEOAnalysisResult) => void;
}

export function ProductCard({ product, storeId, initialAnalysis = null, onAnalysisComplete }: ProductCardProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(initialAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  const handleAnalyzeSEO = async () => {
    const productId = String(product.id);
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeSEO(storeId, productId);
      setAnalysis(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(productId, result);
      }
      
      toast({
        title: "Analysis Complete",
        description: "SEO analysis has been completed for this product"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze product SEO",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleOptimizeSEO = async () => {
    if (!analysis) return;
    
    const productId = String(product.id);
    
    try {
      setIsAnalyzing(true);
      await optimizeSEO(storeId, productId, analysis.optimizations);
      
      toast({
        title: "Optimization Complete",
        description: "SEO optimizations have been applied to this product"
      });
      
      // Refresh analysis
      await handleAnalyzeSEO();
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to apply SEO optimizations",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="overflow-hidden hover-card transition-all duration-200 border-muted/40">
      <CardHeader className="bg-muted/5 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              {product.title}
            </CardTitle>
            <CardDescription>
              Product ID: {product.id}
            </CardDescription>
          </div>
          {analysis ? (
            <div className="flex items-center gap-2">
              <div 
                className={`px-3 py-1 rounded-full text-sm ${
                  analysis.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                SEO Score: {analysis.score}%
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {product.images && product.images.length > 0 && (
            <div className="w-full md:w-32 h-32 bg-muted/20 rounded overflow-hidden flex-shrink-0">
              <img 
                src={product.images[0].src} 
                alt={product.images[0].alt || product.title} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex-grow">
            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Type:</span> {product.product_type || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Vendor:</span> {product.vendor || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Tags:</span> {product.tags || 'N/A'}
              </p>
            </div>
            
            {analysis ? (
              <div className="mt-4">
                <h3 className="font-medium mb-2">SEO Issues:</h3>
                <ul className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span 
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          issue.severity === 'high' ? 'bg-red-500' :
                          issue.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}
                      ></span>
                      {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-muted/5 border-t">
        {!analysis ? (
          <Button 
            onClick={handleAnalyzeSEO} 
            disabled={isAnalyzing}
            variant="outline"
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze SEO'}
          </Button>
        ) : (
          <Button
            onClick={handleOptimizeSEO}
            disabled={isAnalyzing || analysis.optimizations.length === 0}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            {isAnalyzing ? 'Optimizing...' : 'Apply Optimizations'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

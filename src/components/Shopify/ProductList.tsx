
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SEOAnalysisResult, ShopifyProduct } from '@/types/shopify';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: ShopifyProduct[];
  storeId: string;
  analysisResults: Record<string, SEOAnalysisResult>;
  onAnalysisComplete: (productId: string, analysis: SEOAnalysisResult) => void;
}

export function ProductList({ products, storeId, analysisResults, onAnalysisComplete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <Card className="hover-card shadow-md">
        <CardHeader>
          <CardTitle>No Products Found</CardTitle>
          <CardDescription>
            This store doesn't have any products yet. Add products to your Shopify store to start optimizing their SEO.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6">
      {products.map(product => {
        const productId = String(product.id); // Always convert to string for consistency
        const analysis = analysisResults[productId] || null;
        
        return (
          <ProductCard
            key={product.id}
            product={product}
            storeId={storeId}
            initialAnalysis={analysis}
            onAnalysisComplete={onAnalysisComplete}
          />
        );
      })}
    </div>
  );
}

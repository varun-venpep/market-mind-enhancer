
import SiteAuditReport from '@/components/Shopify/SiteAuditReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, ShoppingBag, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductList } from '@/components/Shopify/ProductList'; // Changed to named import
import BlogGenerator from '@/components/Shopify/BlogGenerator';

interface StoreTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRunningAudit: boolean;
  siteAudit: any;
  handleRunSiteAudit: () => void;
  storeId: string;
  products: any[];
  analysisResults: Record<string, any>;
  onAnalysisComplete: (productId: string, analysis: any) => void;
  optimizationHistory: any[];
  isLoading: boolean;
  blogTitle: string;
  setBlogTitle: (v: string) => void;
  blogKeywords: string;
  setBlogKeywords: (v: string) => void;
  blogContent: string;
  setBlogContent: (v: string) => void;
  isGeneratingBlog: boolean;
  handleBlogGenerate: () => void;
  toast: any;
}

export default function StoreTabs({
  activeTab, setActiveTab,
  isRunningAudit, siteAudit, handleRunSiteAudit, storeId,
  products, analysisResults, onAnalysisComplete,
  optimizationHistory, isLoading,
  blogTitle, setBlogTitle, blogKeywords, setBlogKeywords,
  blogContent, setBlogContent, isGeneratingBlog, handleBlogGenerate, toast
}: StoreTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="mb-6">
        <TabsTrigger value="site-audit" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span>Site Audit</span>
        </TabsTrigger>
        <TabsTrigger value="products" className="flex items-center gap-1">
          <ShoppingBag className="h-4 w-4" />
          <span>Products</span>
        </TabsTrigger>
        <TabsTrigger value="blog" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span>Blog Content</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="site-audit">
        {isRunningAudit ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                Analyzing Your Store
              </CardTitle>
              <CardDescription>
                Running a comprehensive SEO audit of your entire Shopify store...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                This may take a few minutes to complete. We're analyzing all aspects of your store 
                including product pages, collections, blogs, and more.
              </p>
              <div className="w-full max-w-md h-2 bg-gray-100 dark:bg-gray-900 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ) : (
          <>
            {!siteAudit && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    No Site Audit Yet
                  </CardTitle>
                  <CardDescription>
                    Run a comprehensive SEO audit to get insights and recommendations for your entire store
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Globe className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">Analyze Your Entire Store</h3>
                  <p className="text-center text-muted-foreground max-w-md mb-6">
                    Our comprehensive site audit will analyze your entire Shopify store for technical SEO issues, 
                    content optimization opportunities, and structural improvements.
                  </p>
                  <Button onClick={handleRunSiteAudit} className="gap-2">
                    <Globe className="h-4 w-4" />
                    Run Site Audit
                  </Button>
                </CardContent>
              </Card>
            )}
            <SiteAuditReport 
              audit={siteAudit}
              storeId={storeId}
              onRefresh={handleRunSiteAudit}
              optimizationHistory={optimizationHistory}
              isLoading={isRunningAudit}
            />
          </>
        )}
      </TabsContent>
      <TabsContent value="products">
        <ProductList 
          products={products}
          storeId={storeId}
          analysisResults={analysisResults}
          onAnalysisComplete={onAnalysisComplete}
        />
      </TabsContent>
      <TabsContent value="blog">
        <BlogGenerator
          blogTitle={blogTitle}
          setBlogTitle={setBlogTitle}
          blogKeywords={blogKeywords}
          setBlogKeywords={setBlogKeywords}
          blogContent={blogContent}
          setBlogContent={setBlogContent}
          isGeneratingBlog={isGeneratingBlog}
          handleBlogGenerate={handleBlogGenerate}
          toast={toast}
        />
      </TabsContent>
    </Tabs>
  );
}

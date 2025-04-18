
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  RotateCcw
} from "lucide-react";
import type { WebsiteSEOAudit, WebsiteSEOIssue, WebsiteSEOOptimization, ShopifyOptimizationHistory } from '@/types/shopify';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applyOptimization, revertOptimization } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2 } from 'lucide-react';

interface SiteAuditReportProps {
  audit: WebsiteSEOAudit | null;
  storeId: string;
  onRefresh: () => void;
  optimizationHistory: ShopifyOptimizationHistory[];
  isLoading: boolean;
}

export default function SiteAuditReport({ 
  audit, 
  storeId, 
  onRefresh, 
  optimizationHistory, 
  isLoading 
}: SiteAuditReportProps) {
  const [activeTab, setActiveTab] = useState("issues");
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});
  const [expandedOptimizations, setExpandedOptimizations] = useState<Record<string, boolean>>({});
  const [processingOptimizations, setProcessingOptimizations] = useState<string[]>([]);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
            Analyzing Store
          </CardTitle>
          <CardDescription>
            Performing a comprehensive SEO audit of your Shopify store...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-center text-muted-foreground mb-2">
            This may take a few minutes to analyze all aspects of your store
          </p>
          <Progress value={65} className="w-full max-w-md h-2" />
        </CardContent>
      </Card>
    );
  }

  if (!audit) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            No Audit Available
          </CardTitle>
          <CardDescription>
            No SEO audit has been performed for this store yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <p className="text-center text-muted-foreground">
            Run a site audit to get comprehensive SEO recommendations for your store.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Run Site Audit
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const toggleIssue = (issueId: string) => {
    setExpandedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  const toggleOptimization = (optimizationId: string) => {
    setExpandedOptimizations(prev => ({
      ...prev,
      [optimizationId]: !prev[optimizationId]
    }));
  };

  const getIssueSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getIssueTypeColor = (type: string) => {
    switch (type) {
      case 'meta':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'structure':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'content':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400';
      case 'performance':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'mobile':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
      case 'security':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleApplyOptimization = async (optimization: WebsiteSEOOptimization) => {
    try {
      setProcessingOptimizations(prev => [...prev, optimization.id]);
      
      await applyOptimization(storeId, optimization);
      
      toast({
        title: "Optimization Applied",
        description: "The SEO optimization has been successfully applied to your store.",
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error applying optimization:', error);
      toast({
        title: "Error",
        description: "Failed to apply the optimization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingOptimizations(prev => prev.filter(id => id !== optimization.id));
    }
  };

  const handleRevertOptimization = async (optimizationId: string) => {
    try {
      setProcessingOptimizations(prev => [...prev, optimizationId]);
      
      await revertOptimization(optimizationId);
      
      toast({
        title: "Optimization Reverted",
        description: "The SEO optimization has been successfully reverted.",
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error reverting optimization:', error);
      toast({
        title: "Error",
        description: "Failed to revert the optimization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingOptimizations(prev => prev.filter(id => id !== optimizationId));
    }
  };

  const criticalIssues = audit.issues.filter(issue => issue.severity === 'critical');
  const highIssues = audit.issues.filter(issue => issue.severity === 'high');
  const mediumIssues = audit.issues.filter(issue => issue.severity === 'medium');
  const lowIssues = audit.issues.filter(issue => issue.severity === 'low');
  
  const pendingOptimizations = audit.optimizations.filter(opt => !opt.applied);
  const appliedOptimizations = optimizationHistory && optimizationHistory.length > 0 
    ? optimizationHistory.filter(opt => !opt.reverted)
    : [];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Site SEO Audit Results
            </CardTitle>
            <CardDescription>
              Last analyzed on {new Date(audit.created_at).toLocaleDateString()} at {new Date(audit.created_at).toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              audit.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              audit.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              SEO Score: {audit.score}%
            </div>
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              size="icon" 
              title="Refresh Audit"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="grid grid-cols-5 gap-4 w-full">
            <div className="text-center p-3 bg-muted/20 rounded">
              <div className="text-2xl font-bold">{audit.issues.length}</div>
              <div className="text-xs text-muted-foreground">Issues Found</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/10 rounded">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalIssues.length}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{highIssues.length}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{mediumIssues.length}</div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{lowIssues.length}</div>
              <div className="text-xs text-muted-foreground">Low</div>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="issues">Issues ({audit.issues.length})</TabsTrigger>
            <TabsTrigger value="optimizations">Recommended Fixes ({pendingOptimizations.length})</TabsTrigger>
            <TabsTrigger value="applied">Applied Optimizations ({appliedOptimizations.length})</TabsTrigger>
            <TabsTrigger value="stats">Site Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues">
            {audit.issues.length === 0 ? (
              <div className="text-center py-6">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No issues found! Your store has excellent SEO.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {audit.issues.map((issue: WebsiteSEOIssue) => (
                  <Collapsible 
                    key={issue.id} 
                    open={expandedIssues[issue.id]} 
                    onOpenChange={() => toggleIssue(issue.id)}
                    className="border rounded-md"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="p-3 flex justify-between items-center cursor-pointer hover:bg-muted/30">
                        <div className="flex items-start gap-3">
                          {issue.severity === 'critical' && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                          {issue.severity === 'high' && <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />}
                          {issue.severity === 'medium' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                          {issue.severity === 'low' && <Info className="h-5 w-5 text-blue-500 mt-0.5" />}
                          
                          <div>
                            <div className="font-medium">{issue.message}</div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className={getIssueSeverityColor(issue.severity)}>
                                {issue.severity}
                              </Badge>
                              <Badge variant="outline" className={getIssueTypeColor(issue.type)}>
                                {issue.type}
                              </Badge>
                              {issue.affected_urls && issue.affected_urls.length > 0 && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                                  {issue.affected_urls.length} pages affected
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          {expandedIssues[issue.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 border-t">
                      <p className="text-muted-foreground mb-3">{issue.details}</p>
                      
                      {issue.affected_urls && issue.affected_urls.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Affected Pages:</h4>
                          <div className="bg-muted/20 p-2 rounded text-xs max-h-32 overflow-y-auto">
                            <ul className="space-y-1">
                              {issue.affected_urls.map((url, index) => (
                                <li key={index}>
                                  <a 
                                    href={url.startsWith('http') ? url : `https://${url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {url}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {/* Find related optimizations */}
                      {pendingOptimizations.filter(opt => opt.type === issue.type && opt.affected_urls?.some(url => 
                        issue.affected_urls?.includes(url)
                      )).length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Related Optimizations:</h4>
                          <div className="space-y-2">
                            {pendingOptimizations
                              .filter(opt => opt.type === issue.type && opt.affected_urls?.some(url => 
                                issue.affected_urls?.includes(url)
                              ))
                              .map(opt => (
                                <div key={opt.id} className="flex justify-between items-center border p-2 rounded">
                                  <div>
                                    <div className="text-sm font-medium">{opt.field} optimization</div>
                                    <div className="text-xs text-muted-foreground">Impact: {opt.impact_score}/20</div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleApplyOptimization(opt)}
                                    disabled={processingOptimizations.includes(opt.id)}
                                  >
                                    {processingOptimizations.includes(opt.id) ? (
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4 mr-1" />
                                    )}
                                    Apply Fix
                                  </Button>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="optimizations">
            {pendingOptimizations.length === 0 ? (
              <div className="text-center py-6">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-muted-foreground">All optimizations have been applied!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOptimizations.map((optimization: WebsiteSEOOptimization) => (
                  <Collapsible 
                    key={optimization.id} 
                    open={expandedOptimizations[optimization.id]} 
                    onOpenChange={() => toggleOptimization(optimization.id)}
                    className="border rounded-md"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="p-3 flex justify-between items-center cursor-pointer hover:bg-muted/30">
                        <div className="flex items-start gap-3">
                          <div>
                            <div className="font-medium">
                              {optimization.entity} {optimization.field} optimization
                            </div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className={getIssueTypeColor(optimization.type)}>
                                {optimization.type}
                              </Badge>
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                +{optimization.impact_score} points
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          {expandedOptimizations[optimization.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 border-t">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Current Value:</h4>
                          <div className="bg-muted/20 p-2 rounded text-sm overflow-hidden">
                            {optimization.original || <span className="text-muted-foreground italic">Empty</span>}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Suggested Value:</h4>
                          <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded text-sm overflow-hidden">
                            {optimization.suggestion}
                          </div>
                        </div>
                      </div>
                      
                      {optimization.affected_urls && optimization.affected_urls.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Affected Pages:</h4>
                          <div className="bg-muted/20 p-2 rounded text-xs max-h-24 overflow-y-auto">
                            <ul className="space-y-1">
                              {optimization.affected_urls.map((url, index) => (
                                <li key={index}>
                                  <a 
                                    href={url.startsWith('http') ? url : `https://${url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {url}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => handleApplyOptimization(optimization)}
                          disabled={processingOptimizations.includes(optimization.id)}
                        >
                          {processingOptimizations.includes(optimization.id) ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Apply Optimization
                            </>
                          )}
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applied">
            {appliedOptimizations.length === 0 ? (
              <div className="text-center py-6">
                <Info className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No optimizations have been applied yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appliedOptimizations.map((optimization) => (
                  <div key={optimization.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {optimization.entity_type} {optimization.field} optimization
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Applied on {new Date(optimization.applied_at).toLocaleDateString()} at {new Date(optimization.applied_at).toLocaleTimeString()}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRevertOptimization(optimization.id)}
                        disabled={processingOptimizations.includes(optimization.id)}
                        className="gap-1"
                      >
                        {processingOptimizations.includes(optimization.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )}
                        Revert
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-xs font-medium mb-1">Original Value:</h4>
                        <div className="bg-muted/20 p-2 rounded text-sm text-muted-foreground">
                          {optimization.original_value || <span className="italic">Empty</span>}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium mb-1">New Value:</h4>
                        <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded text-sm">
                          {optimization.new_value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pages Analyzed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Product Pages</span>
                        <span className="text-sm font-medium">{audit.meta.product_pages}</span>
                      </div>
                      <Progress value={(audit.meta.product_pages / audit.meta.pages_analyzed) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Collection Pages</span>
                        <span className="text-sm font-medium">{audit.meta.collection_pages}</span>
                      </div>
                      <Progress value={(audit.meta.collection_pages / audit.meta.pages_analyzed) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Blog Pages</span>
                        <span className="text-sm font-medium">{audit.meta.blog_pages}</span>
                      </div>
                      <Progress value={(audit.meta.blog_pages / audit.meta.pages_analyzed) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Other Pages</span>
                        <span className="text-sm font-medium">{audit.meta.other_pages}</span>
                      </div>
                      <Progress value={(audit.meta.other_pages / audit.meta.pages_analyzed) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">SEO Issues by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['meta', 'structure', 'content', 'performance', 'mobile', 'security'].map(type => {
                      const typeIssues = audit.issues.filter(issue => issue.type === type);
                      const percentage = (typeIssues.length / audit.issues.length) * 100 || 0;
                      
                      return (
                        <div key={type}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm capitalize">{type}</span>
                            <span className="text-sm font-medium">{typeIssues.length}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-muted/10 border-t pt-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          <strong className="font-medium">Tip:</strong> Fix critical and high-priority issues first to see the biggest SEO improvements.
        </div>
        <Button onClick={onRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Audit
        </Button>
      </CardFooter>
    </Card>
  );
}

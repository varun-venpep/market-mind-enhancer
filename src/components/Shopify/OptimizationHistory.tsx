import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RotateCcw, ChevronUp, ChevronDown, Clock, FileText, ShoppingBag, Globe, Layout, AlertTriangle } from 'lucide-react';
import { ShopifyOptimizationHistory } from '@/types/shopify';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { revertOptimization } from '@/services/shopify';

interface OptimizationHistoryProps {
  history: ShopifyOptimizationHistory[];
  onRefresh: () => void;
}

export default function OptimizationHistory({ history, onRefresh }: OptimizationHistoryProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const { toast } = useToast();
  
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Optimization History</CardTitle>
          <CardDescription>No optimization history found</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-2" />
            <p className="text-muted-foreground">
              No optimizations have been applied yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleRevert = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    
    try {
      await revertOptimization(id);
      
      toast({
        title: "Optimization Reverted",
        description: "The change has been successfully reverted."
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error reverting optimization:", error);
      toast({
        title: "Error",
        description: "Failed to revert the optimization",
        variant: "destructive"
      });
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };
  
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <ShoppingBag className="h-4 w-4" />;
      case 'page':
        return <FileText className="h-4 w-4" />;
      case 'blog':
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'theme':
        return <Layout className="h-4 w-4" />;
      case 'global':
      default:
        return <Globe className="h-4 w-4" />;
    }
  };
  
  const groupedHistory: Record<string, ShopifyOptimizationHistory[]> = {};
  
  history.forEach(item => {
    if (item.reverted) return; // Skip reverted items
    
    const date = new Date(item.applied_at).toLocaleDateString();
    if (!groupedHistory[date]) {
      groupedHistory[date] = [];
    }
    groupedHistory[date].push(item);
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization History</CardTitle>
        <CardDescription>
          Recent SEO improvements applied to your store
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedHistory).length === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-2" />
            <p className="text-muted-foreground">
              No active optimizations found (all changes have been reverted)
            </p>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="space-y-2">
              <div className="font-medium text-sm flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{date}</span>
              </div>
              
              {items.map(item => (
                <Collapsible 
                  key={item.id}
                  open={expandedItems[item.id]}
                  onOpenChange={() => toggleItem(item.id)}
                  className="border rounded-md"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/30">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(item.entity_type)}
                        <div>
                          <div className="font-medium text-sm">
                            {item.field} optimization
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.applied_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {item.entity_type}
                        </Badge>
                        {expandedItems[item.id] ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-3 border-t">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="text-xs font-medium mb-1">Original Value:</h4>
                        <div className="bg-muted/20 p-2 rounded text-sm max-h-24 overflow-y-auto">
                          {item.original_value || <span className="text-muted-foreground italic">Empty</span>}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium mb-1">Updated Value:</h4>
                        <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded text-sm max-h-24 overflow-y-auto">
                          {item.new_value}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRevert(item.id)}
                        disabled={processingIds.includes(item.id)}
                        className="gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Revert Change
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

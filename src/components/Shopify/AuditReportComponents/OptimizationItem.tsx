
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Zap, CheckCircle } from 'lucide-react';

interface OptimizationProps {
  optimization: any;
  onApply: (optimization: any) => void;
  isApplied: boolean;
}

export function OptimizationItem({ optimization, onApply, isApplied }: OptimizationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const getEntityTypeLabel = (location: string) => {
    switch (location) {
      case 'store': return 'Store';
      case 'page': return 'Page';
      case 'blog': return 'Blog';
      case 'product': return 'Product';
      default: return location;
    }
  };
  
  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'title': return 'Title';
      case 'meta_description': return 'Meta Description';
      case 'body_html': return 'Content';
      case 'handle': return 'URL';
      case 'name': return 'Name';
      case 'robots_txt': return 'Robots.txt';
      case 'sitemap': return 'Sitemap';
      default: return field;
    }
  };
  
  return (
    <div className="border rounded-md hover:shadow-sm transition-shadow p-4 mb-3 bg-card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={optimization.type === 'title' ? 'default' : 
                          optimization.type === 'description' ? 'secondary' : 
                          optimization.type === 'technical' ? 'destructive' : 
                          'outline'}>
              {getFieldLabel(optimization.field)}
            </Badge>
            <Badge variant="outline">{getEntityTypeLabel(optimization.location)}</Badge>
          </div>
          <div className="text-sm font-medium mb-1">
            {optimization.entity_name || `${getEntityTypeLabel(optimization.location)} - ${getFieldLabel(optimization.field)}`}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {optimization.original ? 
              optimization.original.length > 100 ? `${optimization.original.substring(0, 100)}...` : optimization.original : 
              'No content'}
          </p>
        </div>
        {isApplied ? (
          <div className="flex items-center text-green-600 dark:text-green-500 text-sm font-medium">
            <CheckCircle className="h-4 w-4 mr-1" />
            Applied
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="flex gap-1 items-center"
            onClick={() => setIsDialogOpen(true)}
          >
            <Zap className="h-3.5 w-3.5" />
            View
          </Button>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply SEO Optimization</DialogTitle>
            <DialogDescription>
              Review and approve this suggested SEO change
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Location</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{getEntityTypeLabel(optimization.location)}</Badge>
                {optimization.entity_name && (
                  <Badge variant="secondary">{optimization.entity_name}</Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Current {getFieldLabel(optimization.field)}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="border rounded-md p-3 bg-muted/50 min-h-[100px] max-h-[200px] overflow-y-auto">
                    {optimization.original || <span className="text-muted-foreground italic">No content</span>}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="pb-2 bg-green-50/50 dark:bg-green-900/20">
                  <CardTitle className="text-base text-green-700 dark:text-green-300">
                    Suggested {getFieldLabel(optimization.field)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="border border-green-200 dark:border-green-800 rounded-md p-3 bg-green-50/30 dark:bg-green-900/10 min-h-[100px] max-h-[200px] overflow-y-auto">
                    {optimization.suggestion || <span className="text-muted-foreground italic">No suggestion</span>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Alert className="alert-info">
            <Info className="h-4 w-4" />
            <AlertTitle>SEO Impact</AlertTitle>
            <AlertDescription className="text-sm">
              Applying this change can improve your store's search engine visibility and ranking.
            </AlertDescription>
          </Alert>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onApply(optimization);
                setIsDialogOpen(false);
              }}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              Apply Optimization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

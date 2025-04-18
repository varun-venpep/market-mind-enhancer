
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ArticlePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  imageUrl?: string;
  isSaving: boolean;
  onSave: () => Promise<void>;
}

const ArticlePreviewDialog = ({
  isOpen,
  onOpenChange,
  title,
  content,
  imageUrl,
  isSaving,
  onSave
}: ArticlePreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">{title || "Generated Article"}</DialogTitle>
            <DialogDescription>
              Review your AI-generated article before saving
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4">
          {imageUrl && (
            <div className="mb-6">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full max-h-[300px] object-cover rounded-lg border"
              />
            </div>
          )}
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
        
        <DialogFooter className="mt-6 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => {
              navigator.clipboard.writeText(content);
              toast.success('Content copied to clipboard');
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Copy Content
          </Button>
          
          <Button 
            onClick={onSave}
            disabled={isSaving}
            className="gradient-button"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticlePreviewDialog;

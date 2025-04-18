
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/Articles/RichTextEditor";

interface ArticlePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  imageUrl?: string;
  isSaving: boolean;
  onSave: () => Promise<void>;
  onContentChange?: (content: string) => void;
}

const ArticlePreviewDialog = ({
  isOpen,
  onOpenChange,
  title,
  content,
  imageUrl,
  isSaving,
  onSave,
  onContentChange
}: ArticlePreviewDialogProps) => {
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  
  const handleClose = () => {
    if (content.trim()) {
      setShowDiscardDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleDiscard = () => {
    setShowDiscardDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{title || "Generated Article"}</DialogTitle>
              <DialogDescription>
                Review and edit your AI-generated article before saving
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mt-4 mb-6 px-1">
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
              {onContentChange ? (
                <div className="editor-container">
                  <RichTextEditor 
                    content={content} 
                    onChange={onContentChange}
                    readOnly={false}
                  />
                </div>
              ) : (
                <div 
                  className="article-content" 
                  dangerouslySetInnerHTML={{ 
                    __html: content 
                  }} 
                />
              )}
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

      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDiscardDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscard}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ArticlePreviewDialog;

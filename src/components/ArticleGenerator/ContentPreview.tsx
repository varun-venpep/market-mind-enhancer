
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/Articles/RichTextEditor";

interface ContentPreviewProps {
  isGenerating: boolean;
  generatedContent: string;
  onContentChange: (content: string) => void;
  onSaveArticle?: () => void;
  isSaving?: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ 
  isGenerating, 
  generatedContent,
  onContentChange,
  onSaveArticle,
  isSaving = false
}) => {
  return (
    <>
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Generating high-quality content with AI...</p>
        </div>
      ) : (
        <div className="min-h-[500px]">
          {generatedContent ? (
            <RichTextEditor 
              content={generatedContent}
              onChange={onContentChange}
              readOnly={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md">
              <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">Your content will appear here</p>
              <p className="text-xs text-muted-foreground mt-1">Fill in the settings and click Generate</p>
            </div>
          )}
        </div>
      )}

      {generatedContent && (
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              navigator.clipboard.writeText(generatedContent);
              toast.success('Content copied to clipboard');
            }}
          >
            Copy Content
          </Button>
          <Button 
            onClick={onSaveArticle}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                Save as Draft
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default ContentPreview;

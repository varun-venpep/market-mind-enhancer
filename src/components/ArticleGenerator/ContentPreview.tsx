
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/Articles/RichTextEditor";

interface ContentPreviewProps {
  isGenerating: boolean;
  generatedContent: string;
  generatedImageUrl?: string; // Added this prop to match what's passed in ArticleGenerator.tsx
  onContentChange?: (content: string) => void;
  onSaveArticle?: () => void;
  handleSaveArticle?: () => void; // Added this prop to match what's passed in ArticleGenerator.tsx
  isSaving?: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ 
  isGenerating, 
  generatedContent,
  generatedImageUrl,
  onContentChange,
  onSaveArticle,
  handleSaveArticle,
  isSaving = false
}) => {
  // Use the appropriate save handler function
  const saveHandler = onSaveArticle || handleSaveArticle;
  
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
            onContentChange ? (
              <RichTextEditor 
                content={generatedContent}
                onChange={onContentChange}
                readOnly={false}
              />
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none flex-grow overflow-y-auto border rounded-md p-4">
                <div dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br/>') }} />
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md">
              <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">Your content will appear here</p>
              <p className="text-xs text-muted-foreground mt-1">Fill in the settings and click Generate</p>
            </div>
          )}
          
          {generatedImageUrl && (
            <div className="mt-4 border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Generated Featured Image:</h3>
              <div className="flex justify-center">
                <img 
                  src={generatedImageUrl} 
                  alt="AI Generated" 
                  className="max-h-48 object-contain"
                />
              </div>
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
          {saveHandler && (
            <Button 
              onClick={saveHandler}
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
          )}
        </div>
      )}
    </>
  );
};

export default ContentPreview;

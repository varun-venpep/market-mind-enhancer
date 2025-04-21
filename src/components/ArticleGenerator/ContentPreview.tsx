
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import RichTextEditor from "@/components/Articles/RichTextEditor";
import { toast } from "sonner";

interface ContentPreviewProps {
  isGenerating: boolean;
  generatedContent: string;
  generatedImageUrl?: string;
  onContentChange: (content: string) => void;
  handleSaveArticle: () => void;
  isSaving: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  isGenerating,
  generatedContent,
  generatedImageUrl,
  onContentChange,
  handleSaveArticle,
  isSaving,
}) => {
  return (
    <div className="bg-background border rounded-xl shadow p-4 flex flex-col h-full min-h-[540px]">
      <h2 className="font-semibold text-lg mb-2">Article Preview & Edit</h2>
      {isGenerating ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <div className="text-muted-foreground">Generating high-quality content...</div>
        </div>
      ) : generatedContent ? (
        <>
          <div className="flex-1">
            <RichTextEditor
              content={generatedContent}
              onChange={onContentChange}
              readOnly={false}
            />
          </div>
          {generatedImageUrl && (
            <div className="mt-4 mb-2 border rounded-md p-2">
              <div className="text-xs font-medium mb-1">Generated Featured Image:</div>
              <div className="flex justify-center">
                <img
                  src={generatedImageUrl}
                  alt="Generated for article"
                  className="max-h-40 object-contain rounded"
                />
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generatedContent);
                toast.success("Content copied to clipboard");
              }}
            >
              Copy Content
            </Button>
            <Button
              onClick={handleSaveArticle}
              className="ml-auto"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save as Draft"}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-80">
          <div className="border-dashed border rounded-lg px-8 py-12 text-center">
            <div className="mb-2">Your generated content will show here for review and editing.</div>
            <div className="text-xs">Fill in settings and generate content to begin.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPreview;


import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface ArticleHeaderProps {
  onBack: () => void;
  onSave: () => void;
  onToggleAutoSave: (enabled: boolean) => void;
  isSaving: boolean;
  isDirty: boolean;
  autoSaveEnabled: boolean;
}

const ArticleHeader = ({
  onBack,
  onSave,
  onToggleAutoSave,
  isSaving,
  isDirty,
  autoSaveEnabled
}: ArticleHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onToggleAutoSave(!autoSaveEnabled)}
        >
          {autoSaveEnabled ? 'Disable Auto-Save' : 'Enable Auto-Save'}
        </Button>
        <Button
          variant="default"
          onClick={onSave}
          disabled={isSaving || !isDirty}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Article'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ArticleHeader;

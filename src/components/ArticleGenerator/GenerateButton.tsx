
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onGenerate,
  isGenerating
}) => {
  return (
    <Button 
      className="w-full gap-2" 
      onClick={onGenerate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Content
        </>
      )}
    </Button>
  );
};

export default GenerateButton;

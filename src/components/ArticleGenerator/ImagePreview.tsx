
import React from 'react';
import { Loader2 } from "lucide-react";

interface ImagePreviewProps {
  isGeneratingImage: boolean;
  generatedImageUrl: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  isGeneratingImage, 
  generatedImageUrl 
}) => {
  if (!isGeneratingImage && !generatedImageUrl) {
    return null;
  }

  return (
    <>
      {isGeneratingImage && (
        <div className="flex items-center justify-center p-4 bg-muted rounded-md mb-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Generating featured image with Gemini AI...</span>
        </div>
      )}
      {generatedImageUrl && (
        <div className="mb-4 p-4 border rounded-md">
          <h3 className="text-sm font-medium mb-2">Featured Image:</h3>
          <div className="flex justify-center">
            <img 
              src={generatedImageUrl} 
              alt="Featured" 
              className="max-h-48 object-contain" 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;

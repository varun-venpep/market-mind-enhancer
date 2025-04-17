
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImageIcon } from "lucide-react";

interface ImageGeneratorProps {
  imagePrompt: string;
  setImagePrompt: (value: string) => void;
  handleGenerateImage: () => void;
  isGeneratingImage: boolean;
  generatedImageUrl: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  imagePrompt,
  setImagePrompt,
  handleGenerateImage,
  isGeneratingImage,
  generatedImageUrl
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Image Generator</CardTitle>
          <CardDescription>
            Create AI-generated images for your content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-prompt">Image Description</Label>
            <Textarea 
              id="image-prompt" 
              placeholder="Describe the image you want to generate in detail" 
              rows={6}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Be specific about style, colors, mood, and subjects for best results
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full gap-2" 
            onClick={() => handleGenerateImage()}
            disabled={isGeneratingImage}
          >
            {isGeneratingImage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Generated Image</CardTitle>
          <CardDescription>
            Your AI-generated image will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGeneratingImage ? (
            <div className="flex flex-col items-center justify-center h-[400px] border rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Creating your image...</p>
            </div>
          ) : generatedImageUrl ? (
            <div className="flex justify-center h-[400px] border rounded-md p-4">
              <img 
                src={generatedImageUrl} 
                alt="AI generated" 
                className="max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-md">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">Your image will appear here</p>
              <p className="text-xs text-muted-foreground mt-1">Describe the image and click Generate</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {generatedImageUrl && (
            <Button 
              variant="outline" 
              onClick={() => {
                window.open(generatedImageUrl, '_blank');
              }}
            >
              Download Image
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageGenerator;

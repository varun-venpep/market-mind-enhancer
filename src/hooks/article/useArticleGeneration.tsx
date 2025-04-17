
import { useState } from 'react';
import { generateImage } from '@/services/geminiApi';

export function useArticleGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  const generateFeaturedImage = async (title: string) => {
    if (!title) return;
    
    setIsGeneratingImage(true);
    
    try {
      const imagePrompt = `Create a professional featured image for a blog post titled: "${title}"`;
      const imageUrl = await generateImage(imagePrompt);
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return {
    isGenerating,
    setIsGenerating,
    generatedContent,
    setGeneratedContent,
    editedContent,
    setEditedContent,
    generatedImageUrl,
    setGeneratedImageUrl,
    isGeneratingImage,
    setIsGeneratingImage,
    activeTab,
    setActiveTab,
    generateFeaturedImage
  };
}

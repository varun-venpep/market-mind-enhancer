
// Orchestrate AI content/image gen using form selections (word count, content type, tone)

import { useState } from 'react';
import { generateImage, generateContent as geminiGenerateContent } from '@/services/geminiApi';
import { toast } from 'sonner';

export function useArticleGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  // All parameters influence content prompt
  const generateContent = async (title: string, keywords: string[], contentType: string, contentLength: string, tone: string) => {
    if (!title) {
      toast.error('Please enter a title');
      return false;
    }

    setIsGenerating(true);
    try {
      const lengthMap = { short: '500-700', medium: '1000-1200', long: '1500-2000' };
      const contentPrompt = `
        Create a ${contentType === 'blog-post' ? 'blog post' : contentType} about "${title}" 
        with a ${tone} tone. Length: approximately ${lengthMap[contentLength] || '1000-1200'} words.
        ${keywords.length > 0 ? `Target keywords: ${keywords.join(', ')}` : ''}
        Use proper HTML formatting with h1, h2, h3 tags for headings.
        Include a table of contents and clear structure.
        Make key phrases bold to improve readability.
        Follow these settings closely: ContentType="${contentType}", Length="${contentLength}", Tone="${tone}".
      `;
      const result = await geminiGenerateContent(contentPrompt);
      if (!result || result.trim() === '') {
        toast.error('Generated content is empty. Please try again.');
        return false;
      }
      setGeneratedContent(result);
      setEditedContent(result);
      toast.success('Content generated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  // Use Gemini exclusively for image generation
  const generateFeaturedImage = async (title: string) => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const imagePrompt = `Create a professional featured image for a blog post titled: "${title}"`;
      const imageUrl = await generateImage(imagePrompt);
      
      if (!imageUrl) {
        throw new Error('No image was generated');
      }
      
      setGeneratedImageUrl(imageUrl);
      toast.success('Featured image generated successfully');
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error('Failed to generate image with Gemini API. Please try again later.');
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
    generateContent,
    generateFeaturedImage
  };
}

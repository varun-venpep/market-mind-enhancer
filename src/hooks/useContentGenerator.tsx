
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateContent, generateImage } from '@/services/geminiApi';
import { fetchSerpResults } from '@/services/serpApi';
import { createArticle } from '@/services/articles';

export function useContentGenerator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blog-post');
  const [prompt, setPrompt] = useState('');
  const [keywords, setKeywords] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [contentLength, setContentLength] = useState('medium');
  const [tone, setTone] = useState('informational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generateAIImage, setGenerateAIImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('Please enter a topic or prompt');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const lengthMap = {
        short: '500-700',
        medium: '1000-1200',
        long: '1500-2000',
      };

      const contentPrompt = `
        Create a ${contentType === 'blog-post' ? 'blog post' : contentType} about "${prompt}" 
        with a ${tone} tone. 
        Length: approximately ${lengthMap[contentLength]} words.
        ${keywords ? `Target keywords: ${keywords}` : ''}
        Use SEO best practices, include a compelling headline, and format with markdown.
      `;

      const result = await generateContent(contentPrompt);
      setGeneratedContent(result);
      
      if (generateAIImage) {
        handleGenerateImage(true);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (autoGenerate = false) => {
    const imageDescription = autoGenerate ? prompt : imagePrompt;
    
    if (!imageDescription) {
      toast.error('Please enter an image description');
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImageUrl('');

    try {
      const imageUrl = await generateImage(imageDescription);
      setGeneratedImageUrl(imageUrl);
      if (!autoGenerate) {
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      if (!autoGenerate) {
        toast.error('Failed to generate image. Please try again.');
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const getSuggestions = async () => {
    if (!prompt) {
      toast.error('Please enter a topic first');
      return;
    }

    setIsLoadingSuggestions(true);
    setKeywordSuggestions([]);

    try {
      const result = await fetchSerpResults(prompt);
      const data = result.related_searches || [];
      const suggestions = data.map(item => item.query).slice(0, 5);
      setKeywordSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching keyword suggestions:', error);
      toast.error('Failed to get keyword suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addKeyword = (keyword) => {
    const currentKeywords = keywords ? keywords.split(',').map(k => k.trim()) : [];
    if (!currentKeywords.includes(keyword)) {
      const newKeywords = [...currentKeywords, keyword].join(', ');
      setKeywords(newKeywords);
    }
  };

  const handleSaveArticle = async () => {
    // Validate inputs
    if (!prompt.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!generatedContent.trim()) {
      toast.error('Please generate content before saving');
      return;
    }

    setIsSaving(true);
    
    try {
      const keywordsList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      const newArticle = await createArticle({
        title: prompt,
        content: generatedContent,
        keywords: keywordsList,
        status: 'draft',
        thumbnail_url: generatedImageUrl || undefined
      });
      
      toast.success('Article saved as draft');
      
      navigate(`/dashboard/article-editor/${newArticle.id}`);
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    prompt,
    setPrompt,
    keywords,
    setKeywords,
    contentType,
    setContentType,
    contentLength,
    setContentLength,
    tone,
    setTone,
    isGenerating,
    generatedContent,
    imagePrompt,
    setImagePrompt,
    generateAIImage,
    setGenerateAIImage,
    generatedImageUrl,
    isGeneratingImage,
    keywordSuggestions,
    isLoadingSuggestions,
    isSaving,
    handleGenerate,
    handleGenerateImage,
    getSuggestions,
    addKeyword,
    handleSaveArticle
  };
}

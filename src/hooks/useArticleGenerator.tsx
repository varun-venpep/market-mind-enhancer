import { useEffect, useState } from 'react';
import { useArticleForm } from './article/useArticleForm';
import { useArticleKeywords } from './article/useArticleKeywords';
import { useArticleGeneration } from './article/useArticleGeneration';
import { useArticleSaving } from './article/useArticleSaving';
import { useCampaigns } from './article/useCampaigns';
import { toast } from 'sonner';

export function useArticleGenerator() {
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const {
    title,
    setTitle,
    keywords,
    setKeywords,
    contentType,
    setContentType,
    contentLength,
    setContentLength,
    tone,
    setTone,
    generateAIImage,
    setGenerateAIImage,
    selectedCampaignId,
    setSelectedCampaignId,
    handleKeywordInput,
    addKeyword,
    validateForm
  } = useArticleForm();

  const {
    keywordSuggestions,
    isLoadingSuggestions,
    getSuggestions
  } = useArticleKeywords(title);

  const {
    isGenerating,
    setIsGenerating,
    generatedContent,
    setGeneratedContent,
    editedContent,
    setEditedContent,
    generatedImageUrl,
    isGeneratingImage,
    activeTab,
    setActiveTab,
    generateContent,
    generateFeaturedImage
  } = useArticleGeneration();

  const {
    isSaving,
    saveArticle
  } = useArticleSaving();

  const { campaigns } = useCampaigns();

  // Set the selectedCampaignId when campaigns are loaded
  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId, setSelectedCampaignId]);

  const handleGenerate = async () => {
    if (!validateForm()) return;
    
    // Generate content first
    const contentGenerated = await generateContent(title, keywords.split(','), contentType, contentLength, tone);
    
    if (!contentGenerated) {
      return;
    }
    
    // Then generate image if needed
    if (generateAIImage) {
      await generateFeaturedImage(title);
    }
    
    // Open the preview dialog instead of switching tabs
    setPreviewDialogOpen(true);
  };

  const handleSaveArticle = async () => {
    // Check if we have generated content
    if (!generatedContent || generatedContent.trim() === '') {
      toast.error("Please generate content before saving");
      return;
    }
    
    await saveArticle(
      title,
      editedContent,
      keywords,
      selectedCampaignId,
      generatedImageUrl
    );
    
    // Close the dialog after saving
    setPreviewDialogOpen(false);
  };

  return {
    // Form data
    title,
    setTitle,
    keywords,
    setKeywords,
    contentType,
    setContentType,
    contentLength,
    setContentLength,
    tone,
    setTone,
    
    // Generation states
    isGenerating,
    setIsGenerating,
    generatedContent,
    setGeneratedContent,
    editedContent,
    setEditedContent,
    activeTab,
    setActiveTab,
    
    // Preview dialog state
    previewDialogOpen,
    setPreviewDialogOpen,
    
    // Keyword features
    keywordSuggestions,
    isLoadingSuggestions,
    
    // Campaign data
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    
    // Image generation
    generateAIImage,
    setGenerateAIImage,
    generatedImageUrl,
    isGeneratingImage,
    
    // Saving state
    isSaving,
    
    // Methods
    handleGenerate,
    handleKeywordInput,
    getSuggestions,
    addKeyword,
    handleSaveArticle
  };
}

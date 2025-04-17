
import { useEffect } from 'react';
import { useArticleForm } from './article/useArticleForm';
import { useArticleKeywords } from './article/useArticleKeywords';
import { useArticleGeneration } from './article/useArticleGeneration';
import { useArticleSaving } from './article/useArticleSaving';
import { useCampaigns } from './article/useCampaigns';

export function useArticleGenerator() {
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

  const handleGenerate = () => {
    if (!validateForm()) return;
    
    if (generateAIImage) {
      generateFeaturedImage(title);
    }
    
    setActiveTab("preview");
    setEditedContent(generatedContent);
  };

  const handleSaveArticle = async () => {
    await saveArticle(
      title,
      editedContent,
      keywords,
      selectedCampaignId,
      generatedImageUrl
    );
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

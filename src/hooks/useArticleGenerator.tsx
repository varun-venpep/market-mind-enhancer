
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { createArticle } from '@/services/articles';
import { fetchUserCampaigns } from '@/services/articles/campaigns';
import { generateImage } from '@/services/geminiApi';
import { Campaign } from '@/types';

export function useArticleGenerator() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [contentLength, setContentLength] = useState("medium");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [activeTab, setActiveTab] = useState("settings");
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [generateAIImage, setGenerateAIImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaignsData = await fetchUserCampaigns();
        setCampaigns(campaignsData);
        
        if (campaignsData.length > 0) {
          setSelectedCampaignId(campaignsData[0].id);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
      }
    };
    
    loadCampaigns();
  }, []);

  const handleGenerate = () => {
    if (!title) {
      toast.error("Please enter a title before generating content");
      return;
    }
    
    if (generateAIImage) {
      generateFeaturedImage();
    }
    
    setActiveTab("preview");
    setEditedContent(generatedContent);
  };

  const generateFeaturedImage = async () => {
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

  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const newKeyword = e.currentTarget.value.trim();
      if (newKeyword && !keywords.includes(newKeyword)) {
        if (keywords) {
          setKeywords(prev => `${prev}, ${newKeyword}`);
        } else {
          setKeywords(newKeyword);
        }
        e.currentTarget.value = '';
      }
    }
  };

  const getSuggestions = async () => {
    if (!title) {
      toast.error("Please enter a title first");
      return;
    }
    
    setIsLoadingSuggestions(true);
    try {
      // This is a placeholder for the actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const suggestions = [
        "SEO optimization", 
        "content marketing", 
        "digital strategy", 
        "keyword research", 
        "online presence"
      ];
      setKeywordSuggestions(suggestions);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast.error("Failed to get keyword suggestions");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      if (keywords) {
        setKeywords(prev => `${prev}, ${keyword}`);
      } else {
        setKeywords(keyword);
      }
    }
  };

  const handleSaveArticle = async () => {
    if (!title.trim()) {
      toast.error("Please provide a title before saving");
      return;
    }

    if (!editedContent.trim()) {
      toast.error("Please generate content before saving");
      return;
    }

    if (!selectedCampaignId) {
      toast.error("Please select a campaign before saving");
      return;
    }

    setIsSaving(true);
    
    try {
      const keywordsList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      const newArticle = await createArticle({
        title,
        content: editedContent,
        keywords: keywordsList,
        campaign_id: selectedCampaignId,
        status: 'draft',
        thumbnail_url: generatedImageUrl || undefined
      });
      
      setIsSaving(false);
      toast.success("Article saved successfully");
      
      navigate(`/dashboard/article-editor/${newArticle.id}`);
    } catch (error) {
      console.error("Error saving article:", error);
      setIsSaving(false);
      toast.error("Failed to save article");
    }
  };

  return {
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
    isGenerating,
    setIsGenerating,
    generatedContent,
    setGeneratedContent,
    editedContent,
    setEditedContent,
    activeTab,
    setActiveTab,
    keywordSuggestions,
    isLoadingSuggestions,
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    generateAIImage,
    setGenerateAIImage,
    generatedImageUrl,
    isGeneratingImage,
    isSaving,
    handleGenerate,
    handleKeywordInput,
    getSuggestions,
    addKeyword,
    handleSaveArticle
  };
}

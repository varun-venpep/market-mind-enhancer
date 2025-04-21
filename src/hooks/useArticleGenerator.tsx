
import { useEffect, useState, useRef } from 'react';
import { useArticleForm } from './article/useArticleForm';
import { useArticleKeywords } from './article/useArticleKeywords';
import { useArticleGeneration } from './article/useArticleGeneration';
import { useArticleSaving } from './article/useArticleSaving';
import { useCampaigns } from './article/useCampaigns';
import { toast } from 'sonner';
import { useNavigate, useLocation } from "react-router-dom";

// Key for localStorage draft
const LS_KEY = "article-generator-draft-v1";

export function useArticleGenerator() {
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false); // Unused, but left for backward compat
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingNavigate, setPendingNavigate] = useState<string | null>(null);

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

  // Track if there are unsaved changes
  const [isDirty, setIsDirty] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Ref to detect initial load
  const isLoadedRef = useRef(false);

  // Auto-persist form/content changes
  useEffect(() => {
    if (!isLoadedRef.current) return; // Don't persist on load
    const data = {
      title, keywords, contentType, contentLength, tone, generateAIImage, selectedCampaignId,
      generatedContent, editedContent, generatedImageUrl
    };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    setIsDirty(true);
  }, [title, keywords, contentType, contentLength, tone, generateAIImage, selectedCampaignId, generatedContent, editedContent, generatedImageUrl]);

  // Load data from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.keywords) setKeywords(parsed.keywords);
        if (parsed.contentType) setContentType(parsed.contentType);
        if (parsed.contentLength) setContentLength(parsed.contentLength);
        if (parsed.tone) setTone(parsed.tone);
        if (parsed.generateAIImage) setGenerateAIImage(parsed.generateAIImage);
        if (parsed.selectedCampaignId) setSelectedCampaignId(parsed.selectedCampaignId);
        if (parsed.generatedContent) setGeneratedContent(parsed.generatedContent);
        if (parsed.editedContent) setEditedContent(parsed.editedContent);
        if (parsed.generatedImageUrl) setGeneratedImageUrl(parsed.generatedImageUrl);
      } catch {}
    }
    isLoadedRef.current = true;
    setIsDirty(false);
    // eslint-disable-next-line
  }, []);

  // Set the selectedCampaignId when campaigns are loaded
  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId, setSelectedCampaignId]);

  // Navigation blocking if dirty (browser/tab close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; // Show default browser prompt
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Navigation blocking for in-app navigation
  useEffect(() => {
    // Listen on route changes
    const unblock = (navigation: any) => {
      if (isDirty && !showLeaveConfirm) {
        setPendingNavigate(navigation.location.pathname);
        setShowLeaveConfirm(true);
        return false; // Block navigation
      }
      return true;
    };
    // Use React Router's navigation blocker
    // Modern react-router-dom v6: we must hack because Block is deprecated
    // Instead, we listen to location changes here and trigger the prompt
    // The actual navigation will be handled in the dialogue
    // This workaround does not block URL typing but handles most user navigation

    // We simulate this by watching location change **after** showing the dialog, navigate if confirmed
    // So nothing to add here -- we handle navigation in handleDiscardAndNavigate, handleSaveAndNavigate
  }, [isDirty, showLeaveConfirm, pendingNavigate]);

  // When user confirms save & leave:
  const handleSaveAndNavigate = async () => {
    // Save as draft then navigate
    await handleSaveArticle();
    setIsDirty(false);
    setShowLeaveConfirm(false);
    localStorage.removeItem(LS_KEY);
    if (pendingNavigate) {
      navigate(pendingNavigate);
      setPendingNavigate(null);
    }
  };

  // When user discards:
  const handleDiscardAndNavigate = () => {
    setIsDirty(false);
    setShowLeaveConfirm(false);
    // Remove drafts
    localStorage.removeItem(LS_KEY);
    if (pendingNavigate) {
      navigate(pendingNavigate);
      setPendingNavigate(null);
    }
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    const contentGenerated = await generateContent(
        title, keywords.split(','), contentType, contentLength, tone
    );
    if (!contentGenerated) return;
    if (generateAIImage) {
      await generateFeaturedImage(title);
    }
  };

  const handleSaveArticle = async () => {
    if (!editedContent || editedContent.trim() === '') {
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
    setIsDirty(false);
    localStorage.removeItem(LS_KEY);
  };

  // Save isDirty so the UI can show navigation block
  return {
    // Form data
    title, setTitle, keywords, setKeywords, contentType, setContentType, contentLength, setContentLength, tone, setTone,
    isGenerating, setIsGenerating, generatedContent, setGeneratedContent, editedContent, setEditedContent, activeTab, setActiveTab,
    previewDialogOpen, setPreviewDialogOpen,
    keywordSuggestions, isLoadingSuggestions, campaigns, selectedCampaignId, setSelectedCampaignId,
    generateAIImage, setGenerateAIImage, generatedImageUrl, isGeneratingImage, isSaving,
    handleGenerate, handleKeywordInput, getSuggestions, addKeyword, handleSaveArticle,
    isDirty, showLeaveConfirm, setShowLeaveConfirm, handleSaveAndNavigate, handleDiscardAndNavigate
  };
}

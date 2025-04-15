
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Article } from "@/types";
import { updateArticle } from "@/services/articleService";

export function useArticleEditor(article: Article | null) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState<number | null>(null);
  
  // Initialize the editor with article data
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content || "");
      setKeywords(article.keywords || []);
      setIsDirty(false);
      setSaveError(null);
      console.log("Editor initialized with article:", article.id);
    }
  }, [article]);
  
  // Track changes
  useEffect(() => {
    if (article) {
      const titleChanged = title !== article.title;
      const contentChanged = content !== (article.content || "");
      const keywordsChanged = JSON.stringify(keywords) !== JSON.stringify(article.keywords || []);
      
      setIsDirty(titleChanged || contentChanged || keywordsChanged);
    }
  }, [title, content, keywords, article]);
  
  // Save changes
  const saveChanges = useCallback(async () => {
    if (!article || !isDirty) return null;
    
    setIsSaving(true);
    setSaveError(null);
    const toastId = toast.loading("Saving article...");
    
    try {
      console.log("Saving article:", article.id);
      
      // Calculate word count
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      
      // Update the article
      const updatedArticle = await updateArticle(article.id, {
        title,
        content,
        keywords,
        word_count: wordCount,
        updated_at: new Date().toISOString()
      });
      
      toast.dismiss(toastId);
      toast.success("Article saved successfully");
      
      // Update tracking states
      setIsDirty(false);
      setLastSavedAt(new Date());
      
      return updatedArticle;
    } catch (error) {
      console.error("Error saving article:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setSaveError(errorMessage);
      toast.dismiss(toastId);
      toast.error("Failed to save article. Please try again.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [article, title, content, keywords, isDirty]);
  
  // Add a keyword
  const addKeyword = useCallback((keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords(prev => [...prev, keyword]);
    }
  }, [keywords]);
  
  // Remove a keyword
  const removeKeyword = useCallback((keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  }, []);
  
  // Auto-save functionality
  const toggleAutoSave = useCallback((enable: boolean, intervalMs = 30000) => {
    setAutoSaveEnabled(enable);
    
    if (enable) {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
      
      const interval = window.setInterval(() => {
        if (isDirty && !isSaving) {
          console.log("Auto-saving article...");
          saveChanges();
        }
      }, intervalMs);
      
      setAutoSaveInterval(interval);
      toast.success(`Auto-save enabled (every ${intervalMs / 1000} seconds)`);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        setAutoSaveInterval(null);
      }
      toast.info("Auto-save disabled");
    }
  }, [isDirty, isSaving, saveChanges, autoSaveInterval]);
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [autoSaveInterval]);
  
  return {
    title,
    setTitle,
    content,
    setContent,
    keywords,
    setKeywords,
    addKeyword,
    removeKeyword,
    isSaving,
    isDirty,
    saveChanges,
    saveError,
    lastSavedAt,
    autoSaveEnabled,
    toggleAutoSave
  };
}


import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Article } from "@/types";
import { updateArticle } from "@/services/articles";

export function useArticleEditor(article: Article | null) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true); // Default to enabled
  const autoSaveIntervalRef = useRef<number | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content || "");
      setKeywords(article.keywords || []);
      setIsDirty(false);
      setSaveError(null);
      console.log("Editor initialized with article:", article.id);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [article]);
  
  useEffect(() => {
    if (article) {
      const titleChanged = title !== article.title;
      const contentChanged = content !== (article.content || "");
      const keywordsChanged = JSON.stringify(keywords) !== JSON.stringify(article.keywords || []);
      
      setIsDirty(titleChanged || contentChanged || keywordsChanged);
      
      if (autoSaveEnabled && (titleChanged || contentChanged || keywordsChanged)) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = window.setTimeout(() => {
          if (!isSaving) {
            console.log("Auto-saving after changes detected");
            saveChanges();
          }
        }, 5000);
      }
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, keywords, article, autoSaveEnabled]);
  
  const saveChanges = useCallback(async (showToast = true) => {
    if (!article || !isDirty) return null;
    
    if (isSaving) return null;
    
    setIsSaving(true);
    setSaveError(null);
    
    let toastId: string | number | undefined;
    if (showToast) {
      toastId = toast.loading("Saving article...");
    }
    
    try {
      console.log("Saving article:", article.id);
      
      // Calculate word count properly by removing HTML tags
      const wordCount = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .split(/\s+/)
        .filter(Boolean)
        .length;
      
      const updatedArticle = await updateArticle(article.id, {
        title,
        content,
        keywords,
        word_count: wordCount,
        updated_at: new Date().toISOString()
      });
      
      if (showToast && toastId) {
        toast.dismiss(toastId);
        toast.success("Article saved successfully");
      }
      
      setIsDirty(false);
      setLastSavedAt(new Date());
      
      return updatedArticle;
    } catch (error) {
      console.error("Error saving article:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setSaveError(errorMessage);
      
      if (showToast && toastId) {
        toast.dismiss(toastId);
        toast.error("Failed to save article. Please try again.");
      }
      
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [article, title, content, keywords, isDirty, isSaving]);
  
  const forceSave = useCallback(async () => {
    if (!article) return null;
    
    setIsSaving(true);
    setSaveError(null);
    const toastId = toast.loading("Saving article...");
    
    try {
      console.log("Force saving article:", article.id);
      
      // Calculate word count properly by removing HTML tags
      const wordCount = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .split(/\s+/)
        .filter(Boolean)
        .length;
      
      const updatedArticle = await updateArticle(article.id, {
        title,
        content,
        keywords,
        word_count: wordCount,
        updated_at: new Date().toISOString()
      });
      
      toast.dismiss(toastId);
      toast.success("Article saved successfully");
      
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
  }, [article, title, content, keywords]);
  
  const addKeyword = useCallback((keyword: string) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (normalizedKeyword && !keywords.includes(normalizedKeyword)) {
      setKeywords(prev => [...prev, normalizedKeyword]);
    }
  }, [keywords]);
  
  const removeKeyword = useCallback((keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  }, []);
  
  const toggleAutoSave = useCallback((enable: boolean, intervalMs = 30000) => {
    setAutoSaveEnabled(enable);
    
    if (enable) {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      
      const interval = window.setInterval(() => {
        if (isDirty && !isSaving) {
          console.log("Auto-saving article on interval...");
          saveChanges(false);
        }
      }, intervalMs);
      
      autoSaveIntervalRef.current = interval;
      toast.success(`Auto-save enabled (every ${intervalMs / 1000} seconds)`);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
      toast.info("Auto-save disabled");
    }
  }, [isDirty, isSaving, saveChanges]);
  
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
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
    forceSave,
    saveError,
    lastSavedAt,
    autoSaveEnabled,
    toggleAutoSave
  };
}

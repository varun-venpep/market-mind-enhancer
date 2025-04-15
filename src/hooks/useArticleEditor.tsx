
import { useState, useEffect } from "react";
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
  
  // Initialize the editor with article data
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content || "");
      setKeywords(article.keywords || []);
      setIsDirty(false);
      setSaveError(null);
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
  const saveChanges = async () => {
    if (!article || !isDirty) return null;
    
    setIsSaving(true);
    setSaveError(null);
    const toastId = toast.loading("Saving article...");
    
    try {
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
  };
  
  // Add a keyword
  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };
  
  // Remove a keyword
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };
  
  // Auto-save functionality (can be enabled/disabled)
  const enableAutoSave = (intervalMs = 30000) => {
    const interval = setInterval(() => {
      if (isDirty && !isSaving) {
        saveChanges();
      }
    }, intervalMs);
    
    return () => clearInterval(interval);
  };
  
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
    enableAutoSave
  };
}

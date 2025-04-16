
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from "sonner";
import { Article } from '@/types';
import { updateArticle } from '@/services/articles';

export function useAutoSave(
  article: Article | null,
  isDirty: boolean,
  isSaving: boolean,
  content: string,
  title: string,
  keywords: string[]
) {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const autoSaveIntervalRef = useRef<number | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  const saveChanges = useCallback(async (showToast = true) => {
    if (!article || !isDirty || isSaving) return null;

    let toastId: string | number | undefined;
    if (showToast) {
      toastId = toast.loading("Saving article...");
    }

    try {
      const wordCount = content
        .replace(/<[^>]*>/g, '')
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

      setLastSavedAt(new Date());
      return updatedArticle;
    } catch (error) {
      console.error("Error saving article:", error);
      if (showToast && toastId) {
        toast.dismiss(toastId);
        toast.error("Failed to save article. Please try again.");
      }
      return null;
    }
  }, [article, isDirty, isSaving, content, title, keywords]);

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
    autoSaveEnabled,
    lastSavedAt,
    saveChanges,
    toggleAutoSave
  };
}

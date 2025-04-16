
import { useState, useEffect } from "react";
import { Article } from "@/types";
import { useAutoSave } from "./useAutoSave";
import { useKeywords } from "./useKeywords";

export function useArticleEditor(article: Article | null) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  useEffect(() => {
    if (article) {
      const titleChanged = title !== article.title;
      const contentChanged = content !== (article.content || "");
      const keywordsChanged = JSON.stringify(keywords) !== JSON.stringify(article.keywords || []);
      setIsDirty(titleChanged || contentChanged || keywordsChanged);
    }
  }, [title, content, keywords, article]);

  const {
    autoSaveEnabled,
    lastSavedAt,
    saveChanges,
    toggleAutoSave
  } = useAutoSave(article, isDirty, isSaving, content, title, keywords);

  const { addKeyword, removeKeyword } = useKeywords(keywords, setKeywords);

  const forceSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    const result = await saveChanges(true);
    setIsSaving(false);
    return result;
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
    forceSave,
    saveError,
    lastSavedAt,
    autoSaveEnabled,
    toggleAutoSave
  };
}


// Removed fallback toasts and ensured getSuggestions is always dynamic API call

import { useState } from 'react';
import { toast } from "sonner";
import { invokeFunction } from '@/services/supabase/functions';

export function useArticleKeywords(title: string) {
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Always use the API for dynamic suggestions
  const getSuggestions = async () => {
    if (!title) {
      toast.error("Please enter a title first");
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const result = await invokeFunction('get-keyword-suggestions', {
        query: title,
        language: 'en'
      });
      if (result?.keywords && Array.isArray(result.keywords)) {
        setKeywordSuggestions(result.keywords);
      } else {
        setKeywordSuggestions([]);
      }
    } catch (error) {
      setKeywordSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return {
    keywordSuggestions,
    isLoadingSuggestions,
    getSuggestions,
  };
}


import { useState } from 'react';
import { toast } from "sonner";

export function useArticleKeywords(title: string) {
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

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

  return {
    keywordSuggestions,
    isLoadingSuggestions,
    getSuggestions
  };
}

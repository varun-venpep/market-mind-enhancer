
import { useCallback } from 'react';

export function useKeywords(keywords: string[], setKeywords: (keywords: string[]) => void) {
  const addKeyword = useCallback((keyword: string) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (normalizedKeyword && !keywords.includes(normalizedKeyword)) {
      setKeywords([...keywords, normalizedKeyword]);
    }
  }, [keywords, setKeywords]);

  const removeKeyword = useCallback((keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  }, [keywords, setKeywords]);

  return {
    addKeyword,
    removeKeyword
  };
}


import { useState } from 'react';
import { toast } from "sonner";

export function useArticleForm() {
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [contentLength, setContentLength] = useState("medium");
  const [tone, setTone] = useState("professional");
  const [generateAIImage, setGenerateAIImage] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

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

  const addKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      if (keywords) {
        setKeywords(prev => `${prev}, ${keyword}`);
      } else {
        setKeywords(keyword);
      }
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Please provide a title before saving");
      return false;
    }
    return true;
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
    generateAIImage,
    setGenerateAIImage,
    selectedCampaignId,
    setSelectedCampaignId,
    handleKeywordInput,
    addKeyword,
    validateForm
  };
}

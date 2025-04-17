
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { createArticle } from '@/services/articles';

export function useArticleSaving() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const saveArticle = async (
    title: string, 
    content: string, 
    keywords: string, 
    campaignId: string | null, 
    imageUrl: string
  ) => {
    if (!title.trim()) {
      toast.error("Please provide a title before saving");
      return false;
    }

    if (!content.trim()) {
      toast.error("Please generate content before saving");
      return false;
    }

    setIsSaving(true);
    
    try {
      const keywordsList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      const newArticle = await createArticle({
        title,
        content,
        keywords: keywordsList,
        campaign_id: campaignId || undefined,
        status: 'draft',
        thumbnail_url: imageUrl || undefined
      });
      
      setIsSaving(false);
      toast.success("Article saved successfully");
      
      navigate(`/dashboard/article-editor/${newArticle.id}`);
      return true;
    } catch (error) {
      console.error("Error saving article:", error);
      setIsSaving(false);
      toast.error("Failed to save article");
      return false;
    }
  };

  return {
    isSaving,
    saveArticle
  };
}

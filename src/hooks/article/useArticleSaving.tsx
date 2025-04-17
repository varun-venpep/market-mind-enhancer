
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
      return;
    }

    if (!content.trim()) {
      toast.error("Please generate content before saving");
      return;
    }

    if (!campaignId) {
      toast.error("Please select a campaign before saving");
      return;
    }

    setIsSaving(true);
    
    try {
      const keywordsList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      const newArticle = await createArticle({
        title,
        content,
        keywords: keywordsList,
        campaign_id: campaignId,
        status: 'draft',
        thumbnail_url: imageUrl || undefined
      });
      
      setIsSaving(false);
      toast.success("Article saved successfully");
      
      navigate(`/dashboard/article-editor/${newArticle.id}`);
    } catch (error) {
      console.error("Error saving article:", error);
      setIsSaving(false);
      toast.error("Failed to save article");
    }
  };

  return {
    isSaving,
    saveArticle
  };
}

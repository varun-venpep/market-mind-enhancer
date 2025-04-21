
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ShopifyStore } from '@/types/shopify';

export function useShopifyBlogGenerator(store?: ShopifyStore | null) {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogKeywords, setBlogKeywords] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const { toast } = useToast();

  const handleBlogGenerate = async () => {
    if (!blogTitle) {
      toast({
        title: "Missing Title",
        description: "Please enter a blog post title",
        variant: "destructive"
      });
      return;
    }
    setIsGeneratingBlog(true);
    setBlogContent("");
    try {
      const storeContext = store?.store_name || "e-commerce store";
      const prompt = `
        Write an SEO-optimized blog post for a Shopify store called "${storeContext}" with the title: "${blogTitle}".
        ${blogKeywords ? `Focus on these keywords: ${blogKeywords}` : ''}
        The blog post should be informative, engaging, and follow best practices for SEO content.
        Include a compelling introduction, 3-5 main sections with subheadings, and a conclusion.
        Format the content using markdown with proper headings, lists, and emphasis where appropriate.
        The blog post should be around 800-1000 words.
      `;
      const { generateContent } = await import('@/services/geminiApi');
      const content = await generateContent(prompt);
      setBlogContent(content);
      toast({
        title: "Blog Post Generated",
        description: "Your SEO-optimized blog post has been created"
      });
    } catch {
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog post content",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingBlog(false);
    }
  };

  return {
    blogTitle, setBlogTitle, blogKeywords, setBlogKeywords,
    blogContent, setBlogContent, isGeneratingBlog, handleBlogGenerate,
  };
}

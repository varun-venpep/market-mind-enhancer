
import { supabase } from "@/integrations/supabase/client";
import { generateContent } from "@/services/geminiApi";

export interface GenerateContentResponse {
  content: string;
  wordCount: number;
}

export async function generateArticleContent(
  title: string, 
  keywords: string[] = [],
  contentType: string = 'blog',
  contentLength: string = 'medium',
  tone: string = 'professional'
): Promise<GenerateContentResponse> {
  try {
    console.log(`Generating ${contentType} content with ${contentLength} length and ${tone} tone`);
    
    // Determine word count based on requested length
    let targetWordCount = 0;
    switch (contentLength) {
      case 'short': targetWordCount = 500; break;
      case 'medium': targetWordCount = 1000; break;
      case 'long': targetWordCount = 1500; break;
      default: targetWordCount = 1000;
    }
    
    // Format keywords for prompt
    const keywordsText = keywords.length > 0 ? keywords.join(', ') : '';
    
    // Create a detailed SEO-optimized content generation prompt
    const prompt = `
    Create a highly SEO-optimized ${contentType} about "${title}" with a ${tone} tone.
    
    Target keywords: ${keywordsText}
    Target length: approximately ${targetWordCount} words
    
    The content should:
    - Include proper HTML formatting with h1, h2, h3 tags
    - Have an engaging introduction
    - Include a table of contents
    - Have comprehensive sections with relevant subheadings
    - Include bullet points for easy readability
    - End with a clear conclusion
    - Use the keywords naturally throughout the content
    
    Format the output as clean HTML with proper headings, paragraphs, and lists.
    `;
    
    // Use the Gemini API to generate content
    const htmlContent = await generateContent(prompt, {
      temperature: 0.7,
      maxOutputTokens: 2048
    });
    
    // Calculate approximate word count
    const wordCount = htmlContent.split(/\s+/).length;
    
    return {
      content: htmlContent,
      wordCount
    };
  } catch (error) {
    console.error("Error generating article content:", error);
    
    // Provide a fallback response in case of error
    const fallbackContent = `
    <h1>${title}</h1>
    <p>We couldn't generate content for this topic. Please try again later.</p>
    `;
    
    return {
      content: fallbackContent,
      wordCount: 20
    };
  }
}

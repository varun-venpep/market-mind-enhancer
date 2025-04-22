
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
    
    // Determine target word count based on requested length
    const wordCountRanges = {
      short: { min: 500, max: 700 },
      medium: { min: 1000, max: 1200 },
      long: { min: 1500, max: 2000 }
    };
    
    const targetCount = wordCountRanges[contentLength] || wordCountRanges.medium;
    
    // Create a detailed content generation prompt
    const prompt = `
    You are an expert ${contentType} writer. Create a highly engaging and SEO-optimized ${contentType} about "${title}"
    with a ${tone} tone. Follow these specifications:

    Content Type: ${contentType}
    Target Length: ${targetCount.min}-${targetCount.max} words
    Tone: ${tone}
    Target Keywords: ${keywords.join(', ')}

    Style Guidelines based on Content Type:
    ${getContentTypeGuidelines(contentType)}

    Tone Guidelines:
    ${getToneGuidelines(tone)}

    Requirements:
    - Use proper HTML formatting with h1, h2, h3 tags
    - Create an engaging introduction that hooks the reader
    - Include a clear table of contents
    - Break content into well-organized sections
    - Use bullet points and lists where appropriate
    - Naturally incorporate the keywords throughout the content
    - End with a strong conclusion and call to action
    - Optimize for both readability and SEO
    - Match the specified tone consistently throughout
    
    Format the output as clean HTML with proper semantic structure.
    `;
    
    // Generate content with optimized parameters based on content type and tone
    const htmlContent = await generateContent(prompt, {
      temperature: getToneTemperature(tone),
      maxOutputTokens: getMaxTokens(contentLength)
    });
    
    // Calculate word count
    const wordCount = htmlContent.split(/\s+/).length;
    
    return {
      content: htmlContent,
      wordCount
    };
  } catch (error) {
    console.error("Error generating article content:", error);
    throw error;
  }
}

// Helper functions for content generation
function getContentTypeGuidelines(contentType: string): string {
  const guidelines = {
    'blog-post': 'Create an informative and engaging blog post with a clear narrative flow.',
    'article': 'Write a detailed, well-researched article with authoritative tone.',
    'product-description': 'Focus on benefits, features, and unique selling points.',
    'social-media': 'Create concise, engaging content optimized for social sharing.'
  };
  return guidelines[contentType] || guidelines['blog-post'];
}

function getToneGuidelines(tone: string): string {
  const guidelines = {
    'professional': 'Maintain a formal, business-appropriate tone with expert insights.',
    'conversational': 'Write in a friendly, approachable manner as if talking to a friend.',
    'informational': 'Focus on clear, factual presentation of information.',
    'persuasive': 'Use compelling arguments and emotional appeals to convince the reader.',
    'enthusiastic': 'Express ideas with high energy and excitement.'
  };
  return guidelines[tone] || guidelines['professional'];
}

function getToneTemperature(tone: string): number {
  const temperatures = {
    'professional': 0.3,
    'conversational': 0.7,
    'informational': 0.2,
    'persuasive': 0.6,
    'enthusiastic': 0.8
  };
  return temperatures[tone] || 0.5;
}

function getMaxTokens(contentLength: string): number {
  const tokens = {
    'short': 1024,
    'medium': 2048,
    'long': 4096
  };
  return tokens[contentLength] || 2048;
}

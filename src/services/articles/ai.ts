
import { generateContent, generateImage } from "@/services/geminiApi";

export async function generateArticleContent(title: string, keywords: string[]): Promise<{ content: string, wordCount: number }> {
  try {
    const keywordsText = keywords.join(', ');
    const prompt = `Write a comprehensive SEO-optimized article about "${title}". 
    Focus on these keywords: ${keywordsText}.
    
    The article should be well-structured with headings, paragraphs, and bullet points where appropriate.
    Include an introduction, main sections covering key aspects of the topic, and a conclusion.
    
    Make the content informative, engaging, and around 1000-1500 words.
    Format the content in markdown with proper headers, lists, and emphasis.`;
    
    const content = await generateContent(prompt);
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    
    return { content, wordCount };
  } catch (error) {
    console.error('Error generating article content:', error);
    throw error;
  }
}

export async function generateArticleThumbnail(title: string, keywords: string[]): Promise<string> {
  try {
    const keywordsText = keywords.join(', ');
    const prompt = `Create a professional blog thumbnail image for an article titled "${title}" about ${keywordsText}. 
    The image should be visually appealing and suitable for a professional blog or website.`;
    
    const imageUrl = await generateImage(prompt);
    return imageUrl;
  } catch (error) {
    console.error('Error generating article thumbnail:', error);
    throw error;
  }
}

export async function optimizeArticleContent(content: string, keywords: string[]): Promise<string> {
  try {
    const keywordsText = keywords.join(', ');
    const prompt = `Optimize the following article for SEO focusing on these keywords: ${keywordsText}.
    
    Improve the content by:
    1. Ensuring proper keyword placement and density
    2. Enhancing readability and engagement
    3. Improving the structure and flow
    4. Adding relevant subheadings if needed
    
    Here is the content to optimize:
    
    ${content}`;
    
    const optimizedContent = await generateContent(prompt);
    return optimizedContent;
  } catch (error) {
    console.error('Error optimizing article content:', error);
    throw error;
  }
}

export async function optimizeArticleSection(content: string, sectionTitle: string, keywords: string[]): Promise<string> {
  try {
    const keywordsText = keywords.join(', ');
    const prompt = `Optimize only the "${sectionTitle}" section in the following article, focusing on these keywords: ${keywordsText}.
    
    Improve this specific section by:
    1. Ensuring proper keyword inclusion
    2. Enhancing readability and engagement
    3. Expanding with relevant details if needed
    4. Making it more compelling for readers
    
    Here is the full article content:
    
    ${content}
    
    Return the ENTIRE article with ONLY the "${sectionTitle}" section optimized. Keep all other sections exactly the same.`;
    
    const optimizedContent = await generateContent(prompt);
    return optimizedContent;
  } catch (error) {
    console.error('Error optimizing article section:', error);
    throw error;
  }
}

export async function calculateSEOScore(content: string, keywords: string[]): Promise<number> {
  try {
    const keywordsText = keywords.join(', ');
    const prompt = `Analyze this article for SEO quality focusing on these keywords: ${keywordsText}.
    
    Rate it on a scale from 0-100 based on:
    1. Keyword usage and placement
    2. Content quality and relevance
    3. Readability and engagement
    4. Structure and organization
    
    Return ONLY a number between 0-100 representing the score.
    
    Here is the content to analyze:
    
    ${content}`;
    
    const scoreText = await generateContent(prompt);
    const scoreMatch = scoreText.match(/\d+/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[0], 10);
      return Math.min(100, Math.max(0, score));
    }
    return 70;
  } catch (error) {
    console.error('Error calculating SEO score:', error);
    return 65;
  }
}


import { generateContent, generateImage } from "@/services/geminiApi";

export async function generateArticleContent(title: string, keywords: string[]): Promise<{ content: string, wordCount: number }> {
  try {
    const keywordsText = keywords.join(', ');
    const prompt = `Write a comprehensive SEO-optimized article about "${title}". 
    Focus on these keywords: ${keywordsText}.
    
    The article should be well-structured with proper HTML formatting.
    Include:
    - An engaging introduction
    - Clear headings using h2 and h3 tags
    - Well-organized paragraphs
    - Bullet points or numbered lists where appropriate
    
    Make the content informative, engaging, and around 1000-1500 words.
    Format using HTML tags like <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>.
    DO NOT include Markdown symbols like #, *, or other non-HTML formatting.
    Structure the article in a way that's easy to read and visually appealing.`;
    
    const content = await generateContent(prompt);
    
    // Process the content to ensure it's HTML
    let processedContent = content;
    
    // Ensure content has proper HTML structure
    if (!processedContent.includes('<h2>') && !processedContent.includes('<h1>')) {
      const lines = processedContent.split('\n');
      let formatted = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        
        if (i === 0) {
          // First line as title if not already formatted
          if (!line.startsWith('<h1>'))
            formatted += `<h1>${line}</h1>\n`;
          else
            formatted += `${line}\n`;
        } else if (line.length < 80 && line.endsWith(':')) {
          // Likely a heading
          formatted += `<h2>${line.slice(0, -1)}</h2>\n`;
        } else if (line.length < 80 && !line.endsWith('.')) {
          // Shorter lines without periods might be subheadings
          formatted += `<h3>${line}</h3>\n`;
        } else {
          // Regular paragraph
          formatted += `<p>${line}</p>\n`;
        }
      }
      
      processedContent = formatted;
    }
    
    const wordCount = processedContent
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .split(/\s+/)
      .filter(Boolean)
      .length;
    
    return { content: processedContent, wordCount };
  } catch (error) {
    console.error('Error generating article content:', error);
    throw error;
  }
}

export async function generateArticleThumbnail(title: string, keywords: string[]): Promise<string> {
  try {
    const keywordsText = keywords.join(', ');
    const prompt = `Create a professional blog thumbnail image for an article titled "${title}" about ${keywordsText}. 
    The image should be visually appealing with high quality and suitable for a professional blog or website.
    Make it colorful and eye-catching.`;
    
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
    const prompt = `Optimize the following HTML-formatted article for SEO focusing on these keywords: ${keywordsText}.
    
    Improve the content by:
    1. Ensuring proper keyword placement and density
    2. Enhancing readability and engagement
    3. Improving the structure and flow
    4. Using proper HTML formatting (not Markdown)
    
    Here is the content to optimize:
    
    ${content}
    
    Return the optimized content with proper HTML formatting.
    Use tags like <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>.
    DO NOT use Markdown symbols like #, *, etc.`;
    
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
    const prompt = `Optimize only the "${sectionTitle}" section in the following HTML-formatted article, focusing on these keywords: ${keywordsText}.
    
    Improve this specific section by:
    1. Ensuring proper keyword inclusion
    2. Enhancing readability and engagement
    3. Expanding with relevant details if needed
    4. Making it more compelling for readers
    
    Here is the full article content:
    
    ${content}
    
    Return the ENTIRE article with ONLY the "${sectionTitle}" section optimized. Keep all other sections exactly the same.
    Use HTML formatting for the content, not Markdown.`;
    
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
    const prompt = `Analyze this HTML-formatted article for SEO quality focusing on these keywords: ${keywordsText}.
    
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

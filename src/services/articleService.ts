
import { supabase } from "@/integrations/supabase/client";
import { Article, Campaign } from "@/types";
import { generateContent, generateImage } from "@/services/geminiApi";

// Fetch all campaigns for the current user
export async function fetchUserCampaigns(): Promise<Campaign[]> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Campaign[] || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

// Fetch a specific campaign by ID
export async function fetchCampaign(id: string): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    return data as Campaign | null;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
}

// Create a new campaign
export async function createCampaign(name: string, description?: string): Promise<Campaign> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create a campaign');
    }
    
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name,
        description,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as Campaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

// Fetch articles for a campaign
export async function fetchCampaignArticles(campaignId: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Article[] || [];
  } catch (error) {
    console.error('Error fetching campaign articles:', error);
    throw error;
  }
}

// Fetch a specific article by ID
export async function fetchArticle(id: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    return data as Article | null;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}

// Create a new article with more flexible typing
export async function createArticle(articleData: {
  title: string;
  keywords?: string[];
  campaign_id?: string;
  status?: string;
  content?: string;
  word_count?: number;
  thumbnail_url?: string;
  score?: number;
}): Promise<Article> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create an article');
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert({
        ...articleData,
        user_id: user.id,
        status: articleData.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as Article;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}

// Update an existing article with more flexible typing
export async function updateArticle(id: string, articleData: {
  title?: string;
  content?: string;
  keywords?: string[];
  status?: string;
  campaign_id?: string;
  thumbnail_url?: string;
  word_count?: number;
  score?: number;
  updated_at?: string; // Added this property
}): Promise<Article> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...articleData,
        updated_at: articleData.updated_at || new Date().toISOString() // Use provided value or set current timestamp
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Article;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

// Delete an article
export async function deleteArticle(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

// Generate article content with AI
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
    const wordCount = content.split(/\s+/).length;
    
    return { content, wordCount };
  } catch (error) {
    console.error('Error generating article content:', error);
    throw error;
  }
}

// Generate a thumbnail image for the article
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

// Optimize article content with AI
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

// Optimize specific section of an article
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

// Calculate SEO score for an article
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
    // Extract just the number from the response
    const scoreMatch = scoreText.match(/\d+/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[0], 10);
      return Math.min(100, Math.max(0, score)); // Ensure score is between 0-100
    }
    return 70; // Default fallback score
  } catch (error) {
    console.error('Error calculating SEO score:', error);
    // Return a reasonable default if calculation fails
    return 65;
  }
}

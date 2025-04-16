
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types";
import { ArticleCreationData, ArticleUpdateData } from "./types";

export async function fetchArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Article[] || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

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

export async function createArticle(articleData: ArticleCreationData): Promise<Article> {
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

export async function updateArticle(id: string, articleData: ArticleUpdateData): Promise<Article> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...articleData,
        updated_at: articleData.updated_at || new Date().toISOString()
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

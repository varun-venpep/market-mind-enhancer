
import { Article } from "@/types";

export interface ArticleCreationData {
  title: string;
  keywords?: string[];
  campaign_id?: string;
  status?: string;
  content?: string;
  word_count?: number;
  thumbnail_url?: string;
  score?: number;
}

export interface ArticleUpdateData {
  title?: string;
  content?: string;
  keywords?: string[];
  status?: string;
  campaign_id?: string;
  thumbnail_url?: string;
  word_count?: number;
  score?: number;
  updated_at?: string;
}

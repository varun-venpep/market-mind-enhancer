
export interface Article {
  id: string;
  title: string;
  content?: string;
  keywords?: string[];
  status: string; // Made more flexible
  user_id: string;
  campaign_id?: string;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  word_count?: number;
  score?: number;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

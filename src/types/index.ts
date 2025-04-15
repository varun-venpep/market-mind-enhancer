
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

// Restored ContentBrief interface
export interface ContentBrief {
  id: string;
  title: string;
  keywords: string[];
  status: 'draft' | 'published' | 'archived' | 'completed' | 'in-progress';
  createdAt: string;
  updatedAt: string;
  targetAudience?: string;
  notes?: string;
  
  // Additional properties used throughout the app
  score?: number;
  wordCount?: number;
  searchVolume?: number;
  difficulty?: number;
  aiPotential?: number;
  thumbnailUrl?: string;
  outline?: any[];
  questions?: string[];
  recommendedWordCount?: {
    min: number;
    max: number;
  };
}

// Restored Keyword interface
export interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  aiPotential: number;
}

// Restored OutlineItem interface
export interface OutlineItem {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'h4';
  text: string;
  score?: number;
  children?: OutlineItem[];
}

// Restored Workspace interface
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  isDefault?: boolean;
}

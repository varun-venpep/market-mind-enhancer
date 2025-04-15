
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

// Add the Keyword interface needed by RelatedKeywords component
export interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  aiPotential: number;
}

// Add the OutlineItem interface needed by ContentBrief.tsx
export interface OutlineItem {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'h4';
  text: string;
  score?: number;
  children?: OutlineItem[];
}

// Updated Article interface to match the Supabase schema
export interface Article {
  id: string;
  title: string;
  content?: string;
  keywords?: string[];
  status: 'draft' | 'in-progress' | 'completed';
  user_id: string;
  campaign_id?: string;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  word_count?: number;
  score?: number;
}

// Updated Campaign interface to match the Supabase schema
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  articleCount?: number;
}

// New Workspace interface
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  isDefault?: boolean;
}

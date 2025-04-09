
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


export interface ContentBrief {
  id: string;
  title: string;
  status: 'draft' | 'in-progress' | 'completed';
  keywords: string[];
  createdAt: string;
  updatedAt: string;
  score?: number;
  wordCount?: number;
  searchVolume?: number;
  difficulty?: number;
}

export interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  aiPotential: number;
  cpc: number;
  serps?: SerpResult[];
}

export interface SerpResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  position: number;
  wordCount?: number;
  headings?: string[];
}

export interface Topic {
  id: string;
  name: string;
  relevance: number;
  questions: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: 'free' | 'pro';
  trialEndsAt?: string;
}

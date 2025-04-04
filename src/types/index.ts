
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
  thumbnailUrl?: string;
  outline?: any[];
  questions?: string[];
  recommendedWordCount?: {
    min: number;
    max: number;
  };
  aiPotential?: number; // Adding this field to fix the error
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

export interface OutlineItem {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'h4';
  text: string;
  score: number;
  children?: OutlineItem[];
}

// Add subscription-related types
export interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'trialing' | 'canceled' | 'incomplete';
  planId: string;
  currentPeriodEnd: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  stripePriceId: string;
}

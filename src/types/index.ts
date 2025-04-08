export interface ContentBrief {
  id: string;
  title: string;
  keywords: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  targetAudience?: string;
  notes?: string;
}

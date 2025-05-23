
export interface SiteContent {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
  active: boolean;
  updated_at: string;
  created_at: string;
  last_updated_by: string | null;
  section_type: 'static' | 'blog' | 'system' | 'template';
  category?: string | null;
  featured_image?: string | null;
  description?: string | null;
}

export interface ContentFilter {
  section_type?: 'static' | 'blog' | 'system' | 'template';
  category?: string | null;
  active?: boolean;
  searchQuery?: string;
}

export type SortField = 'title' | 'section' | 'updated_at' | 'created_at' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface ContentSortOptions {
  field: SortField;
  direction: SortDirection;
}

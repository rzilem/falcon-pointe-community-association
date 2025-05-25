
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_path: string | null;
  category: string | null;
  type: 'event';
  display_date: string;
}

export interface BlogPost {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string;
  section: string;
  section_type: string | null;
  category: string | null;
  featured_image: string | null;
  active: boolean | null;
  updated_at: string;
  last_updated_by: string | null;
  type: 'blog';
  display_date: string;
}

export type ContentItem = Event | BlogPost;

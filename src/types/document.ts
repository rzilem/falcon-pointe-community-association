export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  category: string;
  description: string;
  last_updated: string;
}

export interface DocumentCategory {
  title: string;
  description: string;
  documents: Document[];
}

export interface DocumentCategoryType {
  title: string;
  description: string;
  documents: Document[];
}

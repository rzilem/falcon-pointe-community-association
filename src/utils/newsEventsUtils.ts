
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from "@/types/newsEvents";

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (error) {
    return dateString;
  }
};

export const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) {
    return null;
  }
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle local uploads (priority path)
  if (imagePath.startsWith('/lovable-uploads/')) {
    return imagePath;
  }
  
  // Handle paths that should be local uploads but missing the prefix
  if (imagePath.includes('lovable-uploads/') && !imagePath.startsWith('/')) {
    const correctedPath = '/' + imagePath;
    return correctedPath;
  }
  
  // For Supabase storage paths, get the public URL
  try {
    const { data } = supabase.storage
      .from('site-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting image URL from Supabase storage:', error);
    return null;
  }
};

export const getContentTypeLabel = (item: ContentItem) => {
  if (item.type === 'event') {
    return 'Event';
  } else {
    switch (item.category) {
      case 'announcements':
        return 'Announcement';
      case 'news':
        return 'News';
      case 'community':
        return 'Community Update';
      case 'maintenance':
        return 'Maintenance Notice';
      default:
        return 'Blog Post';
    }
  }
};

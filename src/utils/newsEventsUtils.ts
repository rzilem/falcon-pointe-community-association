
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from "@/types/newsEvents";

export const formatDate = (dateString: string) => {
  try {
    // For date strings like "2025-05-29", we want to avoid timezone conversion
    // Parse as local date to preserve the intended date
    const dateParts = dateString.split('T')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2]);
    
    const date = new Date(year, month, day);
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
  
  // For Supabase storage paths, get the public URL from the site-images bucket
  try {
    // Clean the path - remove any leading slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    const { data } = supabase.storage
      .from('site-images')
      .getPublicUrl(cleanPath);
    
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

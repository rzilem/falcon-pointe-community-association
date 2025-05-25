
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
  if (!imagePath) return null;
  
  // If it's already a full URL (like the fallback images), return as-is
  if (imagePath.startsWith('http') || imagePath.startsWith('/lovable-uploads/')) {
    return imagePath;
  }
  
  // If it's a Supabase storage path, get the public URL
  const { data } = supabase.storage
    .from('site-images')
    .getPublicUrl(imagePath);
  
  return data.publicUrl;
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
      default:
        return 'Blog Post';
    }
  }
};

export const getFallbackContent = (): ContentItem[] => [
  {
    id: "fallback-1",
    title: "Summer Pool Party",
    date: "2025-06-15",
    time: "2:00 PM - 6:00 PM",
    location: "Main Community Pool",
    description: "Join us for our annual summer pool party with food, games, and fun for the whole family!",
    image_path: "/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png",
    type: 'event',
    display_date: "2025-06-15"
  },
  {
    id: "fallback-2", 
    title: "Community Garage Sale",
    date: "2025-07-10",
    time: "8:00 AM - 4:00 PM",
    location: "Throughout Falcon Pointe",
    description: "Our semi-annual community-wide garage sale. Register your address by July 5th to be included on the map.",
    image_path: "/lovable-uploads/4c2a90e2-ed6a-4fd9-9929-d876a2684ba8.png",
    type: 'event',
    display_date: "2025-07-10"
  },
  {
    id: "fallback-3",
    title: "Movie Night at the Park",
    date: "2025-07-24",
    time: "8:30 PM",
    location: "Central Park",
    description: "Bring blankets and chairs for an evening of family fun watching a popular animated movie under the stars.",
    image_path: "/lovable-uploads/1e3c41bc-f71c-4013-957d-4fa60e414905.png",
    type: 'event',
    display_date: "2025-07-24"
  }
];

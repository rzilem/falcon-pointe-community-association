
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_path: string | null;
  type: 'event';
  display_date: string;
}

interface BlogPost {
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

type ContentItem = Event | BlogPost;

const NewsAndEventsPreview = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    
    // Set up real-time subscription for both events and blog posts
    const eventsChannel = supabase
      .channel('home-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          console.log('Events updated on home page, refetching...');
          fetchContent();
        }
      )
      .subscribe();

    const blogChannel = supabase
      .channel('home-blog-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content'
        },
        () => {
          console.log('Blog content updated on home page, refetching...');
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(blogChannel);
    };
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch upcoming events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(2);
      
      // Fetch recent blog posts (announcements, news)
      const { data: blogData, error: blogError } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_type', 'blog')
        .eq('active', true)
        .in('category', ['announcements', 'news', 'community'])
        .order('created_at', { ascending: false })
        .limit(2);
      
      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      }
      
      if (blogError) {
        console.error('Error fetching blog posts:', blogError);
      }
      
      // Transform and combine data
      const transformedEvents: Event[] = (eventsData || []).map(event => ({
        ...event,
        type: 'event' as const,
        display_date: event.date
      }));
      
      const transformedBlogPosts: BlogPost[] = (blogData || []).map(post => ({
        ...post,
        type: 'blog' as const,
        display_date: post.created_at.split('T')[0]
      }));
      
      // Combine and prioritize upcoming events
      const combined = [...transformedEvents, ...transformedBlogPosts];
      const today = new Date().toISOString().split('T')[0];
      
      combined.sort((a, b) => {
        const aIsUpcoming = a.type === 'event' && a.display_date >= today;
        const bIsUpcoming = b.type === 'event' && b.display_date >= today;
        
        // Upcoming events first
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
        
        // Then sort by date
        const aDate = new Date(a.display_date);
        const bDate = new Date(b.display_date);
        
        if (aIsUpcoming && bIsUpcoming) {
          return aDate.getTime() - bDate.getTime();
        } else {
          return bDate.getTime() - aDate.getTime();
        }
      });
      
      setContent(combined.slice(0, 3)); // Show top 3 items
    } catch (error) {
      console.error('Error fetching content:', error);
      // Keep fallback content if database fetch fails
      setContent(fallbackContent);
    } finally {
      setLoading(false);
    }
  };

  // Fallback content in case none are found in the database
  const fallbackContent: ContentItem[] = [
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

  const displayContent = content.length > 0 ? content : fallbackContent;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  const getImageUrl = (imagePath: string | null) => {
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

  const getContentTypeLabel = (item: ContentItem) => {
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

  const getContentIcon = (item: ContentItem) => {
    return item.type === 'event' ? Calendar : FileText;
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Latest News & Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with community events, announcements, and the latest news from Falcon Pointe!
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardHeader className="h-24 bg-gray-200"></CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-20 bg-gray-200 rounded mt-4"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayContent.map((item) => {
              const imageUrl = getImageUrl(
                item.type === 'event' ? item.image_path : item.featured_image
              );
              const ContentIcon = getContentIcon(item);
              
              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={item.title || 'Content image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ContentIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        item.type === 'event' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {getContentTypeLabel(item)}
                      </span>
                    </div>
                    <CardDescription className="font-medium text-primary">
                      {formatDate(item.display_date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {item.type === 'event' && (
                        <>
                          <p className="text-sm"><strong>Time:</strong> {item.time}</p>
                          <p className="text-sm"><strong>Location:</strong> {item.location}</p>
                        </>
                      )}
                      <p className="mt-4 text-gray-600 line-clamp-3">
                        {item.type === 'event' 
                          ? item.description 
                          : item.content?.replace(/<[^>]*>/g, '') || ''
                        }
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/news-events">
                        {item.type === 'event' ? 'Event Details' : 'Read More'}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button asChild>
            <Link to="/news-events">View All News & Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsAndEventsPreview;

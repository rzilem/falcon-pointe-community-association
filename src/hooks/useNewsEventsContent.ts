import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem, Event, BlogPost } from "@/types/newsEvents";
import { getFallbackContent } from "@/utils/newsEventsUtils";

export const useNewsEventsContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      setContent(getFallbackContent());
    } finally {
      setLoading(false);
    }
  };

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

  return { content, loading, fallbackContent: getFallbackContent() };
};

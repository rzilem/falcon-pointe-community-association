
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from "@/types/newsEvents";
import NewsEventsHero from "@/components/news-events/NewsEventsHero";
import NewsEventsFilters from "@/components/news-events/NewsEventsFilters";
import NewsEventsGrid from "@/components/news-events/NewsEventsGrid";
import NewsEventsGuidelines from "@/components/news-events/NewsEventsGuidelines";

const NewsEvents = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  useEffect(() => {
    fetchContent();
    
    // Set up real-time subscription for both events and blog posts
    const eventsChannel = supabase
      .channel('news-events-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          fetchContent();
        }
      )
      .subscribe();

    const blogChannel = supabase
      .channel('news-events-blog-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content'
        },
        () => {
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(blogChannel);
    };
  }, [filter]);
  
  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      let eventsQuery = supabase.from('events').select('*').order('date', { ascending: true });
      if (filter !== "all" && filter !== "blog") {
        eventsQuery = eventsQuery.eq('category', filter);
      }
      
      // Fetch blog posts (announcements, news, etc.)
      let blogQuery = supabase
        .from('site_content')
        .select('*')
        .eq('section_type', 'blog')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (filter === "announcements" || filter === "news" || filter === "community" || filter === "maintenance") {
        blogQuery = blogQuery.eq('category', filter);
      } else if (filter === "blog") {
        // Show all blog posts when "blog" filter is selected
      } else if (filter !== "all") {
        // For event-specific filters, don't show blog posts
        blogQuery = blogQuery.limit(0);
      }
      
      const [eventsResult, blogResult] = await Promise.all([
        eventsQuery,
        blogQuery
      ]);
      
      if (eventsResult.error) throw eventsResult.error;
      if (blogResult.error) throw blogResult.error;
      
      // Filter events to show recent past events (within last 7 days) and future events
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const filteredEvents = (eventsResult.data || []).filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= sevenDaysAgo;
      });
      
      // Transform events to include type and display_date
      const transformedEvents: ContentItem[] = filteredEvents.map(event => ({
        ...event,
        type: 'event' as const,
        display_date: event.date
      }));
      
      // Transform blog posts to include type and display_date
      const transformedBlogPosts: ContentItem[] = (blogResult.data || []).map(post => ({
        ...post,
        type: 'blog' as const,
        display_date: post.created_at.split('T')[0] // Convert to date format
      }));
      
      // Combine and sort: upcoming events first, then by date
      const combined = [...transformedEvents, ...transformedBlogPosts];
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Sort to prioritize upcoming events, then recent content
      combined.sort((a, b) => {
        const aDate = new Date(a.display_date);
        const bDate = new Date(b.display_date);
        
        const aIsUpcoming = a.type === 'event' && a.display_date >= today;
        const bIsUpcoming = b.type === 'event' && b.display_date >= today;
        
        // Upcoming events first
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
        
        // If both are upcoming events or both are past content, sort by date
        if (aIsUpcoming && bIsUpcoming) {
          return aDate.getTime() - bDate.getTime(); // Upcoming events: earliest first
        } else {
          return bDate.getTime() - aDate.getTime(); // Past content: most recent first
        }
      });
      
      setContent(combined);
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NewsEventsHero />

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest News & Upcoming Events</h2>
            <NewsEventsFilters filter={filter} onFilterChange={setFilter} />
          </div>
          
          <NewsEventsGrid 
            content={content} 
            loading={loading} 
            displayContent={content} 
          />
        </div>
      </div>

      <NewsEventsGuidelines />
    </Layout>
  );
};

export default NewsEvents;

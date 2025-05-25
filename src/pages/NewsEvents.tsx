
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, FileText } from "lucide-react";
import { getImageUrl, getContentTypeLabel, getFallbackContent } from "@/utils/newsEventsUtils";
import { ContentItem } from "@/types/newsEvents";

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
          console.log('Events updated on News & Events page, refetching...');
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
          console.log('Blog content updated on News & Events page, refetching...');
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
      
      console.log('Fetched events:', eventsResult.data);
      console.log('Fetched blog posts:', blogResult.data);
      
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
      // Show fallback events if database fetch fails
      setContent(getFallbackContent());
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM do, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getContentIcon = (item: ContentItem) => {
    return item.type === 'event' ? Calendar : FileText;
  };

  const displayContent = content.length > 0 ? content : getFallbackContent();
  
  // Streamlined categories relevant to HOA community
  const categories = [
    { id: "all", name: "All Content" },
    { id: "community", name: "Community" },
    { id: "social", name: "Social" },
    { id: "meeting", name: "Meetings" },
    { id: "holiday", name: "Holiday" },
    { id: "announcements", name: "Announcements" },
    { id: "news", name: "News" },
    { id: "maintenance", name: "Maintenance" }
  ];

  return (
    <Layout>
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">News & Events</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Stay connected with community events, announcements, and the latest news
          </p>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {content.length > 0 ? 'Latest News & Upcoming Events' : 'Sample Content'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === category.id 
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {content.length === 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>Note:</strong> No content found in the database. The items below are sample data. 
                <a href="/admin/events" className="underline ml-1">Create events</a> or 
                <a href="/admin/content" className="underline ml-1"> blog posts</a> to see them here.
              </p>
            </div>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardHeader className="h-24 space-y-2">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayContent.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl font-medium text-gray-600">No content found</p>
              <p className="mt-2 text-gray-500">Check back later for new updates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayContent.map((item) => {
                const imageUrl = getImageUrl(
                  item.type === 'event' ? item.image_path : item.featured_image
                );
                const ContentIcon = getContentIcon(item);
                
                return (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={item.title || 'Content image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.log('Image failed to load, replacing with placeholder:', imageUrl);
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <div class="h-16 w-16 text-gray-400 flex items-center justify-center">
                                    ${item.type === 'event' ? '📅' : '📄'}
                                  </div>
                                </div>
                              `;
                            }
                          }}
                          onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ContentIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.type === 'event' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {getContentTypeLabel(item)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{formatDate(item.display_date)}</p>
                        {item.type === 'event' && (
                          <>
                            <p>{item.time}</p>
                            <p>{item.location}</p>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">
                        {item.type === 'event' ? item.description : item.content?.replace(/<[^>]*>/g, '') || ''}
                      </p>
                      {item.category && (
                        <div className="mt-4">
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Community Guidelines</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Event Registration</h3>
                <p className="text-gray-600">
                  Most events require advance registration through the resident portal. 
                  Sign up early as space may be limited for certain activities.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Guest Policy</h3>
                <p className="text-gray-600">
                  Residents are welcome to bring guests to most community events. 
                  Please check individual event details for guest policies and fees.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Weather & Updates</h3>
                <p className="text-gray-600">
                  Outdoor events may be rescheduled due to inclement weather. 
                  Check this page regularly for the latest announcements and updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsEvents;

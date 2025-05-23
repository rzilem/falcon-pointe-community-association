
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_path: string | null;
  category: string | null;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  useEffect(() => {
    fetchEvents();
  }, [filter]);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      let query = supabase.from('events').select('*').order('date', { ascending: true });
      
      if (filter !== "all") {
        query = query.eq('category', filter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Only show future events or recent past events (within last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const filteredEvents = (data || []).filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= sevenDaysAgo;
      });
      
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
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

  // Fallback events in case none are found in the database
  const fallbackEvents = [
    {
      id: "1",
      title: "Summer Pool Party",
      date: "2025-07-04",
      time: "2:00 PM - 6:00 PM",
      location: "Main Pool",
      description: "Join us for our annual summer celebration with food, games, and pool activities.",
      image_path: "/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png",
      category: "social"
    },
    {
      id: "2",
      title: "Tennis Tournament",
      date: "2025-08-15",
      time: "9:00 AM - 5:00 PM",
      location: "Tennis Courts",
      description: "Community tennis tournament for all skill levels. Sign up at the amenity center.",
      image_path: "/lovable-uploads/4c2a90e2-ed6a-4fd9-9929-d876a2684ba8.png",
      category: "sport"
    },
    {
      id: "3",
      title: "Fall Festival",
      date: "2025-10-23",
      time: "3:00 PM - 8:00 PM",
      location: "Community Park",
      description: "Annual fall celebration with hayrides, pumpkin decorating, and food trucks.",
      image_path: "/lovable-uploads/1e3c41bc-f71c-4013-957d-4fa60e414905.png",
      category: "community"
    }
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;
  
  const categories = [
    { id: "all", name: "All Events" },
    { id: "community", name: "Community" },
    { id: "social", name: "Social" },
    { id: "sport", name: "Sports" },
    { id: "meeting", name: "Meetings" },
    { id: "holiday", name: "Holiday" },
    { id: "other", name: "Other" }
  ];

  return (
    <Layout>
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Community Events</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Stay connected with your neighbors through our exciting community events
          </p>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
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
          ) : displayEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl font-medium text-gray-600">No upcoming events found</p>
              <p className="mt-2 text-gray-500">Check back later for new events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    {event.image_path ? (
                      <img 
                        src={event.image_path} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{formatDate(event.date)}</p>
                      <p>{event.time}</p>
                      <p>{event.location}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{event.description}</p>
                    {event.category && (
                      <div className="mt-4">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Event Guidelines</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Registration</h3>
                <p className="text-gray-600">
                  Most events require advance registration through the resident portal. 
                  Sign up early as space may be limited for certain activities.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Guests</h3>
                <p className="text-gray-600">
                  Residents are welcome to bring guests to most community events. 
                  Please check individual event details for guest policies and fees.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Weather Policy</h3>
                <p className="text-gray-600">
                  Outdoor events may be rescheduled due to inclement weather. 
                  Check the resident portal or community newsletter for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Events;


import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
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
}

const EventsPreview = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .order('date', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback events in case none are found in the database
  const fallbackEvents = [
    {
      id: "1",
      title: "Summer Pool Party",
      date: "2025-06-15",
      time: "2:00 PM - 6:00 PM",
      location: "Main Community Pool",
      description: "Join us for our annual summer pool party with food, games, and fun for the whole family!",
      image_path: null
    },
    {
      id: "2",
      title: "Community Garage Sale",
      date: "2025-07-10",
      time: "8:00 AM - 4:00 PM",
      location: "Throughout Falcon Pointe",
      description: "Our semi-annual community-wide garage sale. Register your address by July 5th to be included on the map.",
      image_path: null
    },
    {
      id: "3",
      title: "Movie Night at the Park",
      date: "2025-07-24",
      time: "8:30 PM",
      location: "Central Park",
      description: "Bring blankets and chairs for an evening of family fun watching a popular animated movie under the stars.",
      image_path: null
    }
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Upcoming Community Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with your neighbors through our various community events and activities. There's always something happening at Falcon Pointe!
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
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
            {displayEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{event.title}</CardTitle>
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <CardDescription className="font-medium text-primary">{formatDate(event.date)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Time:</strong> {event.time}</p>
                    <p className="text-sm"><strong>Location:</strong> {event.location}</p>
                    <p className="mt-4 text-gray-600">{event.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/events">Event Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;

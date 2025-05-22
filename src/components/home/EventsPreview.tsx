
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

const EventsPreview = () => {
  const { events, isLoading, error } = useEvents({ 
    limit: 3,
    futureOnly: true 
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Upcoming Community Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with your neighbors through our various community events and activities. There's always something happening at Falcon Pointe!
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mb-6">
            <p>Unable to load events. Please try again later.</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center mb-6">
            <p>No upcoming events scheduled. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => {
              // Format date for display
              const eventDate = new Date(event.date);
              const formattedDate = format(eventDate, "MMMM d, yyyy");
              
              return (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{event.title}</CardTitle>
                      <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <CardDescription className="font-medium text-primary">{formattedDate}</CardDescription>
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
              );
            })}
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

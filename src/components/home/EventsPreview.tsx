
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const upcomingEvents = [
  {
    title: "Summer Pool Party",
    date: "June 15, 2025",
    time: "2:00 PM - 6:00 PM",
    location: "Main Community Pool",
    description: "Join us for our annual summer pool party with food, games, and fun for the whole family!"
  },
  {
    title: "Community Garage Sale",
    date: "July 10-11, 2025",
    time: "8:00 AM - 4:00 PM",
    location: "Throughout Falcon Pointe",
    description: "Our semi-annual community-wide garage sale. Register your address by July 5th to be included on the map."
  },
  {
    title: "Movie Night at the Park",
    date: "July 24, 2025",
    time: "8:30 PM",
    location: "Central Park",
    description: "Bring blankets and chairs for an evening of family fun watching a popular animated movie under the stars."
  }
];

const EventsPreview = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Upcoming Community Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with your neighbors through our various community events and activities. There's always something happening at Falcon Pointe!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{event.title}</CardTitle>
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <CardDescription className="font-medium text-primary">{event.date}</CardDescription>
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

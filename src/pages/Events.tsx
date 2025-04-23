
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Events = () => {
  const upcomingEvents = [
    {
      title: "Summer Pool Party",
      date: "July 4th, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Main Pool",
      description: "Join us for our annual summer celebration with food, games, and pool activities.",
      image: "/public/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png"
    },
    {
      title: "Tennis Tournament",
      date: "August 15th, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Tennis Courts",
      description: "Community tennis tournament for all skill levels. Sign up at the amenity center.",
      image: "/public/lovable-uploads/4c2a90e2-ed6a-4fd9-9929-d876a2684ba8.png"
    },
    {
      title: "Fall Festival",
      date: "October 23rd, 2025",
      time: "3:00 PM - 8:00 PM",
      location: "Community Park",
      description: "Annual fall celebration with hayrides, pumpkin decorating, and food trucks.",
      image: "/public/lovable-uploads/1e3c41bc-f71c-4013-957d-4fa60e414905.png"
    }
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
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{event.date}</p>
                    <p>{event.time}</p>
                    <p>{event.location}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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

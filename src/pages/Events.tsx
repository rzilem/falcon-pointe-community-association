
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, ListFilter } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";
import EventCalendar from "@/components/events/EventCalendar";
import ImageDisplay from "@/components/cms/ImageDisplay";

const Events = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Fetch all upcoming events
  const { events, isLoading, error } = useEvents({ 
    futureOnly: true,
    ...(selectedDate && { 
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      endDate: format(selectedDate, 'yyyy-MM-dd')
    })
  });

  return (
    <Layout>
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <CalendarDays className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Community Events</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Stay connected with your neighbors through our exciting community events
          </p>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="list" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">
                  <p>Failed to load events. Please try again later.</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No upcoming events found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => {
                    const eventDate = new Date(event.date);
                    const formattedDate = format(eventDate, "MMMM d, yyyy");
                    
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          {event.url ? (
                            <img 
                              src={event.url} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <ImageDisplay 
                              location="events"
                              fallbackSrc="/placeholder.svg"
                              className="w-full h-full object-cover"
                              alt="Event"
                            />
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle>{event.title}</CardTitle>
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">{formattedDate}</p>
                            <p>{event.time}</p>
                            <p>{event.location}</p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{event.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-6">
              <EventCalendar 
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  if (activeTab === "calendar") {
                    setActiveTab("list");
                  }
                }}
              />
            </TabsContent>
          </Tabs>

          <div className="max-w-3xl mx-auto mt-16">
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

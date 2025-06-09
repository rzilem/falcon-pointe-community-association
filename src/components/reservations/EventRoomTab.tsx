
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { CheckCircle, Users, Calendar } from "lucide-react";

const EventRoomTab = () => {
  const openIndoorRoom = () => {
    const popup = window.open(
      'https://psprop.net/gfembed/?f=37', 
      'indoorEventRoomReservation', 
      'width=800,height=600,scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no,status=no'
    );
    
    if (!popup) {
      // Fallback if popup is blocked
      alert('Please allow popups for this site to open the reservation form, or visit the form directly at: https://psprop.net/gfembed/?f=37');
      return;
    }
    
    // Focus the popup window
    popup.focus();
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Enhanced Info Section */}
          <div className="p-4 md:p-6 bg-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section */}
              <div className="w-full md:w-2/5">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                  <ImageDisplay 
                    location="event-room" 
                    fallbackSrc="https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg" 
                    alt="Indoor Gathering Room" 
                    className="w-full h-64 md:h-72 object-cover hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
              </div>
              
              {/* Content Section */}
              <div className="w-full md:w-3/5">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">Indoor Gathering Room</h2>
                  <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    <Users className="h-4 w-4 mr-1" /> 
                    <span>Capacity: 50 people</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">
                  Our climate-controlled event room is perfect for meetings and gatherings year-round,
                  with flexible setup options and amenities for your convenience.
                </p>
                
                <Separator className="my-4" />
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-b-0">
                    <AccordionTrigger className="text-base font-medium py-2 hover:text-primary">Amenity Details</AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Tables and chairs for flexible setup</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Kitchen area with sink and refrigerator</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Projector and screen available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Climate controlled environment</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="guidelines" className="border-t pt-2">
                    <AccordionTrigger className="text-base font-medium py-2 hover:text-primary">Reservation Guidelines</AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="space-y-2 text-sm">
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>Reservations must be made at least 7 days in advance</li>
                          <li>Residents must be in good standing with HOA dues</li>
                          <li>Indoor Gathering Room: $100.00 reservation fee</li>
                          <li>The resident making the reservation must be present throughout the event</li>
                          <li>All community rules apply during reserved events</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
          
          {/* Reservation Call-to-Action */}
          <Card className="border-0 rounded-none">
            <CardContent className="p-6 md:p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Ready to Reserve?</h3>
                <p className="text-gray-600 mb-6">
                  Complete your Indoor Gathering Room reservation using our calendar form. A new window will open for your convenience.
                </p>
                <Button 
                  size="lg" 
                  className="w-full md:w-auto px-8 py-3 text-lg font-medium bg-primary hover:bg-primary/90 transition-colors"
                  onClick={openIndoorRoom}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  🏠 Reserve Indoor Gathering Room
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Opens in a new window - please allow popups for this site
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventRoomTab;

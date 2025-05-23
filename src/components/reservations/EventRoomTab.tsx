
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ImageDisplay from "@/components/cms/ImageDisplay";

const EventRoomTab = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Info Section - More Compact Design */}
          <div className="p-2 md:p-3 bg-white border-b border-gray-100 flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-1/3">
              <ImageDisplay 
                location="event-room" 
                fallbackSrc="https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg" 
                alt="Indoor Event Room" 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-bold mb-1">Indoor Event Room</h2>
              <p className="text-gray-600 mb-2 text-sm">
                Our climate-controlled event room is perfect for meetings and gatherings year-round,
                with flexible setup options and amenities for your convenience.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-base font-medium py-1">Amenity Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Tables and chairs for flexible setup</li>
                        <li>Kitchen area with sink and refrigerator</li>
                        <li>Projector and screen available</li>
                        <li>Capacity for up to 50 people</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="guidelines">
                  <AccordionTrigger className="text-base font-medium py-1">Reservation Guidelines</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 text-sm">
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Reservations must be made at least 7 days in advance</li>
                        <li>Residents must be in good standing with HOA dues</li>
                        <li>A refundable cleaning deposit may be required</li>
                        <li>The resident making the reservation must be present throughout the event</li>
                        <li>All community rules apply during reserved events</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Calendar - Full Width with increased height */}
          <div className="bg-white calendly-container" style={{ height: 'calc(80vh + 500px)', minHeight: '1150px' }}>
            <div className="calendly-inline-widget calendly-event-room" 
              data-url="https://calendly.com/falconpointe/30min?hide_gdpr_banner=1" 
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "block",
                padding: "0px",
                margin: "0px"
              }}>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventRoomTab;

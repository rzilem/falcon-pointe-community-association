
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ImageDisplay from "@/components/cms/ImageDisplay";

const PoolPavilionTab = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Info Section - Compact Design */}
          <div className="p-4 md:p-6 bg-white border-b border-gray-100 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <ImageDisplay 
                location="pool-pavilion" 
                fallbackSrc="/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png" 
                alt="Pool Pavilion" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">Pool Pavilion</h2>
              <p className="text-gray-600 mb-3">
                The Pool Pavilion offers a covered outdoor space perfect for summer gatherings, 
                featuring seating areas, access to the pool, and outdoor grills.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-base font-medium py-2">Amenity Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Covered seating area</li>
                        <li>Access to pool area</li>
                        <li>Outdoor grills available</li>
                        <li>Capacity for up to 30 people</li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Note:</strong> Reserving the pavilion does not provide exclusive access to the pool, 
                        which remains open to all residents during normal hours.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="guidelines">
                  <AccordionTrigger className="text-base font-medium py-2">Reservation Guidelines</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
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
          <div className="bg-white" style={{ height: 'calc(80vh - 50px)', minHeight: '600px' }}>
            <div className="calendly-inline-widget calendly-pool-pavilion" 
              data-url="https://calendly.com/falconpointe/pool-pavilion?hide_gdpr_banner=1" 
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "block"
              }}>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolPavilionTab;

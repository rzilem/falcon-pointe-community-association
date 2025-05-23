
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ImageDisplay from "@/components/cms/ImageDisplay";
import ContentDisplay from "@/components/cms/ContentDisplay";
import { Button } from "@/components/ui/button";
import CalendlyScript from "@/components/reservations/CalendlyScript";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Calendar, Users } from "lucide-react";

const Reservations = () => {
  // Track active tab to help with Calendly reinitialization
  const [activeTab, setActiveTab] = useState<string>("pool-pavilion");

  // Effect to handle Calendly visibility when tabs change
  useEffect(() => {
    // Force redraw of Calendly widgets when tab changes
    const activeWidget = document.querySelector(`.calendly-${activeTab}`);
    if (activeWidget) {
      activeWidget.classList.add('calendly-active');
    }
  }, [activeTab]);

  return <Layout>
      <CalendlyScript />
      
      {/* Hero Section */}
      <div className="relative h-[200px] md:h-[250px] bg-cover bg-center">
        <ImageDisplay 
          location="reservations-banner" 
          fallbackSrc="/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png" 
          alt="Reservations Banner" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Amenity Reservations</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Reserve the Pool Pavilion or Indoor Event Room for your next gathering
            </p>
          </div>
        </div>
      </div>

      {/* Reservations Content */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <ContentDisplay 
              section="reservations-info" 
              fallbackTitle="Reserve Our Community Spaces" 
              fallbackContent={
                <p className="text-gray-600">
                  Falcon Pointe offers two beautiful spaces that can be reserved for private events. 
                  Whether you're planning a birthday party, family gathering, or community meeting, 
                  our amenities provide the perfect setting.
                </p>
              } 
            />
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs 
              defaultValue="pool-pavilion" 
              className="w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger 
                  value="pool-pavilion" 
                  className="text-xl font-semibold py-4 flex gap-2 items-center"
                >
                  <Users className="h-5 w-5" /> 
                  <span>Pool Pavilion</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="event-room" 
                  className="text-xl font-semibold py-4 flex gap-2 items-center"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Indoor Event Room</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pool-pavilion">
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
              </TabsContent>
              
              <TabsContent value="event-room">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      {/* Info Section - Compact Design */}
                      <div className="p-4 md:p-6 bg-white border-b border-gray-100 flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3">
                          <ImageDisplay 
                            location="event-room" 
                            fallbackSrc="https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg" 
                            alt="Indoor Event Room" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="w-full md:w-2/3">
                          <h2 className="text-2xl font-bold mb-2">Indoor Event Room</h2>
                          <p className="text-gray-600 mb-3">
                            Our climate-controlled event room is perfect for meetings and gatherings year-round,
                            with flexible setup options and amenities for your convenience.
                          </p>
                          
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details">
                              <AccordionTrigger className="text-base font-medium py-2">Amenity Details</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 text-sm">
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
                        <div className="calendly-inline-widget calendly-event-room" 
                          data-url="https://calendly.com/falconpointe/30min?hide_gdpr_banner=1" 
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add custom styles to ensure Calendly displays correctly */}
      <style jsx global>{`
        .calendly-inline-widget iframe {
          height: 100% !important;
          min-height: 600px !important;
        }
        
        /* Ensure Calendly doesn't add scrollbars */
        .calendly-badge-widget {
          margin-bottom: 0 !important;
        }
      `}</style>
    </Layout>;
};

export default Reservations;

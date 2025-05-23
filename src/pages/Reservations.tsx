
import React, { useState } from "react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const Reservations = () => {
  const [openDetails, setOpenDetails] = useState<{[key: string]: boolean}>({
    'pool-pavilion': false,
    'event-room': false
  });

  const toggleDetails = (section: string) => {
    setOpenDetails({
      ...openDetails,
      [section]: !openDetails[section]
    });
  };

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
                  our amenities provide the perfect setting. Please review the reservation guidelines 
                  before booking.
                </p>
              } 
            />
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="pool-pavilion" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="pool-pavilion">Pool Pavilion</TabsTrigger>
                <TabsTrigger value="event-room">Indoor Event Room</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pool-pavilion">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Left Column - Information */}
                      <div className="w-full md:w-1/3 p-4 bg-white border-r border-gray-100">
                        <div className="sticky top-4">
                          <h2 className="text-2xl font-bold mb-3">Pool Pavilion</h2>
                          <ImageDisplay 
                            location="pool-pavilion" 
                            fallbackSrc="/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png" 
                            alt="Pool Pavilion" 
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details">
                              <AccordionTrigger className="py-3">About the Pool Pavilion</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 text-sm">
                                  <p>The Pool Pavilion offers a covered outdoor space perfect for summer gatherings. It features:</p>
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
                              <AccordionTrigger className="py-3">Reservation Guidelines</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 text-sm">
                                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    <li>Reservations must be made at least 7 days in advance.</li>
                                    <li>Residents must be in good standing with HOA dues.</li>
                                    <li>A refundable cleaning deposit may be required.</li>
                                    <li>The resident making the reservation must be present throughout the event.</li>
                                  </ul>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                      
                      {/* Right Column - Calendar */}
                      <div className="w-full md:w-2/3 bg-white">
                        <div className="calendly-inline-widget" 
                          data-url="https://calendly.com/falconpointe/pool-pavilion?hide_gdpr_banner=1" 
                          style={{
                            minWidth: "320px",
                            height: "700px"
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
                    <div className="flex flex-col md:flex-row">
                      {/* Left Column - Information */}
                      <div className="w-full md:w-1/3 p-4 bg-white border-r border-gray-100">
                        <div className="sticky top-4">
                          <h2 className="text-2xl font-bold mb-3">Indoor Event Room</h2>
                          <ImageDisplay 
                            location="event-room" 
                            fallbackSrc="https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg" 
                            alt="Indoor Event Room" 
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details">
                              <AccordionTrigger className="py-3">About the Event Room</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 text-sm">
                                  <p>Our climate-controlled event room is perfect for meetings and gatherings year-round. It includes:</p>
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
                              <AccordionTrigger className="py-3">Reservation Guidelines</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 text-sm">
                                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    <li>Reservations must be made at least 7 days in advance.</li>
                                    <li>Residents must be in good standing with HOA dues.</li>
                                    <li>A refundable cleaning deposit may be required.</li>
                                    <li>The resident making the reservation must be present throughout the event.</li>
                                  </ul>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                      
                      {/* Right Column - Calendar */}
                      <div className="w-full md:w-2/3 bg-white">
                        <div className="calendly-inline-widget" 
                          data-url="https://calendly.com/falconpointe/30min?hide_gdpr_banner=1" 
                          style={{
                            minWidth: "320px",
                            height: "700px"
                          }}>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Collapsible className="mt-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Additional Reservation Guidelines</h3>
                <CollapsibleTrigger className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <span>View {openDetails['guidelines'] ? 'Less' : 'More'}</span>
                  <ChevronDown className={`h-4 w-4 ml-1 transform ${openDetails['guidelines'] ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="mt-2">
                <ContentDisplay 
                  section="reservation-guidelines" 
                  fallbackContent={
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li>Reservations must be made at least 7 days in advance.</li>
                      <li>Residents must be in good standing with HOA dues to reserve amenities.</li>
                      <li>A refundable cleaning deposit may be required depending on the event type.</li>
                      <li>The resident making the reservation must be present during the entire event.</li>
                      <li>All community rules and regulations apply during reserved events.</li>
                      <li>Cancellations must be made at least 48 hours in advance.</li>
                    </ul>
                  } 
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </Layout>;
};

export default Reservations;

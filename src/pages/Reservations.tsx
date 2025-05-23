
import React from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageDisplay from "@/components/cms/ImageDisplay";
import ContentDisplay from "@/components/cms/ContentDisplay";
import { Button } from "@/components/ui/button";
import CalendlyScript from "@/components/reservations/CalendlyScript";

const Reservations = () => {
  return (
    <Layout>
      <CalendlyScript />
      
      {/* Hero Section */}
      <div className="relative h-[250px] bg-cover bg-center">
        <ImageDisplay 
          location="reservations-banner" 
          fallbackSrc="/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png"
          alt="Reservations Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Amenity Reservations</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Reserve the Pool Pavilion or Indoor Event Room for your next gathering
            </p>
          </div>
        </div>
      </div>

      {/* Reservations Content */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-8">
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

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="pool-pavilion" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pool-pavilion">Pool Pavilion</TabsTrigger>
                <TabsTrigger value="event-room">Indoor Event Room</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pool-pavilion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pool Pavilion Reservation</CardTitle>
                    <CardDescription>
                      Reserve our outdoor pavilion area near the pool for your next gathering
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <ImageDisplay
                          location="pool-pavilion"
                          fallbackSrc="/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png"
                          alt="Pool Pavilion"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <ContentDisplay
                          section="pool-pavilion-info"
                          fallbackContent={
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">About the Pool Pavilion</h3>
                              <p>The Pool Pavilion offers a covered outdoor space perfect for summer gatherings. It features:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Covered seating area</li>
                                <li>Access to pool area</li>
                                <li>Outdoor grills available</li>
                                <li>Capacity for up to 30 people</li>
                              </ul>
                              <p className="text-sm text-gray-500 mt-4">
                                <strong>Note:</strong> Reserving the pavilion does not provide exclusive access to the pool, 
                                which remains open to all residents during normal hours.
                              </p>
                            </div>
                          }
                        />
                      </div>
                      <div className="h-[700px]">
                        <div className="calendly-inline-widget" data-url="https://calendly.com/falconpointe/pool-pavilion?hide_gdpr_banner=1" style={{ minWidth: "320px", height: "700px" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="event-room" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Indoor Event Room Reservation</CardTitle>
                    <CardDescription>
                      Reserve our spacious indoor event room for meetings and gatherings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <ImageDisplay
                          location="event-room"
                          fallbackSrc="https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg"
                          alt="Indoor Event Room"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <ContentDisplay
                          section="event-room-info"
                          fallbackContent={
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">About the Indoor Event Room</h3>
                              <p>Our climate-controlled event room is perfect for meetings and gatherings year-round. It includes:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Tables and chairs for flexible setup</li>
                                <li>Kitchen area with sink and refrigerator</li>
                                <li>Projector and screen available</li>
                                <li>Capacity for up to 50 people</li>
                              </ul>
                              <p className="text-sm text-gray-500 mt-4">
                                <strong>Deposit Required:</strong> A refundable deposit of $100 is required for all event room reservations.
                              </p>
                            </div>
                          }
                        />
                      </div>
                      <div className="h-[700px]">
                        <div className="calendly-inline-widget" data-url="https://calendly.com/falconpointe/30min?hide_gdpr_banner=1" style={{ minWidth: "320px", height: "700px" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Reservation Guidelines</h3>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reservations;

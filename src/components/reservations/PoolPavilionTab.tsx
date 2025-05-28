import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { CheckCircle, Info, Users, ExternalLink } from "lucide-react";

const PoolPavilionTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log('Pool Pavilion full page loaded');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Pool Pavilion full page error');
  };

  // Set a timeout to show error if iframe doesn't load within 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
        console.warn('Pool Pavilion iframe timed out');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const reservationUrl = "https://psprop.net/falcon-pointe-pool-pavilion-reservation/";

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Enhanced Info Section */}
          <div className="p-4 md:p-6 bg-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section - Larger and With Border */}
              <div className="w-full md:w-2/5">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                  <ImageDisplay 
                    location="pool-pavilion" 
                    fallbackSrc="/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png" 
                    alt="Pool Pavilion" 
                    className="w-full h-64 md:h-72 object-cover hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
                <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100 flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" /> 
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Note:</span> Reserving the pavilion does not provide exclusive access to the pool, 
                    which remains open to all residents during normal hours.
                  </p>
                </div>
              </div>
              
              {/* Content Section - More Structured */}
              <div className="w-full md:w-3/5">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">Pool Pavilion</h2>
                  <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    <Users className="h-4 w-4 mr-1" /> 
                    <span>Capacity: 30 people</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">
                  The Pool Pavilion offers a covered outdoor space perfect for summer gatherings, 
                  featuring seating areas, access to the pool, and outdoor grills.
                </p>
                
                <Separator className="my-4" />
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-b-0">
                    <AccordionTrigger className="text-base font-medium py-2 hover:text-primary">Amenity Details</AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Covered seating area</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Access to pool area</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Outdoor grills available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Restroom facilities</span>
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
          </div>
          
          {/* Reservation Section with Better Error Handling */}
          <Card className="border-0 rounded-none">
            <CardContent className="p-0">
              <div className="w-full">
                {isLoading && (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading reservation page...</p>
                      <p className="mt-1 text-xs text-gray-500">This may take a moment to load</p>
                    </div>
                  </div>
                )}
                
                {hasError && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 m-4">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-blue-800 mb-3">Pool Pavilion Reservation</h3>
                      <p className="text-blue-700 mb-4">
                        Click the button below to access the reservation form:
                      </p>
                      <a 
                        href={reservationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Make Reservation
                      </a>
                      <p className="mt-3 text-sm text-blue-600">
                        The form will open in a new window
                      </p>
                    </div>
                  </div>
                )}
                
                <iframe 
                  src={reservationUrl}
                  width="100%" 
                  height="800" 
                  frameBorder="0" 
                  className="w-full"
                  title="Pool Pavilion Reservation Page"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation allow-downloads"
                  allow="payment; geolocation; camera; microphone; autoplay"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{
                    width: "100%",
                    height: "800px",
                    border: "none",
                    display: isLoading || hasError ? 'none' : 'block',
                    minHeight: "800px"
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolPavilionTab;
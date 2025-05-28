
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { CheckCircle, Users } from "lucide-react";
import "@/components/contact/GravityFormBase.css";
import "@/components/contact/GravityFormFields.css";
import "@/components/contact/GravityFormCalendar.css";
import "@/components/contact/GravityFormResponsive.css";

const EventRoomTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Load Gravity Forms script
    const script = document.createElement('script');
    script.src = 'https://psprop.net/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      console.log('Gravity Forms script loaded for Event Room');
    };
    
    if (!document.head.querySelector(`script[src="${script.src}"]`)) {
      document.head.appendChild(script);
    }
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log('Event Room iframe loaded (Form 36)');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Event Room iframe error (Form 36)');
  };

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
                    location="event-room" 
                    fallbackSrc="https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg" 
                    alt="Indoor Event Room" 
                    className="w-full h-64 md:h-72 object-cover hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
              </div>
              
              {/* Content Section - More Structured */}
              <div className="w-full md:w-3/5">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">Indoor Event Room</h2>
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
          
          {/* Enhanced Reservation Form Section with HTTPS URL */}
          <Card className="gravity-form-card border-0 rounded-none">
            <CardContent className="p-6 md:p-8">
              <div className="w-full gravity-form-container">
                {isLoading && (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading reservation form...</p>
                    </div>
                  </div>
                )}
                
                {hasError && (
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-red-800">Unable to load reservation form. Please refresh the page or contact the office.</p>
                  </div>
                )}
                
                <iframe 
                  src="https://psprop.net/gfembed/?f=36" 
                  width="100%" 
                  height="500" 
                  frameBorder="0" 
                  className="gfiframe calendar-iframe"
                  title="Indoor Event Room Reservation Form"
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals allow-top-navigation-by-user-activation allow-downloads"
                  allow="fullscreen; geolocation; camera; microphone"
                  loading="lazy"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  style={{
                    width: "100%",
                    height: "500px",
                    border: "none",
                    display: isLoading || hasError ? 'none' : 'block',
                    minHeight: "500px"
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

export default EventRoomTab;

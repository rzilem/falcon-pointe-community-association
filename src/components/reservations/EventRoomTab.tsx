
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { CheckCircle, Users, AlertCircle } from "lucide-react";

const EventRoomTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Load Gravity Forms embed script with timeout
    const script = document.createElement('script');
    script.src = 'https://psprop.net/wp-content/plugins/gravityforms/js/gfembed.min.js';
    script.async = true;
    
    const timeout = setTimeout(() => {
      console.warn('Gravity Forms script loading timeout');
      setHasError(true);
      setIsLoading(false);
    }, 10000); // 10 second timeout
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log('Gravity Forms embed script loaded');
    };
    
    script.onerror = () => {
      clearTimeout(timeout);
      console.error('Failed to load Gravity Forms embed script');
      setHasError(true);
      setIsLoading(false);
    };
    
    document.head.appendChild(script);
    
    return () => {
      clearTimeout(timeout);
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://psprop.net/wp-content/plugins/gravityforms/js/gfembed.min.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  return (
    <div className="space-y-6">
      {/* Enhanced Info Section */}
      <div className="px-2 md:px-4">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-4 md:p-6 bg-white">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Section */}
              <div className="w-full lg:w-2/5">
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
              <div className="w-full lg:w-3/5">
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
          </CardContent>
        </Card>
      </div>
      
      {/* Full Page Embed - Full Width Section */}
      <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg overflow-hidden shadow-lg">
        <div className="text-center py-6 px-4">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Indoor Gathering Room Reservation</h3>
          <p className="text-gray-600 mb-4">
            Complete your reservation using the form below.
          </p>
          <div className="mb-4">
            <a 
              href="https://psprop.net/falcon-pointe-indoor-gathering-room-reservation/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              aria-label="Open Indoor Gathering Room reservation form in new tab"
            >
              Having trouble viewing the form? Open in new tab
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        <div className="w-full pb-6 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Loading reservation form...</span>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Form temporarily unavailable</span>
              </div>
              <p className="text-sm text-orange-600">
                Please use the "Open in new tab" button above to access the reservation form directly.
              </p>
            </div>
          )}
          
          <iframe 
            src="https://psprop.net/gfembed/?f=38" 
            width="100%" 
            height="1200" 
            frameBorder="0" 
            className={`w-full rounded-lg bg-white shadow-inner mx-auto block transition-opacity duration-300 ${hasError ? 'opacity-50' : 'opacity-100'}`}
            title="Indoor Gathering Room Reservation Form - Book your event room rental online"
            style={{ minWidth: '100%', maxWidth: '100%' }}
            aria-label="Indoor gathering room reservation booking form"
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
};

export default EventRoomTab;

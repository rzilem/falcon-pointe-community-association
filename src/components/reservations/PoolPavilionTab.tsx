import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import TwoImageSlideshow from "@/components/ui/TwoImageSlideshow";
import { CheckCircle, Info, Users, AlertCircle } from "lucide-react";

const PoolPavilionTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Load Gravity Forms embed script
    const script = document.createElement('script');
    script.src = '//psprop.net/wp-content/plugins/gravityforms/js/gfembed.min.js';
    script.async = true;
    script.onload = () => {
      console.log('Gravity Forms embed script loaded');
    };
    script.onerror = () => {
      console.error('Failed to load Gravity Forms embed script');
      setHasError(true);
      setIsLoading(false);
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="//psprop.net/wp-content/plugins/gravityforms/js/gfembed.min.js"]');
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
      {/* Enhanced Info Section - Keep existing padding */}
      <div className="px-2 md:px-4">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-4 md:p-6 bg-white">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Section */}
              <div className="w-full lg:w-2/5">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                  <TwoImageSlideshow
                    image1={{
                      src: "/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png",
                      alt: "Pool Pavilion covered seating area with outdoor grills"
                    }}
                    image2={{
                      src: "/lovable-uploads/6c2a5abb-a4c0-42a6-b7e0-39f8bbfdbf83.png",
                      alt: "Pool Pavilion showing pool access and amenities"
                    }}
                    className="h-64 md:h-72 hover:scale-105 transition-transform duration-1000"
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
              
              {/* Content Section */}
              <div className="w-full lg:w-3/5">
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
                          <li>Pool Pavilion: $75.00 reservation fee</li>
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
      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden shadow-lg">
        <div className="text-center py-6 px-4">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Pool Pavilion Reservation</h3>
          <p className="text-gray-600 mb-4">
            Complete your reservation using the form below.
          </p>
          <div className="mb-4">
            <a 
              href="https://psprop.net/falcon-pointe-pool-pavilion-reservation/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              aria-label="Open Pool Pavilion reservation form in new tab"
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
            src="//psprop.net/gfembed/?f=36" 
            width="100%" 
            height="1200" 
            frameBorder="0" 
            className={`w-full rounded-lg bg-white shadow-inner mx-auto block transition-opacity duration-300 ${hasError ? 'opacity-50' : 'opacity-100'}`}
            title="Pool Pavilion Reservation Form - Book your pool pavilion rental online"
            style={{ minWidth: '100%', maxWidth: '100%' }}
            aria-label="Pool pavilion reservation booking form"
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      </div>
    </div>
  );
};

export default PoolPavilionTab;

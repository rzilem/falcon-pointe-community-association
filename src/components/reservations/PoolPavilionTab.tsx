import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import TwoImageSlideshow from "@/components/ui/TwoImageSlideshow";
import { CheckCircle, Info, Users, AlertCircle } from "lucide-react";
import "@/components/contact/GravityFormBase.css";
import "@/components/contact/GravityFormResponsive.css";
import "@/components/contact/GravityFormCalendar.css";
import "@/components/contact/GravityFormFullWidth.css";
import "@/components/contact/SSACalendarFullWidth.css";
const PoolPavilionTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    // Load Gravity Forms embed script with timeout
    const script = document.createElement('script');
    script.src = 'https://psprop.net/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js';
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
      const existingScript = document.querySelector('script[src="https://psprop.net/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js"]');
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
  return <div className="space-y-6">
      {/* Enhanced Info Section - Keep existing padding */}
      <div className="px-2 md:px-4">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-4 md:p-6 bg-white">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Section */}
              <div className="w-full lg:w-2/5">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                  <TwoImageSlideshow image1={{
                  src: "/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png",
                  alt: "Pool Pavilion covered seating area with outdoor grills"
                }} image2={{
                  src: "/lovable-uploads/6c2a5abb-a4c0-42a6-b7e0-39f8bbfdbf83.png",
                  alt: "Pool Pavilion showing pool access and amenities"
                }} className="h-64 md:h-72 hover:scale-105 transition-transform duration-1000" />
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
      
      {/* Full Width Iframe Section - Break out of container */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="w-full">
          <div className="container mx-auto px-4 md:px-6 py-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Pool Pavilion Reservation</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Complete your reservation using the form below. The form includes calendar functionality for date selection.
            </p>
            
          </div>
          
          <div className="w-full flex justify-center overflow-x-auto pb-8">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden relative" style={{
            minWidth: '1600px',
            width: '1600px'
          }}>
              {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-lg">Loading reservation form...</span>
                  </div>
                </div>}
              
              {hasError && <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 m-6">
                  <div className="flex items-center gap-3 text-orange-700 mb-3">
                    <AlertCircle className="h-6 w-6" />
                    <span className="font-semibold text-lg">Form temporarily unavailable</span>
                  </div>
                  <p className="text-orange-600">
                    Please use the "Open in new tab" button above to access the reservation form directly.
                  </p>
                </div>}
              
              <iframe src="https://psprop.net/falcon-pointe-pool-pavilion-reservation/" width="1600" height="1800" frameBorder="0" className={`w-full bg-white transition-opacity duration-300 ${hasError ? 'opacity-50' : 'opacity-100'}`} title="Pool Pavilion Reservation Form - Book your pool pavilion rental online" style={{
              minWidth: '1600px',
              width: '1600px',
              minHeight: '1800px'
            }} aria-label="Pool pavilion reservation booking form" loading="lazy" onLoad={handleIframeLoad} onError={handleIframeError} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals" allow="fullscreen" />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PoolPavilionTab;
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { CheckCircle, Users, ExternalLink, RefreshCw } from "lucide-react";

const EventRoomTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    console.log('SSA iframe loaded successfully');
    
    // Give SSA JavaScript time to initialize
    setTimeout(() => {
      setIsLoading(false);
      setHasError(false);
      
      // Optional: Try to communicate with the iframe to check if SSA initialized
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          // Check if SSA app initialized by looking for the booking app element
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const spinner = iframeDoc.querySelector('.ssa_booking_initial_spinner-container');
          if (spinner && spinner.style.display !== 'none') {
            console.warn('SSA app still showing spinner, may need more time');
            // Set another timeout to check again
            setTimeout(() => {
              const stillSpinning = iframeDoc.querySelector('.ssa_booking_initial_spinner-container');
              if (stillSpinning && stillSpinning.style.display !== 'none') {
                console.error('SSA app failed to initialize');
                setHasError(true);
              }
            }, 5000);
          }
        }
      } catch (e) {
        // Cross-origin restrictions may prevent this check
        console.log('Cannot check iframe content due to cross-origin restrictions');
      }
    }, 2000); // Give SSA 2 seconds to initialize
  };

  const handleIframeError = () => {
    console.error('SSA iframe failed to load');
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
    
    // Force iframe reload by changing src slightly
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      const separator = currentSrc.includes('?') ? '&' : '?';
      iframeRef.current.src = `${currentSrc}${separator}retry=${retryCount + 1}`;
    }
  };

  // Auto-timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('SSA iframe loading timed out');
        setIsLoading(false);
        setHasError(true);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timer);
  }, [isLoading, retryCount]);

  const reservationUrl = "https://psprop.net/falcon-pointe-indoor-event-room-reservation/";

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Enhanced Info Section */}
          <div className="p-4 md:p-6 bg-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section */}
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
              
              {/* Content Section */}
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
                          <li>Indoor Event Room: $100.00 reservation fee</li>
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
          
          {/* SSA Booking Section */}
          <Card className="border-0 rounded-none">
            <CardContent className="p-0">
              <div className="w-full relative">
                {isLoading && (
                  <div className="flex items-center justify-center h-96 bg-gray-50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading booking calendar...</p>
                      {retryCount > 0 && (
                        <p className="mt-1 text-xs text-gray-500">Attempt {retryCount + 1}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {hasError && (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 m-4">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-green-800 mb-3">Indoor Event Room Reservation</h3>
                      <p className="text-green-700 mb-4">
                        The booking calendar is having trouble loading. You can try refreshing or use the direct link:
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <button 
                          onClick={handleRetry}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Try Again
                        </button>
                        <a 
                          href={reservationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open in New Window
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                <iframe 
                  ref={iframeRef}
                  src={reservationUrl}
                  width="100%" 
                  height="900" 
                  frameBorder="0" 
                  className="w-full"
                  title="Indoor Event Room Reservation Calendar"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation allow-downloads allow-modals"
                  allow="payment; geolocation; camera; microphone; autoplay; fullscreen"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{
                    width: "100%",
                    height: "900px",
                    border: "none",
                    display: isLoading || hasError ? 'none' : 'block',
                    minHeight: "900px",
                    backgroundColor: "white"
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
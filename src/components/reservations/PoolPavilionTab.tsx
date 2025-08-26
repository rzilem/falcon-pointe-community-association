import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import TwoImageSlideshow from "@/components/ui/TwoImageSlideshow";
import { CheckCircle, Info, Users } from "lucide-react";
import { useImages } from "@/hooks/useImages";

const PoolPavilionTab = () => {
  const { images, isLoading } = useImages('pool-pavilion');

  // Prepare slideshow images with fallback
  const slideshowImages = {
    image1: {
      src: images[0]?.url || "/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png",
      alt: images[0]?.alt_text || "Pool Pavilion covered seating area with outdoor grills"
    },
    image2: {
      src: images[1]?.url || "/lovable-uploads/fc16efac-61bf-47f5-8eee-4dacc38eae73.png", 
      alt: images[1]?.alt_text || "Pool Pavilion showing pool access and amenities"
    }
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
                  {isLoading ? (
                    <div className="h-64 md:h-72 bg-gray-200 animate-pulse" />
                  ) : (
                    <TwoImageSlideshow
                      image1={slideshowImages.image1}
                      image2={slideshowImages.image2}
                      className="h-64 md:h-72 hover:scale-105 transition-transform duration-1000"
                    />
                  )}
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
      <div className="w-full bg-gradient-to-br from-sky-50 via-sky-100/50 to-blue-100 rounded-lg overflow-hidden shadow-lg">
        <div className="text-center py-3 md:py-4 px-4">
          <h3 className="text-xl font-semibold mb-1 md:mb-2 text-gray-800">Pool Pavilion Reservation</h3>
          <p className="text-gray-600 mb-3 md:mb-4">
            Complete your reservation using the form below.
          </p>
        </div>
        <div className="w-full pb-6">
          <iframe 
            src="https://psprop.net/falcon-pointe-pool-pavilion-reservation/" 
            width="100%" 
            height="1200" 
            frameBorder="0" 
            className="w-full rounded-lg bg-white shadow-inner mx-auto block" 
            title="Pool Pavilion Reservation Form - Book your pool pavilion rental online"
            style={{ minWidth: '100%', maxWidth: '100%' }}
            aria-label="Pool pavilion reservation booking form"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default PoolPavilionTab;

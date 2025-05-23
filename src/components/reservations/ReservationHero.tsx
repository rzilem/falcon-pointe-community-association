
import React from "react";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { Calendar, Clock } from "lucide-react";

const ReservationHero = () => {
  return (
    <div className="relative">
      {/* Hero Image with Increased Height */}
      <div className="relative h-[250px] md:h-[300px] bg-cover bg-center overflow-hidden">
        <ImageDisplay 
          location="reservations-banner" 
          fallbackSrc="/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png" 
          alt="Reservations Banner" 
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-5000" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Amenity Reservations</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Reserve our community spaces for your next private event or gathering
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="container mx-auto px-4 -mt-6 md:-mt-10 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center border-l-4 border-primary flex-1">
            <Calendar className="h-10 w-10 text-primary mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Reservation Notice</h3>
              <p className="text-sm text-gray-600">Reservations must be made at least 7 days in advance</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center border-l-4 border-primary flex-1">
            <Clock className="h-10 w-10 text-primary mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Amenity Hours</h3>
              <p className="text-sm text-gray-600">Available between 8:00 AM and 10:00 PM daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationHero;

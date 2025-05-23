
import React from "react";
import ImageDisplay from "@/components/cms/ImageDisplay";

const ReservationHero = () => {
  return (
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
  );
};

export default ReservationHero;

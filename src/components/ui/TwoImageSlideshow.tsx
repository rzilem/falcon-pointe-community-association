import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface TwoImageSlideshowProps {
  image1: {
    src: string;
    alt: string;
  };
  image2: {
    src: string;
    alt: string;
  };
  className?: string;
}

const TwoImageSlideshow = ({ image1, image2, className = "" }: TwoImageSlideshowProps) => {
  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent className="ml-0">
          <CarouselItem className="pl-0">
            <img 
              src={image1.src} 
              alt={image1.alt}
              className={`w-full object-cover ${className}`}
              loading="lazy"
            />
          </CarouselItem>
          <CarouselItem className="pl-0">
            <img 
              src={image2.src} 
              alt={image2.alt}
              className={`w-full object-cover ${className}`}
              loading="lazy"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-2 h-6 w-6 p-0.5 [&_svg]:h-3 [&_svg]:w-3" />
        <CarouselNext className="right-2 h-6 w-6 p-0.5 [&_svg]:h-3 [&_svg]:w-3" />
      </Carousel>
    </div>
  );
};

export default TwoImageSlideshow;
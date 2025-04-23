
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useImages } from '@/hooks/useImages';
import ImageDisplay from '@/components/cms/ImageDisplay';

const ImageSlider = () => {
  const { images, isLoading } = useImages('home');
  
  if (isLoading) {
    return (
      <div className="h-[500px] bg-gray-200 animate-pulse rounded-md"></div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 h-[500px] rounded-md flex items-center justify-center">
        <p className="text-gray-500">No slider images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full px-12">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative h-[500px] w-full overflow-hidden rounded-md">
                <img 
                  src={image.url} 
                  alt={image.alt_text || 'Community image'}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-2" />
        <CarouselNext className="-right-2" />
      </Carousel>
    </div>
  );
};

export default ImageSlider;

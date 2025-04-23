
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useImages } from '@/hooks/useImages';

const Hero = () => {
  const { images, isLoading } = useImages('home');

  return (
    <div className="relative h-[600px] overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      ) : images && images.length > 0 ? (
        <Carousel className="w-full h-full">
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="relative h-[600px] w-full">
                  <img 
                    src={image.url} 
                    alt={image.alt_text || 'Community image'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 z-10" />
          <CarouselNext className="right-4 z-10" />
        </Carousel>
      ) : (
        <ImageDisplay
          location="home-hero"
          fallbackSrc="/public/lovable-uploads/fc16efac-61bf-47f5-8eee-4dacc38eae73.png"
          alt="Falcon Pointe Community"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Falcon Pointe
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            A premier master-planned community in Pflugerville, Texas, where modern living meets natural beauty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="default">
              <Link to="/about">Learn More</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

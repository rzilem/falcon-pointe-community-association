
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ImageDisplay from "@/components/cms/ImageDisplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useImages } from '@/hooks/useImages';
import { toast } from "sonner";

const Hero = () => {
  const { images, isLoading, error } = useImages('home');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle any errors from image loading
  useEffect(() => {
    if (error) {
      toast.error("Failed to load slide images");
      console.error("Error loading images:", error);
    }
  }, [error]);

  // Auto-advance carousel and track current slide
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    onSelect(); // Initialize with current slide
    
    // Set up autoplay
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000); // Advance every 5 seconds
    
    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi]);

  // Ensure we have some default images to show
  const defaultImages = [
    {
      id: "large-pool",
      url: "/public/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png", // Large Pool image
      alt_text: "Large Pool"
    },
    {
      id: "amenity-center",
      url: "/public/lovable-uploads/229f09a0-dd6e-4287-a457-2523b2859beb.png", // Amenity Center image
      alt_text: "Amenity Center Front"
    },
    {
      id: "community",
      url: "/public/lovable-uploads/fc16efac-61bf-47f5-8eee-4dacc38eae73.png", // Falcon Pointe Community
      alt_text: "Falcon Pointe Community"
    }
  ];
  
  // Use fetched images or fallback to defaults
  const displayImages = (images && images.length > 0) ? images : defaultImages;

  return (
    <div className="relative h-[600px] overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      ) : (
        <Carousel 
          ref={emblaRef}
          className="w-full h-full"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {displayImages.map((image) => (
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
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  selectedIndex === index
                    ? 'bg-white'
                    : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
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

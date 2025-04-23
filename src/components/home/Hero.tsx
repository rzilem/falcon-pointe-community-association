
import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const { images, isLoading, error } = useImages('home');
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Handle any errors from image loading
  useEffect(() => {
    if (error) {
      toast.error("Failed to load slide images");
      console.error("Error loading images:", error);
    }
  }, [error]);

  // Set up the carousel when API is available
  useEffect(() => {
    if (!api) return;
    
    // Get the number of slides and the current slide
    const slideCount = api.scrollSnapList().length;
    setCount(slideCount);
    setCurrent(api.selectedScrollSnap());
    
    // Set up event listener for slide changes
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Set up autoplay with a separate effect
  useEffect(() => {
    if (!api) return;
    
    const autoplay = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000); // Advance every 5 seconds
    
    return () => {
      clearInterval(autoplay);
    };
  }, [api]);

  // Ensure we have some default images to show
  const defaultImages = [
    {
      id: "large-pool",
      url: "/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png", // Large Pool image
      alt_text: "Large Pool"
    },
    {
      id: "amenity-center",
      url: "/lovable-uploads/229f09a0-dd6e-4287-a457-2523b2859beb.png", // Amenity Center image
      alt_text: "Amenity Center Front"
    },
    {
      id: "community",
      url: "/lovable-uploads/fc16efac-61bf-47f5-8eee-4dacc38eae73.png", // Falcon Pointe Community
      alt_text: "Falcon Pointe Community"
    },
    {
      id: "community-overview",
      url: "/lovable-uploads/429c53d6-3597-4902-a560-649b9b18b844.png", // Community Overview image
      alt_text: "Falcon Pointe Community Overview"
    }
  ];
  
  // Use fetched images or fallback to defaults
  const displayImages = (images && images.length > 0) ? images : defaultImages;

  // Function to handle manual navigation
  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      ) : (
        <Carousel 
          setApi={setApi}
          className="w-full h-full"
          opts={{ 
            loop: true,
            skipSnaps: false,
            align: 'start'
          }}
        >
          <CarouselContent>
            {displayImages.map((image, index) => (
              <CarouselItem key={image.id || index}>
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
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none text-white">
            <ChevronLeft className="w-6 h-6" />
          </CarouselPrevious>
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none text-white">
            <ChevronRight className="w-6 h-6" />
          </CarouselNext>
          
          {/* Navigation dots */}
          {count > 0 && (
            <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-3">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    current === index
                      ? 'bg-white scale-110'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </Carousel>
      )}
      
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Falcon Pointe
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            A premier master-planned community in Pflugerville, Texas, where modern living meets natural beauty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="default" className="bg-red-700 hover:bg-red-800">
              <Link to="/about">Learn More</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

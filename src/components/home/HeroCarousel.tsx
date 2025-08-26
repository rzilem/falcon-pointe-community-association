
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroImage {
  id: string;
  url: string;
  alt_text?: string;
}

interface HeroCarouselProps {
  images: HeroImage[];
  isLoading: boolean;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ images, isLoading }) => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Set up the carousel when API is available
  useEffect(() => {
    if (!api) return;
    
    // Get the number of slides and the current slide
    setCount(api.scrollSnapList().length);
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

  // Function to handle manual navigation
  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  if (isLoading) {
    return <div className="absolute inset-0 bg-gray-200 animate-pulse" />;
  }

  return (
    <Carousel 
      setApi={setApi}
      className="w-full h-full"
      opts={{ 
        loop: true,
        skipSnaps: false,
        align: 'start',
      }}
    >
      <CarouselContent>
        {images.map((image, index) => (
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
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="w-6 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 flex items-center justify-center"
            >
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? 'bg-white scale-110'
                  : 'bg-white/50'
              }`} />
            </button>
          ))}
        </div>
      )}
    </Carousel>
  );
};

export default HeroCarousel;

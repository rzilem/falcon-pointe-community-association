
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroCarouselContent from "./HeroCarouselContent";

const Hero = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    const autoplay = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);
    
    return () => {
      clearInterval(autoplay);
    };
  }, [api]);

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      <Carousel 
        setApi={setApi}
        className="w-full h-full"
        opts={{ 
          loop: true,
          skipSnaps: false,
          align: 'start'
        }}
      >
        <HeroCarouselContent />
        
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none text-white">
          <ChevronLeft className="w-6 h-6" />
        </CarouselPrevious>
        
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none text-white">
          <ChevronRight className="w-6 h-6" />
        </CarouselNext>
        
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
    </div>
  );
};

export default Hero;

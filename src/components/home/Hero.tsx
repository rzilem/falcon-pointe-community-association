import React, { useEffect, useState } from "react";
import { Carousel, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroCarouselContent from "./HeroCarouselContent";
import AnimatedContainer from "@/components/ui/animated-container";
const Hero = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  
  // Slide titles for accessibility announcements
  const slideAltTexts = [
    "Welcome to Falcon Pointe - Experience luxury living",
    "Family-Friendly Amenities - Enjoy our splash pad", 
    "Your Dream Home Awaits - Discover beautifully designed homes",
    "Resort-Style Living - Take a dip in our expansive pool"
  ];
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex);
      
      // Announce slide change to screen readers
      const statusElement = document.getElementById('carousel-status');
      if (statusElement && slideAltTexts[newIndex]) {
        statusElement.textContent = `Slide ${newIndex + 1} of ${count}: ${slideAltTexts[newIndex]}`;
      }
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  const [isPlaying, setIsPlaying] = useState(true);
  useEffect(() => {
    if (!api || !isPlaying) return;
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
  }, [api, isPlaying]);
  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };
  return <section className="relative h-[600px] overflow-hidden p-0" aria-label="Hero image carousel">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          aria-label={isPlaying ? "Pause carousel autoplay" : "Start carousel autoplay"}
          aria-pressed={isPlaying}
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </div>
      
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="carousel-status">
        {/* Carousel status will be announced here */}
      </div>
      
      <Carousel setApi={setApi} className="w-full h-full" opts={{
      loop: true,
      skipSnaps: false,
      align: 'start'
    }}>
        <AnimatedContainer animation="fade" className="w-full h-full">
          <HeroCarouselContent />
        </AnimatedContainer>
        
        <CarouselPrevious 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none text-white focus:ring-2 focus:ring-white focus:ring-offset-2" 
          aria-label="Go to previous slide"
        />
        
        <CarouselNext 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none text-white focus:ring-2 focus:ring-white focus:ring-offset-2" 
          aria-label="Go to next slide"
        />
      </Carousel>
      
      {count > 0 && <div className="absolute inset-x-0 bottom-2 sm:bottom-3 md:bottom-4 z-20 flex justify-center gap-2 pointer-events-none">
          {Array.from({
        length: count
      }).map((_, index) => <button 
            key={index} 
            onClick={() => goToSlide(index)} 
            aria-label={`Go to slide ${index + 1} of ${count}`} 
            aria-current={current === index ? "true" : "false"}
            className="pointer-events-auto w-6 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 flex items-center justify-center"
          >
            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${current === index ? 'bg-white scale-110' : 'bg-white/50'}`} />
          </button>)}
        </div>}
    </section>;
};
export default Hero;
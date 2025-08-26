import React, { useEffect, useState } from "react";
import { Carousel, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroCarouselContent from "./HeroCarouselContent";
import AnimatedContainer from "@/components/ui/animated-container";
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
  return <section className="relative h-[600px] overflow-hidden" aria-label="Hero image carousel" aria-live="polite" aria-atomic="false">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause carousel autoplay" : "Start carousel autoplay"} className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </div>
      
      <Carousel setApi={setApi} className="w-full h-full" opts={{
      loop: true,
      skipSnaps: false,
      align: 'start'
    }}>
        <AnimatedContainer animation="fade" className="w-full h-full">
          <HeroCarouselContent />
        </AnimatedContainer>
        
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none text-white" aria-label="Previous slide">
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </CarouselPrevious>
        
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none text-white" aria-label="Next slide">
          <ChevronRight className="w-6 h-6" aria-hidden="true" />
        </CarouselNext>
      </Carousel>
      
      {count > 0 && <div role="tablist" aria-label="Carousel slide selection" className="absolute inset-x-0 bottom-2 sm:bottom-3 md:bottom-4 z-20 flex justify-center gap-3 pointer-events-none">
          {Array.from({
        length: count
      }).map((_, index) => <button key={index} role="tab" onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1} of ${count}`} aria-selected={current === index} tabIndex={current === index ? 0 : -1} className={`pointer-events-auto w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 ${current === index ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'}`} />)}
        </div>}
    </section>;
};
export default Hero;
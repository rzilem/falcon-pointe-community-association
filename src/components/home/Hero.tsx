
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
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Define carousel images with their corresponding text
  const carouselImages = [
    {
      id: "overhead",
      url: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Overhead.jpg",
      title: "Welcome to Falcon Pointe",
      description: "Experience luxury living in our master-planned community in Pflugerville, Texas."
    },
    {
      id: "splash-pad",
      url: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//splash%20pad.jpg",
      title: "Family-Friendly Amenities",
      description: "Enjoy our splash pad and other recreational facilities perfect for the whole family."
    },
    {
      id: "home",
      url: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Home.jpeg",
      title: "Your Dream Home Awaits",
      description: "Discover beautifully designed homes in our vibrant community."
    },
    {
      id: "pool",
      url: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Large%20Pool.jpg",
      title: "Resort-Style Living",
      description: "Take a dip in our expansive pool and enjoy the best of Texas living."
    }
  ];

  // Set up the carousel when API is available
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

  // Set up autoplay
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
        <CarouselContent>
          {carouselImages.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className="relative h-[600px] w-full">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Error loading image: ${image.url}`);
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                      {image.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                      {image.description}
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
    </div>
  );
};

export default Hero;

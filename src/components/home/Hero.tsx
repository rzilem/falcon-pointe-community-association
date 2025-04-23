
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png", 
    title: "Welcome to Falcon Pointe",
    description: "A vibrant master-planned community in Pflugerville, Texas"
  },
  {
    image: "/public/lovable-uploads/fc16efac-61bf-47f5-8eee-4dacc38eae73.png", 
    title: "Beautiful Amenities",
    description: "Enjoy our pools, parks, trails, and sports facilities"
  },
  {
    image: "/public/lovable-uploads/080cd85e-7544-4e3a-98a9-178087f36beb.png",
    title: "Active Lifestyle",
    description: "Five miles of trails and beautiful parks for your enjoyment"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">{slide.title}</h1>
            <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">{slide.description}</p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <a href="#learn-more">Learn More</a>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20" asChild>
                <a href="https://portal.example.com" target="_blank" rel="noopener noreferrer">Resident Portal</a>
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0">
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? "bg-white scale-125" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;


import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import GatedCommunityBadge from "@/components/ui/gated-community-badge";

const carouselImages = [
  {
    id: "welcome",
    url: "/lovable-uploads/6c2a5abb-a4c0-42a6-b7e0-39f8bbfdbf83.png",
    title: "Welcome Home",
    description: "Highpointe POA is a gated master-planned community located in the beautiful Hill Country of Southwest Austin, TX. Our community offers a range of stunning homes and top-notch amenities that will make you feel right at home."
  },
  {
    id: "amenities",
    url: "/lovable-uploads/fc16efac-61bf-47f5-8eee-4dacc38eae73.png",
    title: "Hill Country Living",
    description: "Whether you're looking for a place to relax and unwind, or a place to stay active and engage with your neighbors, Highpointe POA has something for everyone."
  },
  {
    id: "community",
    url: "/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png",
    title: "Gated Community Excellence",
    description: "Take a dip in one of our sparkling swimming pools, enjoy a game of tennis or basketball, or take a peaceful walk or bike ride on one of our many beautiful trails."
  },
  {
    id: "commitment",
    url: "/lovable-uploads/429c53d6-3597-4902-a560-649b9b18b844.png",
    title: "Community Commitment",
    description: "At Highpointe POA, we're committed to providing our residents with the very best in community living. We offer a range of events and activities throughout the year that help bring our community together."
  }
];

const HeroCarouselContent = () => {
  return (
    <CarouselContent>
      {carouselImages.map((image) => (
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
                <div className="mb-4">
                  <GatedCommunityBadge className="text-white bg-white/20 border-white/30" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {image.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                  {image.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="default">
                    <Link to="/about" aria-label="Learn more about Highpointe POA community">Learn More</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                    <Link to="/contact" aria-label="Contact Highpointe POA management team">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
  );
};

export default HeroCarouselContent;

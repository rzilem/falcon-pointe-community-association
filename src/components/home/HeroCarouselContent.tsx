
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";

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

const HeroCarouselContent = () => {
  return (
    <CarouselContent className="ml-0">
      {carouselImages.map((image) => (
        <CarouselItem key={image.id} className="pl-0">
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
            <div className="absolute inset-0 on-image-overlay" />
            <div className="absolute inset-0 on-image-gradient" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 text-center text-white">
                {/* Only first slide should have H1, others use H2 for proper heading hierarchy */}
                {image.id === "overhead" ? (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 text-contrast-shadow">
                    {image.title}
                  </h1>
                ) : (
                  <h2 className="text-4xl md:text-6xl font-bold mb-6 text-contrast-shadow">
                    {image.title}
                  </h2>
                )}
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-contrast-shadow">
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
  );
};

export default HeroCarouselContent;

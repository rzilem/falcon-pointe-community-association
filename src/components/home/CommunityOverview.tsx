
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ImageDisplay from "@/components/cms/ImageDisplay";

const CommunityOverview = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <ImageDisplay 
              location="home-community"
              fallbackSrc="/public/lovable-uploads/6c2a5abb-a4c0-42a6-b7e0-39f8bbfdbf83.png"
              alt="Highpointe POA Community"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">About Highpointe POA</h2>
            <p className="text-gray-600 mb-6">
              Nestled in the beautiful Hill Country of Southwest Austin, Highpointe POA is a gated master-planned community that offers the perfect blend of luxury living and natural beauty. Our community provides a tranquil escape while maintaining convenient access to Austin's vibrant culture and amenities.
            </p>
            <p className="text-gray-600 mb-6">
              From our resort-style amenities to our carefully planned neighborhoods, Highpointe POA creates a family-friendly atmosphere that celebrates community connection and the distinctive charm of Dripping Springs.
            </p>
            <Button asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityOverview;

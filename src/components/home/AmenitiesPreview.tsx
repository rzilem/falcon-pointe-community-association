
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ImageDisplay from "@/components/cms/ImageDisplay";

const amenities = [
  {
    title: "Amenity Center",
    description: "A 4,300 sq. ft. center with meeting spaces and activities",
    location: "amenity-center",
    fallbackImage: "/public/lovable-uploads/229f09a0-dd6e-4287-a457-2523b2859beb.png"
  },
  {
    title: "Pools & Splash Pad",
    description: "Two full-size pools, one kid pool, and a splash pad",
    location: "swimming-pools",
    fallbackImage: "/public/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png"
  },
  {
    title: "Sports Courts",
    description: "Tennis, volleyball, and basketball courts for active residents",
    location: "tennis-courts",
    fallbackImage: "/public/lovable-uploads/4c2a90e2-ed6a-4fd9-9929-d876a2684ba8.png"
  },
  {
    title: "Parks & Trails",
    description: "Five miles of trails, 12 parks, and eight playgrounds",
    location: "parks-trails",
    fallbackImage: "/public/lovable-uploads/1e3c41bc-f71c-4013-957d-4fa60e414905.png"
  }
];

const AmenitiesPreview = () => {
  return (
    <section className="py-12 bg-gray-50" id="learn-more">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Community Amenities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Falcon Pointe offers a wide range of amenities for residents to enjoy. From pools and sports courts to parks and trails, there's something for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-48 overflow-hidden relative">
                <ImageDisplay 
                  location={amenity.location}
                  fallbackSrc={amenity.fallbackImage}
                  alt={amenity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{amenity.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <CardDescription>{amenity.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button asChild>
            <Link to="/amenities">View All Amenities</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesPreview;

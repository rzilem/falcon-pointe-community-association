import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const amenities = [
  {
    title: "Recreation Center",
    description: "Stay active and connected with our state-of-the-art recreational facilities.",
    image: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg", // Updated image URL
    link: "/amenities"
  },
  {
    title: "Swimming Pools",
    description: "Cool off and relax in one of our sparkling swimming pools.",
    image: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Large%20Pool.jpg",
    link: "/amenities"
  },
  {
    title: "Parks and Trails",
    description: "Explore the great outdoors with our scenic parks and walking trails.",
    image: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//park%20and%20pond.jpg",
    link: "/amenities"
  }
];

const AmenitiesPreview = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Community Amenities</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the exceptional lifestyle awaiting you at Falcon Pointe.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={amenity.image} 
                alt={amenity.title} 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{amenity.title}</h3>
                <p className="mb-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {amenity.description}
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white w-full"
                >
                  <Link to={amenity.link}>Learn More</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesPreview;

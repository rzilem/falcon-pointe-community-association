
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryHorizontal } from "lucide-react";
import ImageDisplay from "@/components/cms/ImageDisplay";

const Gallery = () => {
  const images = [
    {
      location: "amenity-center",
      fallbackSrc: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg",
      title: "Amenity Center",
      description: "Our 4,300 sq. ft. community hub"
    },
    {
      location: "swimming-pools",
      fallbackSrc: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Large%20Pool.jpg",
      title: "Swimming Pools",
      description: "Refreshing pools for all ages"
    },
    {
      location: "tennis-courts",
      fallbackSrc: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Large%20Pool.jpg",
      title: "Tennis Courts",
      description: "Professional-grade tennis facilities"
    },
    {
      location: "volleyball-courts",
      fallbackSrc: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Large%20Pool.jpg",
      title: "Volleyball Courts",
      description: "Sand volleyball for beach-style play"
    },
    {
      location: "basketball-court",
      fallbackSrc: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Large%20Pool.jpg",
      title: "Basketball Court",
      description: "Full-sized court for all skill levels"
    },
    {
      location: "parks-trails",
      fallbackSrc: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//Large%20Pool.jpg",
      title: "Parks & Trails",
      description: "Miles of scenic walking trails"
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <GalleryHorizontal className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Community Gallery</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore the beauty and amenities of Falcon Pointe through our photo gallery
          </p>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={image.fallbackSrc}
                      alt={image.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                      <h3 className="font-bold">{image.title}</h3>
                      <p className="text-sm">{image.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;

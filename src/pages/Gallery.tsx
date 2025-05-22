
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryHorizontal } from "lucide-react";

const Gallery = () => {
  // Updated with correct paths (removed /public/ prefix)
  const images = [
    {
      title: "Amenity Center",
      description: "Our 4,300 sq. ft. community hub",
      imagePath: "/lovable-uploads/229f09a0-dd6e-4287-a457-2523b2859beb.png"
    },
    {
      title: "Swimming Pools",
      description: "Refreshing pools for all ages",
      imagePath: "/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png"
    },
    {
      title: "Tennis Courts",
      description: "Professional-grade tennis facilities",
      imagePath: "/lovable-uploads/4c2a90e2-ed6a-4fd9-9929-d876a2684ba8.png"
    },
    {
      title: "Volleyball Courts",
      description: "Sand volleyball for beach-style play",
      imagePath: "/lovable-uploads/080cd85e-7544-4e3a-98a9-178087f36beb.png"
    },
    {
      title: "Basketball Court",
      description: "Full-sized court for all skill levels",
      imagePath: "/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png"
    },
    {
      title: "Parks & Trails",
      description: "Miles of scenic walking trails",
      imagePath: "/lovable-uploads/1e3c41bc-f71c-4013-957d-4fa60e414905.png"
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
                      src={image.imagePath}
                      alt={image.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback in case the image doesn't load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/placeholder.svg";
                      }}
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

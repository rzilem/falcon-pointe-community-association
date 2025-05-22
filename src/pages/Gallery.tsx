
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryHorizontal } from "lucide-react";
import { useImages } from "@/hooks/useImages";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ImageDisplay from "@/components/cms/ImageDisplay";

const Gallery = () => {
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  
  // Use the existing useImages hook to fetch gallery images
  const { images, isLoading, error } = useImages("gallery");
  
  // Define gallery categories
  const categories = [
    { id: "all", name: "All" },
    { id: "amenity-center", name: "Amenity Center" },
    { id: "swimming-pools", name: "Swimming Pools" },
    { id: "tennis-courts", name: "Tennis Courts" },
    { id: "volleyball-courts", name: "Volleyball Courts" },
    { id: "basketball-court", name: "Basketball Court" },
    { id: "parks-trails", name: "Parks & Trails" }
  ];
  
  // Filter images by category if needed
  const filteredImages = currentCategory === "all" 
    ? images 
    : images.filter(image => image.location === currentCategory);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const currentImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
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
          {/* Category filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    currentCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setCurrentCategory(category.id);
                    setCurrentPage(1); // Reset to first page when changing categories
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>Sorry, we couldn't load the gallery images.</p>
              <p>Please try again later.</p>
            </div>
          ) : currentImages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No images found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentImages.map((image, index) => (
                  <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <ImageDisplay 
                          location={image.location}
                          alt={image.alt_text || "Gallery image"}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                          fallbackSrc="/placeholder.svg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                          <h3 className="font-bold">{image.alt_text || "Community Image"}</h3>
                          <p className="text-sm">{image.description || ""}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({length: totalPages}).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;

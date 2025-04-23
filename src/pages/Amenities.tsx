
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContentDisplay from "@/components/cms/ContentDisplay";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { useImages } from "@/hooks/useImages";

const Amenities = () => {
  const { images } = useImages('amenities');

  const amenities = [
    {
      title: "Amenity Center",
      description: "Our 4,300 sq. ft. amenity center serves as the heart of community activities.",
      details: "Featuring meeting spaces, event facilities, and areas for various activities, the amenity center is monitored by a security camera system for residents' safety.",
      image: "https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images//OH%20yeah.jpg",
      location: "amenity-center"
    },
    {
      title: "Swimming Pools",
      description: "Multiple pool options for residents of all ages.",
      details: "Enjoy our two full-size pools, dedicated kid's pool, and exciting splash pad perfect for hot summer days. Lounge areas and shade structures provide comfort for all visitors.",
      image: "/public/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png",
      location: "swimming-pools"
    },
    {
      title: "Tennis Courts",
      description: "Two full-sized tennis courts for casual play or competitive matches.",
      details: "Our well-maintained tennis courts are available for resident use year-round. Court lighting allows for evening play during summer months.",
      image: "/public/lovable-uploads/4c2a90e2-ed6a-4fd9-9929-d876a2684ba8.png",
      location: "tennis-courts"
    },
    {
      title: "Volleyball Courts",
      description: "Two sand volleyball courts for beach-style play.",
      details: "Perfect for friendly games or organized community tournaments, our volleyball courts offer a great way to stay active and meet neighbors.",
      image: "/public/lovable-uploads/080cd85e-7544-4e3a-98a9-178087f36beb.png",
      location: "volleyball-courts"
    },
    {
      title: "Basketball Court",
      description: "Full-sized basketball court for pick-up games and practice.",
      details: "Our basketball court features high-quality goals and surface, with lighting for evening play during summer months.",
      image: "/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png",
      location: "basketball-court"
    },
    {
      title: "Parks & Trails",
      description: "Extensive network of parks and walking trails throughout the community.",
      details: "With five miles of scenic trails, 12 distinct parks, and eight playgrounds, there's always a perfect outdoor space for recreation, relaxation, or exercise.",
      image: "/public/lovable-uploads/1e3c41bc-f71c-4013-957d-4fa60e414905.png",
      location: "parks-trails"
    }
  ];

  const getImageForLocation = (location: string) => {
    const amenityImage = images.find(img => img.location === location);
    return amenityImage?.url;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div
        className="relative h-[300px] bg-cover bg-center"
      >
        <ImageDisplay 
          location="amenities-banner" 
          fallbackSrc="/public/lovable-uploads/080cd85e-7544-4e3a-98a9-178087f36beb.png"
          alt="Amenities Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Community Amenities</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Explore the extensive amenities available to Falcon Pointe residents
            </p>
          </div>
        </div>
      </div>

      {/* Amenities Overview */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <ContentDisplay
              section="amenities-description"
              fallbackTitle="World-Class Amenities"
              fallbackContent={
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Falcon Pointe offers a wide range of amenities designed to enhance residents' quality of life and foster 
                  a strong sense of community. From recreational facilities to natural spaces, there's something for everyone.
                </p>
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <ImageDisplay
                    location={amenity.location}
                    fallbackSrc={amenity.image}
                    alt={amenity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{amenity.title}</CardTitle>
                  <CardDescription className="text-base">{amenity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{amenity.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Amenity Rules Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Amenity Usage Information</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <ContentDisplay
                section="amenities-hours"
                fallbackTitle="Hours of Operation"
                fallbackContent={
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Swimming Pools: 6:00 AM - 10:00 PM (March through October)</li>
                    <li>Tennis & Basketball Courts: 6:00 AM - 10:00 PM (lighted until 10:00 PM)</li>
                    <li>Parks & Trails: Dawn to Dusk</li>
                    <li>Amenity Center: Available for reservation by residents</li>
                  </ul>
                }
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <ContentDisplay
                section="amenities-reservations"
                fallbackTitle="Reservation Information"
                fallbackContent={
                  <>
                    <p className="text-gray-600 mb-4">
                      Some amenities may require reservations for private events or gatherings. 
                      Please contact the management office or use the resident portal to make reservations.
                    </p>
                    <p className="text-gray-600">
                      Amenity center reservations must be made at least two weeks in advance and require 
                      a refundable security deposit.
                    </p>
                  </>
                }
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ContentDisplay
                section="amenities-rules"
                fallbackTitle="Rules & Guidelines"
                fallbackContent={
                  <>
                    <p className="text-gray-600 mb-4">
                      To ensure all residents can enjoy our amenities safely and comfortably, please observe the posted 
                      rules at each facility. General guidelines include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Resident key cards/fobs are required for access to certain amenities</li>
                      <li>Children under 14 must be accompanied by an adult at pools and sports facilities</li>
                      <li>No glass containers at pools or playground areas</li>
                      <li>Please clean up after use of any facility</li>
                      <li>Guests must be accompanied by residents</li>
                      <li>Report any maintenance issues to community management</li>
                    </ul>
                    <p className="mt-4 text-gray-600">
                      For complete rules and guidelines, please refer to the community association documents 
                      available in the resident portal.
                    </p>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Amenities;

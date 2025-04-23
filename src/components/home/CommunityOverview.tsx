
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CommunityOverview = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <img 
              src="/public/lovable-uploads/6c2a5abb-a4c0-42a6-b7e0-39f8bbfdbf83.png" 
              alt="Falcon Pointe Community"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">About Falcon Pointe</h2>
            <p className="text-gray-600 mb-6">
              Falcon Pointe is a master-planned community located in Pflugerville, Texas, home to 
              nearly 1,624 families. Our community offers a unique blend of modern living and 
              natural beauty, with extensive amenities that enhance the quality of life for all residents.
            </p>
            <p className="text-gray-600 mb-6">
              With 1,624 existing homes, Falcon Pointe creates a welcoming neighborhood atmosphere 
              while providing convenient access to local attractions like Typhoon Texas and Dell Diamond. 
              Our residents enjoy a family-friendly environment with diverse housing options.
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

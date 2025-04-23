
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Board = () => {
  const boardMembers = [
    {
      name: "John Smith",
      position: "President",
      bio: "Serving since 2022, John brings 15 years of community leadership experience.",
      image: "/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png"
    },
    {
      name: "Sarah Johnson",
      position: "Vice President",
      bio: "A resident since 2018, Sarah focuses on community engagement and event planning.",
      image: "/public/lovable-uploads/41ef6a9e-81d5-4aa9-9169-bba038eba0f5.png"
    },
    {
      name: "Michael Chen",
      position: "Treasurer",
      bio: "With a background in finance, Michael oversees the community's fiscal responsibilities.",
      image: "/public/lovable-uploads/4c2a90e2-ed6a-4fd9-9929-d876a2684ba8.png"
    },
    {
      name: "Lisa Rodriguez",
      position: "Secretary",
      bio: "Lisa ensures transparent communication between the board and residents.",
      image: "/public/lovable-uploads/ebafe490-e728-4ed8-a428-ff945cb1df98.png"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Board of Directors</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Meet the dedicated team working to maintain and improve our community
          </p>
        </div>
      </div>

      {/* Board Members Grid */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boardMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.position}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Board Responsibilities</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Monthly Meetings</h3>
                <p className="text-gray-600">
                  The Board meets monthly to discuss community matters, review projects, and address resident concerns. 
                  Meetings are held on the first Tuesday of each month at 7:00 PM in the Amenity Center.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Decision Making</h3>
                <p className="text-gray-600">
                  Board members work collaboratively to make decisions that benefit the entire community, 
                  including budget allocation, maintenance priorities, and community improvements.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Get Involved</h3>
                <p className="text-gray-600">
                  Interested in serving on the board? Elections are held annually, and we encourage 
                  residents who want to make a difference to consider running for a position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Board;

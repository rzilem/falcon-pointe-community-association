
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";

const Board = () => {
  const boardMembers = [
    {
      name: "David Alley",
      position: "President",
      bio: "Leading our community with dedication and vision since 2023.",
      email: "david.alley@falconpointecommunity.com",
      image: "/lovable-uploads/6c2a5abb-a4c0-42a6-b7e0-39f8bbfdbf83.png"
    },
    {
      name: "Jerron Knuthson",
      position: "Member at Large",
      bio: "Representing community interests and supporting board initiatives.",
      email: "jerron.knuthson@falconpointecommunity.com",
      image: "/lovable-uploads/229f09a0-dd6e-4287-a457-2523b2859beb.png"
    },
    {
      name: "Mark Armstrong",
      position: "Treasurer",
      bio: "Managing our community's financial health with expertise and transparency.",
      email: "mark.armstrong@falconpointecommunity.com",
      image: "/lovable-uploads/080cd85e-7544-4e3a-98a9-178087f36beb.png"
    },
    {
      name: "Matt Alvers",
      position: "Secretary",
      bio: "Ensuring clear communication and detailed record-keeping for our community.",
      email: "matt.alvers@falconpointecommunity.com",
      image: "/lovable-uploads/fc16efac-61bf-47f5-8eee-4dacc38eae73.png"
    },
    {
      name: "Jeremy Morrow",
      position: "Vice President",
      bio: "Bringing years of community leadership experience to Falcon Pointe.",
      email: "jeremy.morrow@falconpointecommunity.com",
      image: "/lovable-uploads/1e3c41bc-f71c-4013-957d-4fa60e414905.png"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Board of Directors</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Meet the dedicated team working to maintain and improve our Falcon Pointe community
          </p>
        </div>
      </div>

      {/* Board Members Grid */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 flex items-center justify-center bg-primary/5">
                  <User className="h-24 w-24 text-primary/60" />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.position}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{member.bio}</p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${member.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </a>
                  </Button>
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

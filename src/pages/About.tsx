
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Falcon Pointe</h1>
          <p className="text-xl max-w-3xl mx-auto">
            A premier master-planned community in Pflugerville, Texas, offering an exceptional lifestyle for families.
          </p>
        </div>
      </div>

      {/* Community Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center mb-16">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img 
                src="/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png" 
                alt="Falcon Pointe Entrance" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Our Community</h2>
              <p className="text-gray-600 mb-4">
                Falcon Pointe is a thriving community located in Pflugerville, Texas, home to nearly 1,700 families. 
                Established with a vision for creating a close-knit neighborhood with exceptional amenities, 
                Falcon Pointe has grown to be one of the most desirable communities in the area.
              </p>
              <p className="text-gray-600 mb-4">
                With 1,624 existing homes, our community offers diverse housing options that cater to various 
                lifestyles and preferences. The community's strategic location provides convenient access to 
                local attractions like Typhoon Texas and Dell Diamond.
              </p>
              <p className="text-gray-600">
                Our residents enjoy a family-friendly environment with an emphasis on outdoor activities, 
                community engagement, and maintaining a high quality of life.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-16">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
              <img 
                src="/public/lovable-uploads/41ef6a9e-81d5-4aa9-9169-bba038eba0f5.png" 
                alt="Falcon Pointe Home" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Location & Accessibility</h2>
              <p className="text-gray-600 mb-4">
                Situated in Pflugerville, Texas, Falcon Pointe offers the perfect balance of suburban tranquility
                and urban convenience. Our community is strategically located with easy access to major highways,
                making commutes to Austin and surrounding areas convenient for residents.
              </p>
              <p className="text-gray-600 mb-4">
                Within a short drive, residents can enjoy popular attractions such as:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Typhoon Texas Water Park</li>
                <li>Dell Diamond (home of the Round Rock Express)</li>
                <li>The Domain shopping center</li>
                <li>Downtown Austin</li>
                <li>Austin-Bergstrom International Airport</li>
              </ul>
              <p className="text-gray-600">
                The community's location also provides excellent access to top-rated schools, healthcare facilities,
                shopping centers, and dining options.
              </p>
            </div>
          </div>

          {/* Community Vision */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Our Vision & Mission</h2>
            <p className="text-gray-600 mb-8">
              At Falcon Pointe, we are committed to fostering a strong sense of community among residents
              while maintaining and enhancing the value of our neighborhood. Our mission is to create an
              environment where families can thrive, build lasting relationships, and enjoy an exceptional
              quality of life.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <a href="#contact">Contact Us</a>
              </Button>
              <Button variant="outline">
                <a href="/amenities">Explore Amenities</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Interested in becoming a part of the Falcon Pointe community? Explore available homes
            and learn more about what makes our neighborhood special.
          </p>
          <Button asChild size="lg">
            <a href="/contact" id="contact">Get In Touch</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;

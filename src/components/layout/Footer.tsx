import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import ImageDisplay from "@/components/cms/ImageDisplay";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
  const { user, signOut } = useAuth();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <ImageDisplay 
                location="logo"
                fallbackSrc="/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png"
                alt="Highpointe POA Logo" 
                className="h-12 mr-2 bg-white p-1 rounded"
              />
              <div>
                <h2 className="text-xl font-bold">HIGHPOINTE ✝️</h2>
                <p className="text-xs">of Dripping Springs</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm">
              A gated master-planned community in the beautiful Hill Country of Southwest Austin, TX.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/amenities" className="text-gray-300 hover:text-white">Amenities</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white">Events</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resident Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/documents" className="text-gray-300 hover:text-white">Association Documents</Link></li>
              <li><a href="https://portal.example.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Resident Portal</a></li>
              <li><Link to="/board" className="text-gray-300 hover:text-white">Board of Directors</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-white">Photo Gallery</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300 space-y-1">
              <p>Highpointe POA</p>
              <p>410 Cool Spring Way</p>
              <p>Austin, TX 78737</p>
              <p className="mt-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+15128294739" className="hover:underline">
                  (512) 829-4739
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:highpointe@psprop.net"
                  className="hover:underline"
                >
                  highpointe@psprop.net
                </a>
              </p>
              <p className="text-xs mt-3 text-gray-400">
                Professionally Managed by PS Management
              </p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-wrap justify-between items-center gap-4">
          <p className="text-gray-300 text-sm order-1 md:order-2">
            &copy; {new Date().getFullYear()} Highpointe POA of Dripping Springs. All rights reserved.
          </p>
          
          <div className="ml-auto order-2 md:order-1">
            {user ? (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                Admin Logout
              </Button>
            ) : (
              <Button 
                variant="default" 
                asChild 
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Link to="/auth">Admin Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

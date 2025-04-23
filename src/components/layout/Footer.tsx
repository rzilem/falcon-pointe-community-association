
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and Description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png" 
                alt="Falcon Pointe Community" 
                className="h-12 mr-2 bg-white p-1 rounded" 
              />
              <div>
                <h2 className="text-xl font-bold">Falcon Pointe</h2>
                <p className="text-xs">Community Association</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm">
              A master-planned community in Pflugerville, Texas, home to nearly 1,700 families.
            </p>
          </div>

          {/* Column 2: Quick Links */}
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

          {/* Column 3: Resident Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resident Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/documents" className="text-gray-300 hover:text-white">Association Documents</Link></li>
              <li><a href="https://portal.example.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Resident Portal</a></li>
              <li><Link to="/board" className="text-gray-300 hover:text-white">Board of Directors</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-white">Photo Gallery</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p>Falcon Pointe Community Association</p>
              <p>1234 Falcon Pointe Blvd</p>
              <p>Pflugerville, TX 78660</p>
              <p className="mt-2">Phone: (512) 555-1234</p>
              <p>Email: info@falconpointehoa.com</p>
            </address>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} Falcon Pointe Community Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

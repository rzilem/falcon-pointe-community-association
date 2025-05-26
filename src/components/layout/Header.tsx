import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import DropdownNav from './DropdownNav';
import MobileNav from "./MobileNav";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Consolidated navigation structure
  const aboutItems = [
    { title: "Community Overview", href: "/about", description: "Learn about our community's history and values" },
    { title: "Board of Directors", href: "/board", description: "Meet our elected community leaders" },
    { title: "FAQ", href: "/faq", description: "Frequently asked questions and answers" }
  ];

  const amenitiesItems = [
    { title: "All Amenities", href: "/amenities", description: "Explore all community facilities and features" },
    { title: "Facility Reservations", href: "/reservations", description: "Reserve community spaces for events" },
    { title: "Photo Gallery", href: "/gallery", description: "View photos of our beautiful community" }
  ];

  const residentsItems = [
    { title: "News & Events", href: "/news-events", description: "Stay updated with community happenings" },
    { title: "Association Documents", href: "/documents", description: "Access important community documents" },
    { title: "Resident Portal", href: "https://owner.psprop.net", description: "External portal for residents", external: true }
  ];

  return (
    <header className="bg-white shadow-lg relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-4 relative">
          {/* Logo - fixed position on left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/080cd85e-7544-4e3a-98a9-178087f36beb.png" 
                alt="Falcon Pointe Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Falcon Pointe</h1>
                <p className="text-sm text-gray-600">Community Association</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - positioned at 285px from left */}
          <div className="hidden lg:block absolute left-72">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-25">
                <DropdownNav title="About" items={aboutItems} />
                <DropdownNav title="Amenities" items={amenitiesItems} />
                <DropdownNav title="Residents" items={residentsItems} />
                
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-md hover:bg-gray-100 text-lg"
                  >
                    Contact
                  </Link>
                </li>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button - positioned on right */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <MobileNav />}
    </header>
  );
};

export default Header;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import DropdownNav from './DropdownNav';
import MobileNav from "./MobileNav";
import ImageDisplay from '@/components/cms/ImageDisplay';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Consolidated navigation structure with simplified descriptions
  const aboutItems = [
    { title: "Community Overview", href: "/about", description: "Our community's story" },
    { title: "Board of Directors", href: "/board", description: "Meet our leaders" },
    { title: "FAQ", href: "/faq", description: "Common questions" }
  ];

  const amenitiesItems = [
    { title: "All Amenities", href: "/amenities", description: "Community facilities" },
    { title: "Facility Reservations", href: "/reservations", description: "Book community spaces" },
    { title: "Photo Gallery", href: "/gallery", description: "Community photos" }
  ];

  const residentsItems = [
    { title: "News & Events", href: "/news-events", description: "Latest updates" },
    { title: "Association Documents", href: "/documents", description: "Important documents" },
    { title: "Resident Portal", href: "https://owner.psprop.net", description: "Online resident access", external: true }
  ];

  return (
    <header className="bg-white shadow-lg relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-4 relative">
          {/* Logo - fixed position on left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <ImageDisplay 
                location="logo"
                alt="Falcon Pointe Logo" 
                className="h-12 w-auto"
                fallbackSrc="/lovable-uploads/080cd85e-7544-4e3a-98a9-178087f36beb.png"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Falcon Pointe</h1>
                <p className="text-sm text-gray-600">Community Association</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - positioned with separate NavigationMenus */}
          <nav className="hidden lg:block absolute left-64 right-8" aria-label="Main navigation">
            <div className="flex items-center space-x-32">
              <NavigationMenu>
                <NavigationMenuList>
                  <DropdownNav title="About" items={aboutItems} />
                </NavigationMenuList>
              </NavigationMenu>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <DropdownNav title="Amenities" items={amenitiesItems} />
                </NavigationMenuList>
              </NavigationMenu>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <DropdownNav title="Residents" items={residentsItems} />
                </NavigationMenuList>
              </NavigationMenu>
              
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-3 py-3 rounded-md hover:bg-gray-100 text-lg ml-12 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Go to contact page"
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button - positioned on right */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
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

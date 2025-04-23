
import React from "react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png" 
            alt="Falcon Pointe Community" 
            className="h-16 mr-2" 
          />
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-primary">Falcon Pointe</h1>
            <p className="text-sm text-gray-600">Community Association</p>
          </div>
        </Link>

        {/* Navigation */}
        {!isMobile ? (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="px-3 py-2 text-sm font-medium">
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <Link to="/about" className="block p-2 hover:bg-muted rounded-md">
                      Community Overview
                    </Link>
                    <Link to="/board" className="block p-2 hover:bg-muted rounded-md">
                      Board of Directors
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Amenities</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <Link to="/amenities" className="block p-2 hover:bg-muted rounded-md">
                      All Amenities
                    </Link>
                    <Link to="/gallery" className="block p-2 hover:bg-muted rounded-md">
                      Photo Gallery
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Residents</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <Link to="/events" className="block p-2 hover:bg-muted rounded-md">
                      Events & Activities
                    </Link>
                    <Link to="/documents" className="block p-2 hover:bg-muted rounded-md">
                      Association Documents
                    </Link>
                    <a href="https://portal.example.com" target="_blank" rel="noopener noreferrer" className="block p-2 hover:bg-muted rounded-md">
                      Resident Portal
                    </a>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/contact" className="px-3 py-2 text-sm font-medium">
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <Button variant="outline" size="sm">Menu</Button>
        )}
        
        {/* Portal Login Button */}
        {!isMobile && (
          <Button asChild variant="default" size="sm">
            <a href="https://portal.example.com" target="_blank" rel="noopener noreferrer">
              Resident Portal
            </a>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const { user, isAdmin, signOut } = useAuth();

  const handleToggleSection = (section: string) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter(s => s !== section));
    } else {
      setOpenSections([...openSections, section]);
    }
  };

  const handleLinkClick = () => {
    onClose();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[85%] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-center flex items-center justify-center">
            <img 
              src="/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png" 
              alt="Falcon Pointe Community" 
              className="h-12 mr-2" 
            />
            <div>
              <div className="text-xl font-bold text-primary">Falcon Pointe</div>
              <p className="text-xs text-gray-600">Community Association</p>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-3">
          <Collapsible 
            open={openSections.includes('about')}
            onOpenChange={() => handleToggleSection('about')}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between"
                aria-expanded={openSections.includes('about')}
                aria-controls="about-section"
              >
                <span>About</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('about') ? 'transform rotate-180' : ''}`} aria-hidden="true" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-2" id="about-section">
              <Link to="/about" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Community Overview
                </Button>
              </Link>
              <Link to="/board" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Board of Directors
                </Button>
              </Link>
              <Link to="/faq" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  FAQ
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openSections.includes('amenities')}
            onOpenChange={() => handleToggleSection('amenities')}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between"
                aria-expanded={openSections.includes('amenities')}
                aria-controls="amenities-section"
              >
                <span>Amenities</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('amenities') ? 'transform rotate-180' : ''}`} aria-hidden="true" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-2" id="amenities-section">
              <Link to="/amenities" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  All Amenities
                </Button>
              </Link>
              <Link to="/reservations" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Facility Reservations
                </Button>
              </Link>
              <Link to="/gallery" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Photo Gallery
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openSections.includes('residents')}
            onOpenChange={() => handleToggleSection('residents')}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between"
                aria-expanded={openSections.includes('residents')}
                aria-controls="residents-section"
              >
                <span>Residents</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('residents') ? 'transform rotate-180' : ''}`} aria-hidden="true" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-2" id="residents-section">
              <Link to="/news-events" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  News & Events
                </Button>
              </Link>
              <Link to="/documents" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Association Documents
                </Button>
              </Link>
              <a href="https://owner.psprop.net" target="_blank" rel="noopener noreferrer" aria-label="Resident Portal (opens in new tab)" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Resident Portal
                </Button>
              </a>
            </CollapsibleContent>
          </Collapsible>

          <Link to="/contact" onClick={handleLinkClick}>
            <Button variant="ghost" className="w-full justify-start">
              Contact
            </Button>
          </Link>

          {isAdmin && (
            <Link to="/admin" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start font-semibold text-primary">
                Admin Dashboard
              </Button>
            </Link>
          )}

          <div className="pt-4 border-t mt-4">
            {user ? (
              <Button 
                onClick={() => {
                  signOut();
                  handleLinkClick();
                }}
                variant="outline" 
                className="w-full"
              >
                Sign Out
              </Button>
            ) : (
              <Link to="/auth" onClick={handleLinkClick}>
                <Button className="w-full">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

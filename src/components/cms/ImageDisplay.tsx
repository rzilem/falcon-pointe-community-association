
import React, { useState } from 'react';
import { useImage } from '@/hooks/useImages';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import QuickImageReplacement from './QuickImageReplacement';

interface ImageDisplayProps {
  location: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
  showHoverControls?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  location,
  alt = 'Image',
  className = '',
  fallbackSrc,
  style,
  showHoverControls = true
}) => {
  const { image, isLoading } = useImage(location);
  const { isAdmin } = useAuth();
  const [showControls, setShowControls] = useState(false);
  
  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={style}
      ></div>
    );
  }

  const imageSrc = image?.url || fallbackSrc;
  const imageAlt = image?.alt_text || alt;

  if (!imageSrc) {
    return null;
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => showHoverControls && isAdmin && setShowControls(true)}
      onMouseLeave={() => showHoverControls && isAdmin && setShowControls(false)}
    >
      <img 
        src={imageSrc} 
        alt={imageAlt} 
        className={className} 
        style={style}
      />
      
      {showHoverControls && isAdmin && showControls && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                Replace Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quick Image Replacement</DialogTitle>
              </DialogHeader>
              <QuickImageReplacement 
                location={location} 
                onSuccess={() => {
                  toast.success("Image replaced successfully");
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;

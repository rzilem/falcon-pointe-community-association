
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
  const { image, isLoading, error } = useImage(location);
  const { isAdmin } = useAuth();
  const [showControls, setShowControls] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={style}
      ></div>
    );
  }

  // Use image from Supabase if available, otherwise use fallback
  const imageSrc = !imgError && image?.url ? image.url : fallbackSrc;
  const imageAlt = image?.alt_text || alt;

  const handleImageError = () => {
    setImgError(true);
  };

  if (!imageSrc) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={style}>
        <span className="text-gray-500 text-sm">No image available</span>
      </div>
    );
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
        onError={handleImageError}
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
                  setImgError(false);
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

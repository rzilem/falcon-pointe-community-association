
import React, { useState } from 'react';
import { useImage } from '@/hooks/useImages';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
              <QuickImageReplacement location={location} onSuccess={() => {
                toast.success("Image replaced successfully");
              }} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

interface QuickImageReplacementProps {
  location: string;
  onSuccess?: () => void;
}

const QuickImageReplacement: React.FC<QuickImageReplacementProps> = ({ location, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { image } = useImage(location);
  
  const handleReplace = async () => {
    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload the new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      if (image) {
        // Delete the old image
        await supabase.storage
          .from('site-images')
          .remove([image.path]);
          
        // Update the existing record
        const { error: updateError } = await supabase
          .from('site_images')
          .update({
            path: filePath,
            alt_text: altText || image.alt_text,
            description: description || image.description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', image.id);
        
        if (updateError) throw updateError;
      } else {
        // Create a new record
        const { error: insertError } = await supabase
          .from('site_images')
          .insert({
            path: filePath,
            location,
            alt_text: altText || null,
            description: description || null,
            created_by: user?.id
          });
        
        if (insertError) throw insertError;
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Refresh the page to show the new image
      window.location.reload();
    } catch (error) {
      console.error('Error replacing image:', error);
      toast.error('Failed to replace image');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Select New Image
        </label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Alt Text (Optional)
        </label>
        <input 
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder={image?.alt_text || "Image description for accessibility"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Description (Optional)
        </label>
        <input 
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={image?.description || "Internal description for reference"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      
      <Button 
        className="w-full" 
        onClick={handleReplace}
        disabled={uploading || !file}
      >
        {uploading ? 'Uploading...' : 'Replace Image'}
      </Button>
    </div>
  );
};

export default ImageDisplay;

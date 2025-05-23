
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Image } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  existingImageUrl?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, existingImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    try {
      setUploading(true);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      // Upload file to public/lovable-uploads folder
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error uploading file');
      }
      
      const data = await response.json();
      
      // Pass the URL back to parent component
      onImageUploaded(data.url);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Image className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Choose Image'}
          </Button>
          
          {existingImageUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onImageUploaded('')}
              className="text-destructive hover:text-destructive"
            >
              Remove Image
            </Button>
          )}
        </div>
        
        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <p className="text-sm text-gray-500">
        Recommended: JPG, PNG, or GIF. Max size: 5MB.
      </p>
    </div>
  );
};

export default ImageUpload;

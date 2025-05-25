
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { Image, X } from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedImageUploadProps {
  onImageUploaded: (url: string) => void;
  existingImageUrl?: string | null;
  location?: string;
  altText?: string;
  description?: string;
  className?: string;
}

const UnifiedImageUpload: React.FC<UnifiedImageUploadProps> = ({
  onImageUploaded,
  existingImageUrl,
  location = 'general',
  altText: initialAltText = '',
  description: initialDescription = '',
  className = ''
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState(initialAltText);
  const [description, setDescription] = useState(initialDescription);
  const { user } = useAuth();
  const { uploading, uploadImage } = useImageUpload({
    onSuccess: () => {
      setFile(null);
      toast.success('Image uploaded successfully');
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      const filePath = await uploadImage(file, location, {
        altText: altText || undefined,
        description: description || undefined,
        userId: user?.id
      });

      if (filePath) {
        // Get the public URL for the uploaded file
        const { data } = supabase.storage
          .from('site-images')
          .getPublicUrl(filePath);
        
        onImageUploaded(data.publicUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleRemove = () => {
    onImageUploaded('');
    setFile(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="image-upload">Select Image</Label>
        <div className="flex items-center gap-2">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="flex-1"
          />
          {file && (
            <Button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              size="sm"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          )}
        </div>
      </div>

      {file && (
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="alt-text">Alt Text (Optional)</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Internal description for reference"
            />
          </div>

          <div className="mt-2">
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              className="max-h-40 rounded border object-cover"
            />
          </div>
        </div>
      )}

      {existingImageUrl && !file && (
        <div className="space-y-2">
          <Label>Current Image</Label>
          <div className="relative inline-block">
            <img 
              src={existingImageUrl} 
              alt="Current image" 
              className="max-h-40 rounded border object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB.
      </p>
    </div>
  );
};

export default UnifiedImageUpload;

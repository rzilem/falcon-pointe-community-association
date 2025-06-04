
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useImage } from '@/hooks/useImages';
import { useAuth } from '@/context/AuthContext';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const DefaultAnnouncementUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { image: currentImage, isLoading } = useImage('announcement-default');
  const { uploading, uploadImage } = useImageUpload({
    onSuccess: () => {
      setFile(null);
      toast.success('Default announcement image uploaded successfully');
      // Refresh the page to show the new image
      window.location.reload();
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

    await uploadImage(file, 'announcement-default', {
      altText: 'Default announcement banner',
      description: 'Default banner image for email-generated announcements',
      userId: user?.id,
      existingImagePath: currentImage?.path,
      imageId: currentImage?.id
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Default Announcement Banner
        </CardTitle>
        <CardDescription>
          Upload a default banner image that will automatically be assigned to all announcements created from emails. 
          This ensures consistent branding across all community announcements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Image Display */}
        {!isLoading && currentImage?.url && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Default Image:</label>
            <img 
              src={currentImage.url} 
              alt="Current default announcement banner" 
              className="max-h-40 w-full object-cover rounded border"
            />
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-2">
          <label htmlFor="announcement-upload" className="text-sm font-medium">
            {currentImage ? 'Replace Default Image:' : 'Upload Default Image:'}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="announcement-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
            />
            {file && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            )}
          </div>
        </div>

        {/* Preview */}
        {file && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview:</label>
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview of new default announcement banner" 
              className="max-h-40 w-full object-cover rounded border"
            />
          </div>
        )}

        <p className="text-sm text-gray-500">
          Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB. 
          This image will be automatically assigned to all future email announcements.
        </p>
      </CardContent>
    </Card>
  );
};

export default DefaultAnnouncementUpload;

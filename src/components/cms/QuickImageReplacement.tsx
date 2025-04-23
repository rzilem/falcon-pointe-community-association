
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useImage } from '@/hooks/useImages';

interface QuickImageReplacementProps {
  location: string;
  onSuccess?: () => void;
}

const QuickImageReplacement: React.FC<QuickImageReplacementProps> = ({ 
  location,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();
  const { image } = useImage(location);
  const { uploading, uploadImage } = useImageUpload({ onSuccess });

  const handleReplace = async () => {
    if (!file) return;
    
    const result = await uploadImage(file, location, {
      altText,
      description,
      userId: user?.id,
      existingImagePath: image?.path,
      imageId: image?.id
    });

    if (result) {
      // Refresh the page to show the new image
      window.location.reload();
    }
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="file">Select New Image</Label>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="altText">Alt Text (Optional)</Label>
          <Input 
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder={image?.alt_text || "Image description for accessibility"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={image?.description || "Internal description for reference"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleReplace} disabled={uploading || !file}>
          {uploading ? 'Replacing...' : 'Replace Image'}
        </Button>
      </div>
    </>
  );
};

export default QuickImageReplacement;

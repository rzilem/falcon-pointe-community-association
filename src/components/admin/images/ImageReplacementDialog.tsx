
import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageReplacementDialogProps {
  imageId: string;
  currentPath: string;
  location: string;
  onComplete: () => void;
}

const ImageReplacementDialog: React.FC<ImageReplacementDialogProps> = ({ 
  imageId, 
  currentPath,
  location,
  onComplete 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleReplace = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      await supabase.storage
        .from('site-images')
        .remove([currentPath]);
      
      const { error: updateError } = await supabase
        .from('site_images')
        .update({
          path: filePath,
          description: description || null,
          alt_text: altText || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', imageId);
      
      if (updateError) throw updateError;
      
      toast.success('Image replaced successfully');
      onComplete();
    } catch (error) {
      console.error('Error replacing image:', error);
      toast.error('Failed to replace image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Replace Image</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="replace-file">New Image File</Label>
          <Input 
            id="replace-file" 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="replace-description">Description (Optional)</Label>
          <Input 
            id="replace-description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Brief description of the image" 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="replace-altText">Alt Text (Optional)</Label>
          <Input 
            id="replace-altText" 
            value={altText} 
            onChange={(e) => setAltText(e.target.value)} 
            placeholder="Alternative text for accessibility" 
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleReplace} disabled={uploading}>
          {uploading ? 'Replacing...' : 'Replace Image'}
        </Button>
      </div>
    </>
  );
};

export default ImageReplacementDialog;


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseImageUploadProps {
  onSuccess?: () => void;
}

export const useImageUpload = ({ onSuccess }: UseImageUploadProps = {}) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (
    file: File,
    location: string,
    options: {
      description?: string;
      altText?: string;
      userId?: string;
      existingImagePath?: string;
      imageId?: string;
    }
  ) => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log('Uploading file to site-images bucket:', filePath);
      
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', filePath);

      // If we're replacing an existing image, delete it
      if (options.existingImagePath) {
        console.log('Deleting existing image:', options.existingImagePath);
        await supabase.storage
          .from('site-images')
          .remove([options.existingImagePath]);
      }

      if (options.imageId) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('site_images')
          .update({
            path: filePath,
            alt_text: options.altText || null,
            description: options.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', options.imageId);
        
        if (updateError) {
          console.error('Database update error:', updateError);
          throw updateError;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('site_images')
          .insert({
            path: filePath,
            location,
            alt_text: options.altText || null,
            description: options.description || null,
            created_by: options.userId
          });
        
        if (insertError) {
          console.error('Database insert error:', insertError);
          throw insertError;
        }
      }
      
      console.log('Image metadata saved to database');
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast.success('Image uploaded successfully');
      
      // Return the new file path in case it's needed
      return filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadImage
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteImage {
  id: string;
  path: string;
  description: string | null;
  alt_text: string | null;
  location: string;
  created_at: string;
  url?: string;
}

export const useAllImages = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('site_images')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching images:', fetchError);
        throw fetchError;
      }
      
      if (data && data.length > 0) {
        const imagesWithUrls = data.map(img => {
          try {
            // Clean the path - remove any leading slashes for storage API
            const cleanPath = img.path.startsWith('/') ? img.path.substring(1) : img.path;
            
            const { data: urlData } = supabase.storage
              .from('site-images')
              .getPublicUrl(cleanPath);
            
            return { ...img, url: urlData.publicUrl };
          } catch (storageError) {
            console.error('Error getting public URL for image:', storageError);
            return img; // Return image data without URL
          }
        });
        
        setImages(imagesWithUrls);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return { images, isLoading, error, refetch: fetchImages };
};

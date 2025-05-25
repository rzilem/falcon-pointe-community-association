
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteImage {
  id: string;
  path: string;
  description: string | null;
  alt_text: string | null;
  location: string;
  url?: string;
}

export const useImage = (location: string) => {
  const [image, setImage] = useState<SiteImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('site_images')
          .select('*')
          .eq('location', location)
          .eq('active', true)
          .limit(1)
          .maybeSingle();
        
        if (fetchError) {
          console.error(`Error fetching image for location ${location}:`, fetchError);
          throw fetchError;
        }
        
        if (data) {
          try {
            // Clean the path - remove any leading slashes for storage API
            const cleanPath = data.path.startsWith('/') ? data.path.substring(1) : data.path;
            
            const { data: urlData } = supabase.storage
              .from('site-images')
              .getPublicUrl(cleanPath);
            
            setImage({ ...data, url: urlData.publicUrl });
          } catch (storageError) {
            console.error('Error getting public URL for image:', storageError);
            // Still set the image data without URL so admin controls can work
            setImage(data);
          }
        } else {
          setImage(null);
        }
      } catch (err) {
        console.error(`Error fetching image for location ${location}:`, err);
        setError('Failed to load image');
        setImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [location]);

  return { image, isLoading, error };
};

export const useImages = (location: string) => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('site_images')
          .select('*')
          .eq('location', location)
          .eq('active', true)
          .order('created_at', { ascending: false });
        
        if (fetchError) {
          console.error(`Error fetching images for location ${location}:`, fetchError);
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
        console.error(`Error fetching images for location ${location}:`, err);
        setError('Failed to load images');
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [location]);

  return { images, isLoading, error };
};


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
          throw fetchError;
        }
        
        if (data) {
          const url = supabase.storage
            .from('site-images')
            .getPublicUrl(data.path).data.publicUrl;
          
          setImage({ ...data, url });
        } else {
          setImage(null);
        }
      } catch (err) {
        console.error(`Error fetching image for location ${location}:`, err);
        setError('Failed to load image');
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
          throw fetchError;
        }
        
        if (data && data.length > 0) {
          const imagesWithUrls = data.map(img => {
            const url = supabase.storage
              .from('site-images')
              .getPublicUrl(img.path).data.publicUrl;
            
            return { ...img, url };
          });
          
          setImages(imagesWithUrls);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error(`Error fetching images for location ${location}:`, err);
        setError('Failed to load images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [location]);

  return { images, isLoading, error };
};

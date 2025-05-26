
import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ImageUploadForm from '@/components/admin/images/ImageUploadForm';
import ImageList from '@/components/admin/images/ImageList';

interface SiteImage {
  id: string;
  path: string;
  description: string | null;
  location: string;
  created_at: string;
}

const locationOptions = [
  { value: 'amenities', label: 'Amenities Page' },
  { value: 'amenities-banner', label: 'Amenities Banner' },
  { value: 'home', label: 'Home Page' },
  { value: 'home-hero', label: 'Home Hero Image' },
  { value: 'home-community', label: 'Community Overview Image' },
  { value: 'gallery', label: 'Gallery Page' },
  { value: 'about', label: 'About Page' },
  { value: 'about-banner', label: 'About Banner' },
  { value: 'logo', label: 'Site Logo' },
  { value: 'header', label: 'Header Images' },
  { value: 'banner', label: 'General Banners' },
  { value: 'amenity-center', label: 'Amenity Center Photos' },
  { value: 'swimming-pools', label: 'Swimming Pools Photos' },
  { value: 'tennis-courts', label: 'Tennis Courts Photos' },
  { value: 'volleyball-courts', label: 'Volleyball Courts Photos' },
  { value: 'basketball-court', label: 'Basketball Court Photos' },
  { value: 'parks-trails', label: 'Parks & Trails Photos' }
];

const Images = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    try {
      const { error: dbError } = await supabase
        .from('site_images')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      const { error: storageError } = await supabase.storage
        .from('site-images')
        .remove([path]);
      
      if (storageError) {
        console.error('Storage error:', storageError);
      }
      
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Image Management</h1>
        
        <ImageUploadForm 
          onSuccess={fetchImages}
          locationOptions={locationOptions}
        />
        
        <ImageList 
          images={images}
          loading={loading}
          onDelete={handleDelete}
          onUpdateComplete={fetchImages}
        />
      </div>
    </div>
  );
};

export default Images;

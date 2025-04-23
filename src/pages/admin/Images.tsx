import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Trash, Upload, Image, Pencil } from 'lucide-react';

interface SiteImage {
  id: string;
  path: string;
  description: string | null;
  alt_text: string | null;
  location: string;
  active: boolean;
  created_at: string;
}

const Images = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth', { replace: true });
    } else {
      fetchImages();
    }
  }, [isAdmin, navigate]);

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

  const handleUpload = async () => {
    if (!file || !location) {
      toast.error('Please select a file and specify a location');
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);
      
      // Store image metadata in database
      const { error: dbError } = await supabase
        .from('site_images')
        .insert({
          path: filePath,
          description: description || null,
          alt_text: altText || null,
          location,
          created_by: user?.id
        });
      
      if (dbError) throw dbError;
      
      toast.success('Image uploaded successfully');
      setFile(null);
      setDescription('');
      setAltText('');
      setLocation('');
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    try {
      // Delete image metadata from database
      const { error: dbError } = await supabase
        .from('site_images')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('site-images')
        .remove([path]);
      
      if (storageError) {
        console.error('Storage error:', storageError);
        // Don't throw here as we've already deleted the metadata
      }
      
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

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

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Image Management</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload New Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Image File</Label>
                <Input 
                  id="file" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Image Location</Label>
                <select 
                  id="location"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Brief description of the image" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="altText">Alt Text (Optional)</Label>
                <Input 
                  id="altText" 
                  value={altText} 
                  onChange={(e) => setAltText(e.target.value)} 
                  placeholder="Alternative text for accessibility" 
                />
              </div>
              
              <Button onClick={handleUpload} disabled={uploading}>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Images</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Loading images...</p>
            ) : images.length === 0 ? (
              <p className="text-center py-4">No images found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {images.map((image) => (
                      <TableRow key={image.id}>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" className="p-1">
                                <div className="w-16 h-16 relative">
                                  <img 
                                    src={supabase.storage.from('site-images').getPublicUrl(image.path).data.publicUrl}
                                    alt={image.alt_text || 'Site image'} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Image Preview</DialogTitle>
                              </DialogHeader>
                              <img 
                                src={supabase.storage.from('site-images').getPublicUrl(image.path).data.publicUrl}
                                alt={image.alt_text || 'Site image'} 
                                className="w-full h-auto"
                              />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell>{image.location}</TableCell>
                        <TableCell>{image.description || '-'}</TableCell>
                        <TableCell>{new Date(image.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <ImageReplacementDialog 
                                  imageId={image.id} 
                                  currentPath={image.path}
                                  location={image.location}
                                  onComplete={fetchImages}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(image.id, image.path)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

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
  const { user } = useAuth();

  const handleReplace = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      
      // Upload the new file
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Delete the old file
      await supabase.storage
        .from('site-images')
        .remove([currentPath]);
      
      // Update the database record
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

export default Images;

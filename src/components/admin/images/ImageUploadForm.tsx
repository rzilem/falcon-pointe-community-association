
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadFormProps {
  onSuccess: () => void;
  locationOptions: Array<{ value: string; label: string; }>;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onSuccess, locationOptions }) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleUpload = async () => {
    if (!file || !location) {
      toast.error('Please select a file and specify a location');
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
      onSuccess();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
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
  );
};

export default ImageUploadForm;

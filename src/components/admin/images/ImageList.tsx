
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Trash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ImageReplacementDialog from './ImageReplacementDialog';

interface SiteImage {
  id: string;
  path: string;
  description: string | null;
  location: string;
  created_at: string;
}

interface ImageListProps {
  images: SiteImage[];
  loading: boolean;
  onDelete: (id: string, path: string) => Promise<void>;
  onUpdateComplete: () => void;
}

const ImageList: React.FC<ImageListProps> = ({ 
  images, 
  loading, 
  onDelete,
  onUpdateComplete
}) => {
  if (loading) {
    return <p className="text-center py-4">Loading images...</p>;
  }

  if (images.length === 0) {
    return <p className="text-center py-4">No images found</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Images</CardTitle>
      </CardHeader>
      <CardContent>
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
                              alt={image.description || 'Site image'} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <img 
                          src={supabase.storage.from('site-images').getPublicUrl(image.path).data.publicUrl}
                          alt={image.description || 'Site image'} 
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
                            onComplete={onUpdateComplete}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(image.id, image.path)}
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
      </CardContent>
    </Card>
  );
};

export default ImageList;

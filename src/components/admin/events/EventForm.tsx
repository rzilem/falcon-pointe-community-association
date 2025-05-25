
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import UnifiedImageUpload from '../images/UnifiedImageUpload';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  image_path: string | null;
  is_featured: boolean;
  category: string | null;
  created_at: string;
}

interface EventFormProps {
  event?: Event;
  onSuccess: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('community');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setTime(event.time);
      setDescription(event.description);
      setLocation(event.location);
      setCategory(event.category || 'community');
      setIsFeatured(event.is_featured);
      setImagePath(event.image_path);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !time || !description || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const eventData = {
        title,
        date,
        time,
        description,
        location,
        category,
        is_featured: isFeatured,
        image_path: imagePath,
        created_by: user?.id
      };

      let error;

      if (event) {
        // Update existing event
        const { error: updateError } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);
        error = updateError;
      } else {
        // Create new event
        const { error: insertError } = await supabase
          .from('events')
          .insert([eventData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(event ? 'Event updated successfully' : 'Event created successfully');
      
      if (!event) {
        // Reset form for new event
        setTitle('');
        setDate('');
        setTime('');
        setDescription('');
        setLocation('');
        setCategory('community');
        setIsFeatured(false);
        setImagePath(null);
      }
      
      onSuccess();
      
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUploaded = (url: string) => {
    if (url) {
      // Extract the file path from the full URL if it's a Supabase URL
      if (url.includes('/storage/v1/object/public/site-images/')) {
        const pathMatch = url.match(/\/storage\/v1\/object\/public\/site-images\/(.+)$/);
        if (pathMatch) {
          setImagePath(pathMatch[1]);
        } else {
          setImagePath(url);
        }
      } else {
        setImagePath(url);
      }
    } else {
      setImagePath(null);
    }
  };

  const getImageDisplayUrl = () => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // If it's a Supabase storage path, get the public URL
    const { data } = supabase.storage
      .from('site-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  const categories = [
    'community',
    'holiday',
    'social',
    'meeting',
    'sport',
    'other'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {event ? 'Edit Event' : 'Create New Event'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 2:00 PM - 4:00 PM"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event location"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Event Image</Label>
            <UnifiedImageUpload
              onImageUploaded={handleImageUploaded}
              existingImageUrl={getImageDisplayUrl()}
              location={`event-${title.toLowerCase().replace(/\s+/g, '-')}`}
              altText={title}
              description={`Image for ${title} event`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
            <Label htmlFor="featured">Featured Event (appears on homepage)</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? (
                event ? 'Updating...' : 'Creating...'
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;

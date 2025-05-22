
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Event } from '@/hooks/useEvents';
import { Switch } from '@/components/ui/switch';
import { useImageUpload } from '@/hooks/useImageUpload';

interface EventFormProps {
  event?: Event | null;
  userId?: string;
  onSaved: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  userId,
  onSaved,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    event?.date ? new Date(event.date) : new Date()
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { uploading, uploadImage } = useImageUpload();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: event?.title || '',
      time: event?.time || '',
      location: event?.location || '',
      description: event?.description || '',
      is_featured: event?.is_featured || false,
      category: event?.category || 'general',
    }
  });
  
  const onSubmit = async (data: any) => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imagePath = event?.image_path;
      
      // If a new image was selected, upload it
      if (imageFile) {
        // Upload the image to Supabase Storage
        imagePath = await uploadImage(
          imageFile,
          'events',
          {
            description: data.title,
            altText: data.title,
            userId,
            existingImagePath: event?.image_path,
          }
        );
        
        if (!imagePath) {
          throw new Error('Failed to upload image');
        }
      }
      
      const eventData = {
        title: data.title,
        date: format(date, 'yyyy-MM-dd'),
        time: data.time,
        location: data.location,
        description: data.description,
        image_path: imagePath,
        is_featured: data.is_featured,
        category: data.category,
        created_by: userId,
      };
      
      if (event?.id) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);
        
        if (error) throw error;
        
        toast.success('Event updated successfully');
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([eventData]);
        
        if (error) throw error;
        
        toast.success('Event created successfully');
      }
      
      onSaved();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          placeholder="Summer Pool Party"
          {...register('title', { required: 'Event title is required' })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message as string}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Event Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Event Time</Label>
          <Input
            id="time"
            placeholder="2:00 PM - 6:00 PM"
            {...register('time', { required: 'Event time is required' })}
          />
          {errors.time && (
            <p className="text-sm text-red-500">{errors.time.message as string}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Main Community Pool"
          {...register('location', { required: 'Location is required' })}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message as string}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Join us for our annual summer celebration with food, games, and pool activities."
          rows={4}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message as string}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Event Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {event?.url && !imageFile && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">Current image:</p>
            <img 
              src={event.url} 
              alt={event.title} 
              className="h-24 object-cover rounded-md" 
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="is_featured"
          {...register('is_featured')} 
          defaultChecked={event?.is_featured || false}
        />
        <Label htmlFor="is_featured">Featured Event</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full border border-gray-300 rounded-md p-2"
          {...register('category')}
        >
          <option value="general">General</option>
          <option value="social">Social</option>
          <option value="meeting">Meeting</option>
          <option value="sports">Sports</option>
          <option value="holiday">Holiday</option>
          <option value="kids">Kids</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting || uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            event?.id ? 'Update Event' : 'Create Event'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
